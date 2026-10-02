'use client'

import clsx from 'clsx'
import { ArrowLeft, Award, Check, ChevronLeft, ChevronRight, Pause, Play, Volume2, Maximize, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from '@/lib/router'
import { Logo, Modal } from '../../components/ui'
import type { Lesson } from '../../data/types'
import { date, duration, lessons, progress } from '../../lib/utils'
import { useStore } from '../../store/store'
import { LESSON_ICON } from '../../lib/icons'

function Ring({ value }: { value: number }) {
  const r = 16
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-10">
      <svg viewBox="0 0 40 40" className="size-10 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-white/15" />
        <circle cx="20" cy="20" r={r} fill="none" stroke="#467ff7" strokeWidth="3" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-medium">{value}%</span>
    </div>
  )
}

function VideoStage({ lesson, onEnd, poster }: { lesson: Lesson; onEnd: () => void; poster?: string }) {
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  useEffect(() => {
    setPlaying(false)
    setT(0)
  }, [lesson.id])
  useEffect(() => {
    if (!playing) return
    const i = setInterval(() => setT((x) => Math.min(x + 1, 100)), 80)
    return () => clearInterval(i)
  }, [playing])
  useEffect(() => {
    if (playing && t >= 100) {
      setPlaying(false)
      onEnd()
    }
  }, [t, playing, onEnd])
  const secs = Math.round((lesson.minutes * 60 * t) / 100)
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-black">
      {poster && <img src={poster} alt="" className={clsx('mono absolute inset-0 size-full object-cover transition-opacity duration-700', playing ? 'opacity-15' : 'opacity-45')} />}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,.65)_85%)]" />
      <div className="absolute inset-0 grid place-items-center">
        <button onClick={() => setPlaying(!playing)} className="grid size-[72px] place-items-center rounded-full bg-white text-[#1c244b] transition hover:scale-105" aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause className="size-7 fill-[#1c244b]" /> : <Play className="ml-1 size-7 fill-[#1c244b]" />}
        </button>
      </div>
      <p className="absolute top-5 left-6 text-sm font-medium text-white/70">{lesson.title}</p>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-10 pb-4 text-white">
        <div className="h-1 cursor-pointer rounded-full bg-white/20" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setT(Math.round(((e.clientX - r.left) / r.width) * 100)) }}>
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${t}%` }} />
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <button onClick={() => setPlaying(!playing)} aria-label="Play/pause">{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
          <Volume2 className="size-4" />
          <span className="tabular-nums text-white/70">{fmt(secs)} / {fmt(lesson.minutes * 60)}</span>
          <span className="ml-auto rounded bg-white/10 px-1.5 text-xs">1x</span>
          <Maximize className="size-4" />
        </div>
      </div>
    </div>
  )
}

function ReadingStage({ lesson }: { lesson: Lesson }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="kicker">Reading · {duration(lesson.minutes)}</p>
      <h2 className="mt-2 text-2xl font-semibold">{lesson.title}</h2>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
        <p>This reading consolidates the key ideas from the previous lessons. Skim the headings first, then read in detail and jot down one thing you'll apply this week.</p>
        <h3 className="text-lg font-medium text-ink dark:text-white">Key takeaways</h3>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Start with the outcome you want, then work backwards.</li>
          <li>Practise in small, frequent sessions rather than long ones.</li>
          <li>Teach what you learn — explaining is the fastest way to understand.</li>
        </ul>
        <p className="rounded-lg border-l-4 border-brand-500 bg-brand-50 p-4 text-brand-700 dark:bg-brand-400/10 dark:text-brand-200">Tip: mark this lesson complete when you're done to keep your streak going.</p>
      </div>
    </div>
  )
}

function QuizStage({ lesson, onPass }: { lesson: Lesson; onPass: () => void }) {
  const qs = [
    { q: 'What is the most effective way to retain new knowledge?', a: ['Re-reading notes', 'Spaced practice & recall', 'Highlighting', 'Watching at 2x'], correct: 1 },
    { q: 'When should you mark a lesson complete?', a: ['Before starting', 'After finishing and reflecting', 'Never', 'Only on weekends'], correct: 1 },
  ]
  const [ans, setAns] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => { setAns({}); setSubmitted(false) }, [lesson.id])
  const score = qs.filter((q, i) => ans[i] === q.correct).length
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="kicker">Quiz</p>
      <h2 className="mt-2 text-2xl font-semibold">{lesson.title}</h2>
      <div className="mt-8 space-y-6">
        {qs.map((q, i) => (
          <div key={i}>
            <p className="font-medium">{i + 1}. {q.q}</p>
            <div className="mt-3 grid gap-2">
              {q.a.map((a, j) => (
                <button
                  key={j}
                  disabled={submitted}
                  onClick={() => setAns({ ...ans, [i]: j })}
                  className={clsx(
                    'rounded-xl border px-4 py-3 text-left text-sm transition',
                    submitted && j === q.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                      : submitted && ans[i] === j ? 'border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
                      : ans[i] === j ? 'border-brand-500 bg-brand-50 dark:bg-brand-400/10' : 'border-line hover:border-slate-300 dark:border-white/15',
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {submitted ? (
        <div className="mt-8 flex items-center justify-between rounded-xl bg-black/[0.04] p-4 dark:bg-white/5">
          <span className="font-medium">You scored {score}/{qs.length}</span>
          <button onClick={() => { setAns({}); setSubmitted(false) }} className="btn-secondary">Retry</button>
        </div>
      ) : (
        <button disabled={Object.keys(ans).length < qs.length} onClick={() => { setSubmitted(true); if (score === qs.length) onPass() }} className="btn-primary mt-8">Submit answers</button>
      )}
    </div>
  )
}

export default function Player() {
  const { id } = useParams()
  const store = useStore()
  const { db, user } = store
  const course = db.courses.find((c) => c.id === id)
  const enrollment = db.enrollments.find((e) => e.userId === user?.id && e.courseId === id)
  const all = useMemo(() => (course ? lessons(course) : []), [course])
  const [currentId, setCurrentId] = useState(() => enrollment?.lastLessonId ?? all.find((l) => !enrollment?.completed.includes(l.id))?.id ?? all[0]?.id)
  const [sidebar, setSidebar] = useState(true)
  const [cert, setCert] = useState(false)
  const [tab, setTab] = useState<'content' | 'overview' | 'notes'>('overview')
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem(`revive-notes-${id}`) ?? '' } catch { return '' }
  })

  const current = all.find((l) => l.id === currentId) ?? all[0]
  const idx = all.findIndex((l) => l.id === current?.id)
  const pct = course ? progress(course, enrollment) : 0
  const done = (lid: string) => enrollment?.completed.includes(lid) ?? false

  useEffect(() => {
    if (course && current) store.setLastLesson(course.id, current.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id])

  const complete = useMemo(() => () => {
    if (!course || !current) return
    const wasDone = done(current.id)
    if (!wasDone) {
      store.markLesson(course.id, current.id, true)
      const remaining = all.filter((l) => !done(l.id) && l.id !== current.id).length
      if (remaining === 0) setCert(true)
      else store.toast('Lesson complete ✓')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course, current, enrollment])

  if (!user) return <Navigate to={`/login?next=/learn/${id}`} replace />
  if (!course) return <Navigate to="/dashboard/learning" replace />
  if (!enrollment) return <Navigate to={`/courses/${id}`} replace />

  const go = (d: number) => {
    const n = all[idx + d]
    if (n) setCurrentId(n.id)
  }

  const contentList = (
    <>
  {course.curriculum.map((s, si) => (
    <div key={s.id}>
      <p className="bg-surface px-4 py-2.5 text-xs font-medium dark:bg-white/[0.03]">Section {si + 1}: {s.title}</p>
      {s.lessons.map((l) => {
        const Icon = LESSON_ICON[l.type]
        return (
          <button key={l.id} onClick={() => setCurrentId(l.id)} className={clsx('flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition', l.id === current.id ? 'bg-brand-50 dark:bg-brand-400/10' : 'hover:bg-surface dark:hover:bg-white/5')}>
            <span
              role="checkbox"
              aria-checked={done(l.id)}
              onClick={(e) => { e.stopPropagation(); store.markLesson(course.id, l.id, !done(l.id)) }}
              className={clsx('mt-0.5 grid size-4 shrink-0 place-items-center rounded border', done(l.id) ? 'border-brand-500 bg-brand-500 text-on-brand' : 'border-slate-300 dark:border-white/30')}
            >
              {done(l.id) && <Check className="size-3" strokeWidth={3} />}
            </span>
            <span className="flex-1">
              <span className="block leading-snug">{l.title}</span>
              <span className="mt-1 flex items-center gap-1 text-xs text-muted"><Icon className="size-3" /> {duration(l.minutes)}</span>
            </span>
          </button>
        )
      })}
    </div>
  ))}
    </>
  )

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center gap-4 bg-[#0a083b] px-4 text-white">
        <Link to="/dashboard/learning" className="btn -ml-2 w-10 px-0 text-white hover:bg-white/10" aria-label="Back to my learning"><ArrowLeft className="size-[18px]" /></Link>
        <div className="hidden sm:block"><Logo light /></div>
        <span className="hidden h-5 w-px bg-white/15 sm:block" />
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium">{course.title}</h1>
        <Ring value={pct} />
        <button onClick={() => setSidebar(!sidebar)} className="btn hidden w-10 px-0 text-white hover:bg-white/10 md:inline-flex" aria-label="Toggle course content">
          {sidebar ? <PanelRightClose className="size-[18px]" /> : <PanelRightOpen className="size-[18px]" />}
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-y-auto">
          {current.type === 'video' && <VideoStage lesson={current} onEnd={complete} poster={course.image} />}
          {current.type === 'reading' && <ReadingStage lesson={current} />}
          {current.type === 'quiz' && <QuizStage lesson={current} onPass={complete} />}
          <div className="mx-auto max-w-4xl px-6 py-6">
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => go(-1)} disabled={idx === 0} className="btn-secondary"><ChevronLeft className="size-4" /> Previous</button>
              <button
                onClick={() => (done(current.id) ? store.markLesson(course.id, current.id, false) : complete())}
                className={done(current.id) ? 'btn-secondary' : 'btn-primary'}
              >
                <Check className="size-4" /> {done(current.id) ? 'Completed' : 'Mark as complete'}
              </button>
              <button onClick={() => go(1)} disabled={idx === all.length - 1} className="btn-primary ml-auto">Next <ChevronRight className="size-4" /></button>
            </div>
            <div className="mt-8 flex gap-6 border-b border-line text-sm dark:border-white/10">
              {(['content', 'overview', 'notes'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={clsx('-mb-px border-b-2 pb-3 font-medium', t === 'content' && 'md:hidden', tab === t ? 'border-brand-500' : 'border-transparent text-muted hover:text-ink dark:hover:text-white')}>
                  {t === 'content' ? 'Course content' : t === 'overview' ? 'Overview' : 'Notes'}
                </button>
              ))}
            </div>
            {tab === 'content' ? (
              <div className="-mx-6 py-2 md:hidden">{contentList}</div>
            ) : tab === 'overview' ? (
              <div className="py-6">
                <h2 className="text-xl font-semibold">{current.title}</h2>
                <p className="mt-1 text-sm text-muted">Lesson {idx + 1} of {all.length} · {duration(current.minutes)}</p>
                <p className="mt-4 max-w-2xl leading-relaxed text-slate-700 dark:text-slate-300">{course.description}</p>
              </div>
            ) : (
              <div className="py-6">
                <textarea
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value)
                    try { localStorage.setItem(`revive-notes-${id}`, e.target.value) } catch { /* ignore */ }
                  }}
                  rows={8}
                  className="field-area"
                  placeholder="Write notes for this course — they're saved automatically in your browser."
                />
              </div>
            )}
          </div>
        </main>
        {sidebar && (
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-line bg-white md:block dark:border-white/10 dark:bg-[#0a083b]">
            <div className="border-b border-line p-4 dark:border-white/10">
              <h2 className="font-medium">Course content</h2>
              <p className="text-xs text-muted">{enrollment.completed.length} of {all.length} complete</p>
            </div>
            {contentList}
          </aside>
        )}
      </div>
      <Modal open={cert} onClose={() => setCert(false)} title="Course complete 🎉" wide>
        <div className="printable rounded-xl border border-[#1c244b] bg-white p-10 text-center text-[#1c244b]">
          <Award className="mx-auto size-10 text-brand-500" />
          <p className="mt-4 text-xs font-medium tracking-widest text-muted uppercase">Certificate of completion</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.03em]">{user.name}</p>
          <p className="mt-3 text-sm text-muted">has successfully completed</p>
          <p className="mt-1 text-lg font-medium">{course.title}</p>
          <p className="mt-6 text-xs text-muted">Revive Skills LLC · {date(new Date().toISOString().slice(0, 10))}</p>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={() => window.print()} className="btn-secondary">Print</button>
          <button onClick={() => setCert(false)} className="btn-primary">Done</button>
        </div>
      </Modal>
    </div>
  )
}
