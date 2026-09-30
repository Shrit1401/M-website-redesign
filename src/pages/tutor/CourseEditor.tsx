import clsx from 'clsx'
import { ArrowLeft, GripVertical, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { CourseImage, PageHeader } from '../../components/ui'
import type { Course, LessonType, Level } from '../../data/types'
import { duration, money, slugify, totalMinutes } from '../../lib/utils'
import { today, uid, useStore } from '../../store/store'

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced', 'All levels']
const STEPS = ['Basics', 'Details', 'Curriculum', 'Pricing'] as const
const COVERS = ['hero-2', 'hero-4', 'team', 'c-fullstack', 'c-react', 'c-ml', 'c-comm-basic', 'c-ux', 'c-music', 'c-finance', 'c-med', 'c-cad'].map((n) => `/img/${n}.jpg`)

function blank(tutorId: string): Course {
  return {
    id: '', title: '', subtitle: '', category: 'Development', level: 'Beginner', price: 199, rating: 0, reviews: 0, students: 0, tutorId,
    status: 'draft', hue: Math.floor(Math.random() * 360), description: '', outcomes: [''], requirements: [''], updated: today(),
    curriculum: [{ id: uid('s'), title: 'Introduction', lessons: [{ id: uid('l'), title: 'Welcome', minutes: 5, type: 'video', preview: true }] }],
  }
}

function ListEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className="field" value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="btn-icon" aria-label="Remove"><X className="size-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ''])} className="btn-ghost btn-sm px-2"><Plus className="size-4" /> Add</button>
      </div>
    </div>
  )
}

