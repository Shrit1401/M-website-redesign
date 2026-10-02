'use client'

import { BookOpen, Eye, MoreHorizontal, Pencil, Plus, Search, Send, Trash2, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/router'
import { AreaChart, BarList } from '../../components/charts'
import { Avatar, Badge, CourseImage, Empty, Metrics, Modal, PageHeader, ProgressBar, SectionTitle, Tabs } from '../../components/ui'
import type { Course } from '../../data/types'
import { compact, date, lessons, money, progress } from '../../lib/utils'
import { useStore } from '../../store/store'
import { monthlyGross, TUTOR_SHARE } from '../../lib/analytics'

const SHARE = TUTOR_SHARE

function useTutor() {
  const { db, user } = useStore()
  const courses = db.courses.filter((c) => c.tutorId === user!.id)
  const ids = new Set(courses.map((c) => c.id))
  const enrollments = db.enrollments.filter((e) => ids.has(e.courseId))
  const orders = db.orders.filter((o) => o.status === 'paid' && o.courseIds.some((id) => ids.has(id)))
  const orderRevenue = (o: (typeof orders)[0]) => o.courseIds.filter((id) => ids.has(id)).reduce((s, id) => s + (db.courses.find((c) => c.id === id)?.price ?? 0), 0)
  const monthly = monthlyGross(db, courses).map((m) => ({ ...m, value: Math.round(m.value * SHARE) }))
  return { courses, enrollments, orders, monthly, orderRevenue }
}

export function TutorOverview() {
  const { db, user } = useStore()
  const { courses, enrollments, monthly } = useTutor()
  const published = courses.filter((c) => c.status === 'published')
  const students = published.reduce((s, c) => s + c.students, 0)
  const rated = published.filter((c) => c.rating > 0)
  const avg = rated.length ? rated.reduce((s, c) => s + c.rating, 0) / rated.length : 0
  const total = monthly.reduce((s, m) => s + m.value, 0)
  const recent = [...enrollments].sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt)).slice(0, 5)
  const drafts = courses.filter((c) => c.status !== 'published')

  return (
    <>
      <PageHeader title={`Good afternoon, ${user!.name.split(' ')[0]}`} subtitle="Here's how your courses are doing." action={<Link to="/tutor/courses/new" className="btn-primary"><Plus className="size-4" /> New course</Link>} />
      <Metrics
        items={[
          { label: 'Earnings · last 6 months', value: money(total), delta: 18 },
          { label: 'This month', value: money(monthly[monthly.length - 1].value), delta: 9, hint: 'vs August' },
          { label: 'Total students', value: compact(students), delta: 4 },
          { label: 'Instructor rating', value: avg ? avg.toFixed(2) : '—', hint: `${compact(rated.reduce((s, c) => s + c.reviews, 0))} reviews` },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="panel p-5">
          <SectionTitle title="Earnings" action={<span className="text-xs text-muted">Your {SHARE * 100}% share · monthly</span>} />
          <AreaChart data={monthly} format={money} />
        </div>
        <div className="panel p-5">
          <SectionTitle title="Students by course" />
          <BarList data={[...published].sort((a, b) => b.students - a.students).map((c) => ({ label: c.title, value: c.students }))} format={compact} />
          {drafts.length > 0 && (
            <div className="mt-5 border-t border-line pt-4 dark:border-white/10">
              <p className="text-xs font-medium text-muted">Not yet live</p>
              {drafts.map((c) => (
                <Link key={c.id} to={`/tutor/courses/${c.id}/edit`} className="mt-2 flex items-center justify-between gap-2 text-[13px] hover:text-brand-600">
                  <span className="truncate">{c.title}</span> <Badge>{c.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        <SectionTitle title="Latest enrolments" action={<Link to="/tutor/students" className="text-[13px] text-muted hover:text-ink">All students</Link>} />
        <div className="panel divide-y divide-line dark:divide-white/[0.08]">
          {recent.length ? recent.map((e) => {
            const u = db.users.find((x) => x.id === e.userId)
            const c = db.courses.find((x) => x.id === e.courseId)!
            return (
              <div key={e.userId + e.courseId} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={u?.name ?? '?'} src={u?.avatar} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{u?.name}</p>
                  <p className="truncate text-xs text-muted">{c.title}</p>
                </div>
                <div className="hidden w-40 items-center gap-2 sm:flex"><ProgressBar value={progress(c, e)} /><span className="w-8 text-xs text-muted tabular-nums">{progress(c, e)}%</span></div>
                <span className="w-24 text-right text-xs text-muted">{date(e.enrolledAt)}</span>
              </div>
            )
          }) : <p className="p-5 text-[13px] text-muted">No enrolments yet.</p>}
        </div>
      </div>
    </>
  )
}

function RowMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn-icon size-8" aria-label="More actions"><MoreHorizontal className="size-4" /></button>
      {open && <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-line bg-white p-1 shadow-lift dark:border-white/10 dark:bg-[#111111]" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}
const menuItem = 'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] hover:bg-surface dark:hover:bg-white/5'

export function TutorCourses() {
  const store = useStore()
  const { courses } = useTutor()
  const [tab, setTab] = useState<'all' | Course['status']>('all')
  const [confirm, setConfirm] = useState<Course | null>(null)
  const list = courses.filter((c) => tab === 'all' || c.status === tab)
  const count = (s: Course['status']) => courses.filter((c) => c.status === s).length

  return (
    <>
      <PageHeader title="Courses" subtitle="Create, edit and publish your courses." action={<Link to="/tutor/courses/new" className="btn-primary"><Plus className="size-4" /> New course</Link>} />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'all', label: 'All', count: courses.length }, { value: 'published', label: 'Published', count: count('published') }, { value: 'pending', label: 'In review', count: count('pending') }, { value: 'draft', label: 'Drafts', count: count('draft') }, { value: 'rejected', label: 'Changes needed', count: count('rejected') }]} />
      <div className="mt-6">
        {list.length ? (
          <div className="panel overflow-x-auto lg:overflow-visible">
            <table className="w-full min-w-[760px] text-[13px]">
              <thead>
                <tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10">
                  <th className="px-5 py-3">Course</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Price</th><th className="px-3 py-3 text-right">Students</th><th className="px-3 py-3 text-right">Rating</th><th className="px-3 py-3">Updated</th><th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface/60 dark:border-white/[0.06] dark:hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <Link to={`/tutor/courses/${c.id}/edit`} className="flex items-center gap-3">
                        <CourseImage src={c.image} category={c.category} hue={c.hue} className="aspect-video w-20 shrink-0 rounded-md" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium hover:text-brand-600">{c.title}</span>
                          <span className="block text-xs text-muted">{c.category} · {lessons(c).length} lessons</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3"><Badge>{c.status}</Badge></td>
                    <td className="px-3 py-3 text-right tabular-nums">{money(c.price)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{compact(c.students)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{c.rating ? `★ ${c.rating.toFixed(1)}` : '—'}</td>
                    <td className="px-3 py-3 text-muted">{date(c.updated)}</td>
                    <td className="px-3 py-3">
                      <RowMenu>
                        <Link to={`/tutor/courses/${c.id}/edit`} className={menuItem}><Pencil className="size-4 text-muted" /> Edit</Link>
                        <Link to={`/courses/${c.id}`} className={menuItem}><Eye className="size-4 text-muted" /> Preview</Link>
                        {(c.status === 'draft' || c.status === 'rejected') && (
                          <button onClick={() => { store.setCourseStatus(c.id, 'pending'); store.toast('Submitted for review') }} className={menuItem}><Send className="size-4 text-muted" /> Submit for review</button>
                        )}
                        <button onClick={() => setConfirm(c)} className={`${menuItem} text-rose-600`}><Trash2 className="size-4" /> Delete</button>
                      </RowMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty icon={BookOpen} title="No courses here" text="Create a course and share what you know." action={<Link to="/tutor/courses/new" className="btn-primary">Create a course</Link>} />}
      </div>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete this course?">
        <p className="text-[13px] text-muted">“{confirm?.title}” and all its lessons will be permanently removed.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => { store.deleteCourse(confirm!.id); setConfirm(null); store.toast('Course deleted') }} className="btn bg-rose-600 text-white hover:bg-rose-700">Delete course</button>
        </div>
      </Modal>
    </>
  )
}

export function TutorStudents() {
  const { db } = useStore()
  const { courses, enrollments } = useTutor()
  const [q, setQ] = useState('')
  const [course, setCourse] = useState('all')
  const rows = enrollments
    .filter((e) => course === 'all' || e.courseId === course)
    .map((e) => ({ e, u: db.users.find((u) => u.id === e.userId)!, c: db.courses.find((c) => c.id === e.courseId)! }))
    .filter((r) => r.u && r.c && `${r.u.name} ${r.u.email}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.e.enrolledAt.localeCompare(a.e.enrolledAt))

  return (
    <>
      <PageHeader title="Students" subtitle={`${enrollments.length} enrolments across your courses`} />
      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-3 sm:flex-row dark:border-white/10">
          <div className="relative flex-1"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className="field sm:w-64" value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Filter by course">
            <option value="all">All courses</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-[13px]">
              <thead><tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10"><th className="px-5 py-3">Student</th><th className="px-3 py-3">Course</th><th className="px-3 py-3">Enrolled</th><th className="w-52 px-5 py-3">Progress</th></tr></thead>
              <tbody>
                {rows.map(({ e, u, c }) => (
                  <tr key={u.id + c.id} className="border-b border-line last:border-0 dark:border-white/[0.06]">
                    <td className="px-5 py-3"><div className="flex items-center gap-3"><Avatar name={u.name} src={u.avatar} size={34} /><div><div className="font-medium">{u.name}</div><div className="text-xs text-muted">{u.email}</div></div></div></td>
                    <td className="px-3 py-3">{c.title}</td>
                    <td className="px-3 py-3 text-muted">{date(e.enrolledAt)}</td>
                    <td className="px-5 py-3"><div className="flex items-center gap-2"><ProgressBar value={progress(c, e)} /><span className="w-9 text-right text-xs tabular-nums">{progress(c, e)}%</span></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="p-6"><Empty icon={Users} title="No students found" text="Try a different search or course filter." /></div>}
      </div>
    </>
  )
}

export function TutorEarnings() {
  const { db } = useStore()
  const { monthly, orders, orderRevenue } = useTutor()
  const total = monthly.reduce((s, m) => s + m.value, 0)
  const payouts = [...monthly].reverse().slice(1).map((m, i) => ({ month: m.label, amount: m.value, date: `2026-${String(9 - i).padStart(2, '0')}-05` }))
  return (
    <>
      <PageHeader title="Earnings" subtitle={`You keep ${SHARE * 100}% of every sale. Payouts go out on the 5th of each month.`} />
      <Metrics
        items={[
          { label: 'Last 6 months', value: money(total), delta: 18 },
          { label: 'Pending payout', value: money(monthly[monthly.length - 1].value), hint: 'Pays out Oct 5' },
          { label: 'Sales this period', value: String(orders.length) },
          { label: 'Payout method', value: 'Bank ••4821', hint: 'Chase · USD' },
        ]}
      />
      <div className="panel mt-6 p-5">
        <SectionTitle title="Monthly earnings" />
        <AreaChart data={monthly} format={money} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle title="Recent sales" />
          <div className="panel divide-y divide-line dark:divide-white/[0.08]">
            {[...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((o) => {
              const u = db.users.find((x) => x.id === o.userId)
              return (
                <div key={o.id} className="flex items-center gap-3 px-5 py-3.5 text-[13px]">
                  <Avatar name={u?.name ?? '?'} src={u?.avatar} size={32} />
                  <span className="min-w-0 flex-1"><span className="block font-medium">{u?.name}</span><span className="block truncate text-xs text-muted">{date(o.date)} · {o.id}</span></span>
                  <span className="font-medium tabular-nums">+{money(orderRevenue(o) * SHARE)}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <SectionTitle title="Payout history" />
          <div className="panel divide-y divide-line dark:divide-white/[0.08]">
            {payouts.map((p) => (
              <div key={p.month} className="flex items-center justify-between px-5 py-3.5 text-[13px]">
                <span><span className="block font-medium">{p.month} earnings</span><span className="block text-xs text-muted">Paid {date(p.date)}</span></span>
                <span className="flex items-center gap-3"><Badge>paid</Badge><span className="w-20 text-right font-medium tabular-nums">{money(p.amount)}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