export default function CourseEditor() {
  const { id } = useParams()
  const store = useStore()
  const { db, user } = store
  const nav = useNavigate()
  const existing = id ? db.courses.find((c) => c.id === id && c.tutorId === user!.id) : undefined
  const [c, setC] = useState<Course>(() => existing ? structuredClone(existing) : blank(user!.id))
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')

  if (id && !existing) return <Navigate to="/tutor/courses" replace />
  const set = <K extends keyof Course>(k: K, v: Course[K]) => setC((x) => ({ ...x, [k]: v }))

  const setSection = (si: number, patch: Partial<Course['curriculum'][0]>) => set('curriculum', c.curriculum.map((s, i) => (i === si ? { ...s, ...patch } : s)))
  const setLesson = (si: number, li: number, patch: Partial<Course['curriculum'][0]['lessons'][0]>) =>
    setSection(si, { lessons: c.curriculum[si].lessons.map((l, i) => (i === li ? { ...l, ...patch } : l)) })

  const save = (status: Course['status']) => {
    if (!c.title.trim()) {
      setStep(0)
      return setError('Please give your course a title.')
    }
    const courseId = c.id || `${slugify(c.title)}-${Math.random().toString(36).slice(2, 5)}`
    store.saveCourse({
      ...c,
      id: courseId,
      status,
      updated: today(),
      outcomes: c.outcomes.filter((o) => o.trim()),
      requirements: c.requirements.filter((o) => o.trim()),
    })
    store.toast(status === 'pending' ? 'Submitted for admin review' : 'Draft saved')
    nav('/tutor/courses')
  }

  return (
    <>
      <Link to="/tutor/courses" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted font-medium hover:text-ink dark:hover:text-white"><ArrowLeft className="size-4" /> Back to courses</Link>
      <PageHeader
        title={existing ? 'Edit course' : 'Create a new course'}
        subtitle={existing?.status === 'published' ? 'Changes to a published course go live immediately.' : 'Save as a draft anytime, then submit for review.'}
        action={
          <div className="flex gap-2">
            {existing?.status === 'published' ? (
              <button onClick={() => save('published')} className="btn-primary">Save changes</button>
            ) : (
              <>
                <button onClick={() => save('draft')} className="btn-secondary">Save draft</button>
                <button onClick={() => save('pending')} className="btn-primary">Submit for review</button>
              </>
            )}
          </div>
        }
      />
      {error && <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700 dark:bg-rose-400/10 dark:text-rose-300">{error}</p>}

      <ol className="mb-6 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button onClick={() => setStep(i)} className="group w-full text-left">
              <span className={clsx('block h-1 rounded-full transition-colors', i <= step ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10')} />
              <span className={clsx('mt-2 block text-xs font-medium', i === step ? 'text-brand-600 dark:text-brand-400' : 'text-muted group-hover:text-ink dark:group-hover:text-white')}>
                <span className="hidden sm:inline">Step {i + 1} · </span>{s}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="panel space-y-5 p-6">
          {step === 0 && (
            <>
              <div><label className="label">Course title</label><input className="field" value={c.title} onChange={(e) => { set('title', e.target.value); setError('') }} placeholder="e.g. Communication Skills — Basic" maxLength={80} /></div>
              <div><label className="label">Subtitle</label><input className="field" value={c.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="One sentence that sells the outcome" maxLength={140} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">Category</label><select className="field" value={c.category} onChange={(e) => set('category', e.target.value)}>{db.categories.map((x) => <option key={x}>{x}</option>)}</select></div>
                <div><label className="label">Level</label><select className="field" value={c.level} onChange={(e) => set('level', e.target.value as Level)}>{LEVELS.map((x) => <option key={x}>{x}</option>)}</select></div>
              </div>
              <div>
                <label className="label">Course image</label>
                <p className="-mt-1 mb-2.5 text-xs text-muted">Choose a cover from the library. In production this would be an upload.</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {COVERS.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => set('image', src)}
                      className={clsx('overflow-hidden rounded-md ring-2 ring-offset-2 transition dark:ring-offset-[#0a083b]', c.image === src ? 'ring-brand-500' : 'ring-transparent hover:ring-slate-300')}
                      aria-label="Use this image"
                      aria-pressed={c.image === src}
                    >
                      <img src={src} alt="" className="aspect-video w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div><label className="label">Description</label><textarea className="field-area" rows={5} value={c.description} onChange={(e) => set('description', e.target.value)} placeholder="What will learners get from this course?" /></div>
              <ListEditor label="What learners will learn" items={c.outcomes} onChange={(v) => set('outcomes', v)} placeholder="e.g. Build responsive layouts" />
              <ListEditor label="Requirements" items={c.requirements} onChange={(v) => set('requirements', v)} placeholder="e.g. No experience needed" />
            </>
          )}
          {step === 2 && (
            <div className="space-y-4">
              {c.curriculum.map((s, si) => (
                <div key={s.id} className="rounded-lg border border-line p-4 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted">S{si + 1}</span>
                    <input className="field h-9 font-medium" value={s.title} onChange={(e) => setSection(si, { title: e.target.value })} />
                    <button onClick={() => set('curriculum', c.curriculum.filter((_, i) => i !== si))} className="btn-icon hover:text-rose-600" aria-label="Delete section"><Trash2 className="size-4" /></button>
                  </div>
                  <div className="mt-3 space-y-2 pl-6">
                    {s.lessons.map((l, li) => (
                      <div key={l.id} className="flex flex-wrap items-center gap-2 rounded-md bg-surface p-2 dark:bg-white/5">
                        <GripVertical className="size-4 text-muted" />
                        <input className="field h-9 min-w-40 flex-1" value={l.title} onChange={(e) => setLesson(si, li, { title: e.target.value })} />
                        <select className="field h-9 w-auto" value={l.type} onChange={(e) => setLesson(si, li, { type: e.target.value as LessonType })}>
                          <option value="video">Video</option><option value="reading">Reading</option><option value="quiz">Quiz</option>
                        </select>
                        <input type="number" min={1} className="field h-9 w-20" value={l.minutes} onChange={(e) => setLesson(si, li, { minutes: Math.max(1, Number(e.target.value)) })} title="Minutes" />
                        <label className="flex items-center gap-1.5 text-xs text-muted"><input type="checkbox" checked={!!l.preview} onChange={(e) => setLesson(si, li, { preview: e.target.checked })} /> Preview</label>
                        <button onClick={() => setSection(si, { lessons: s.lessons.filter((_, i) => i !== li) })} className="btn-icon size-8 hover:text-rose-600" aria-label="Delete lesson"><X className="size-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => setSection(si, { lessons: [...s.lessons, { id: uid('l'), title: 'New lesson', minutes: 10, type: 'video' }] })} className="btn-ghost btn-sm px-2"><Plus className="size-4" /> Add lesson</button>
                  </div>
                </div>
              ))}
              <button onClick={() => set('curriculum', [...c.curriculum, { id: uid('s'), title: `Section ${c.curriculum.length + 1}`, lessons: [] }])} className="btn-secondary h-11 w-full border-dashed"><Plus className="size-4" /> Add section</button>
            </div>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="label">Price (USD)</label>
                <div className="relative max-w-xs"><span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">$</span><input type="number" min={0} className="field pl-7" value={c.price} onChange={(e) => set('price', Math.max(0, Number(e.target.value)))} /></div>
              </div>
              <div className="rounded-lg bg-brand-50 p-4 text-[13px] text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">
                You'll earn <strong>{money(Math.round(c.price * 0.7))}</strong> per sale (70% revenue share).
              </div>
              <div className="flex flex-wrap gap-2">
                {[99, 199, 299, 499, 999].map((p) => <button key={p} onClick={() => set('price', p)} className={clsx('tag border px-3 py-1.5 text-sm', c.price === p ? 'border-brand-500 bg-brand-500 text-on-brand' : 'border-line dark:border-white/15')}>${p}</button>)}
              </div>
            </>
          )}
          <div className="flex justify-between border-t border-line pt-5 dark:border-white/10">
            <button disabled={step === 0} onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>
            {step < STEPS.length - 1 && <button onClick={() => setStep(step + 1)} className="btn-primary">Continue</button>}
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <p className="mb-3 text-xs font-medium text-muted">Live preview</p>
          <div className="panel overflow-hidden">
            <CourseImage src={c.image} hue={c.hue} category={c.category} className="aspect-[16/10]" />
            <div className="p-4">
              <span className="text-xs font-medium text-muted">{c.category}</span>
              <h3 className="mt-1 font-medium">{c.title || "Untitled course"}</h3>
              <p className="mt-1 text-[13px] text-muted">{user!.name}</p>
              <p className="mt-2 text-xs text-muted">{c.curriculum.reduce((s, x) => s + x.lessons.length, 0)} lessons · {duration(totalMinutes(c))} · {c.level}</p>
              <p className="mt-3 text-lg font-medium">{money(c.price)}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
