import { Award, BookOpen, Heart, PlayCircle, Receipt } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CourseCard } from '../../components/CourseCard'
import { Bars } from '../../components/charts'
import { Badge, CourseImage, Empty, Metrics, PageHeader, ProgressBar, SectionTitle, Tabs } from '../../components/ui'
import type { Course, Enrollment } from '../../data/types'
import { date, duration, lessons, money, progress } from '../../lib/utils'
import { useStore } from '../../store/store'

function useMine() {
  const { db, user } = useStore()
  return db.enrollments
    .filter((e) => e.userId === user!.id)
    .map((e) => ({ e, c: db.courses.find((c) => c.id === e.courseId)! }))
    .filter((x) => x.c)
}

const nextLesson = (c: Course, e: Enrollment) => {
  const all = lessons(c)
  return all.find((l) => l.id === e.lastLessonId && !e.completed.includes(l.id)) ?? all.find((l) => !e.completed.includes(l.id))
}

function LearningRow({ c, e }: { c: Course; e: Enrollment }) {
  const { db } = useStore()
  const p = progress(c, e)
  const next = nextLesson(c, e)
  const tutor = db.users.find((u) => u.id === c.tutorId)
  return (
    <Link to={`/learn/${c.id}`} className="group flex items-center gap-4 p-4 transition-colors hover:bg-surface dark:hover:bg-white/[0.03]">
      <div className="relative shrink-0">
        <CourseImage src={c.image} category={c.category} hue={c.hue} className="aspect-video w-28 rounded-lg sm:w-36" />
        <span className="absolute inset-0 grid place-items-center rounded-lg bg-black/30 opacity-0 transition group-hover:opacity-100">
          <PlayCircle className="size-8 text-white" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400">{c.title}</h3>
        <p className="truncate text-[13px] text-muted">{tutor?.name}</p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={p} className="max-w-xs flex-1" />
          <span className="text-xs font-medium tabular-nums">{p === 100 ? 'Completed' : `${p}% complete`}</span>
        </div>
        {next && p < 100 && <p className="mt-1.5 hidden truncate text-xs text-muted sm:block">Up next: {next.title}</p>}
      </div>
      <span className="btn-secondary btn-sm hidden shrink-0 md:inline-flex">{p === 0 ? 'Start' : p === 100 ? 'Review' : 'Resume'}</span>
    </Link>
  )
}

export function StudentOverview() {
  const { db, user } = useStore()
  const mine = useMine()
  const inProgress = mine.filter(({ c, e }) => progress(c, e) < 100).sort((a, b) => progress(b.c, b.e) - progress(a.c, a.e))
  const completed = mine.filter(({ c, e }) => progress(c, e) === 100)
  const minutes = mine.reduce((s, { c, e }) => s + lessons(c).filter((l) => e.completed.includes(l.id)).reduce((a, l) => a + l.minutes, 0), 0)
  const recommended = db.courses.filter((c) => c.status === 'published' && !mine.some((m) => m.c.id === c.id)).sort((a, b) => b.rating - a.rating).slice(0, 3)
  const week = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, i) => ({ label, value: [32, 45, 12, 60, 38, 0, 24][i] }))
  const hero = inProgress[0]
  const heroNext = hero && nextLesson(hero.c, hero.e)

  return (
    <>
      <PageHeader title={`Welcome back, ${user!.name.split(' ')[0]}`} subtitle="Here's where you left off." />

      {hero ? (
        <div className="panel grid overflow-hidden md:grid-cols-[minmax(0,340px)_1fr]">
          <CourseImage src={hero.c.image} category={hero.c.category} hue={hero.c.hue} className="aspect-video md:aspect-auto md:h-full" />
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="kicker">Continue learning</p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.03em]">{hero.c.title}</h2>
            {heroNext && <p className="mt-1 text-[13px] text-muted">Up next: <span className="font-medium text-ink dark:text-white">{heroNext.title}</span> · {duration(heroNext.minutes)}</p>}
            <div className="mt-5 flex items-center gap-3">
              <ProgressBar value={progress(hero.c, hero.e)} className="max-w-sm" />
              <span className="text-[13px] font-medium tabular-nums">{progress(hero.c, hero.e)}%</span>
            </div>
            <div className="mt-6">
              <Link to={`/learn/${hero.c.id}`} className="btn-primary"><PlayCircle className="size-4" /> Resume course</Link>
            </div>
          </div>
        </div>
      ) : (
        <Empty icon={BookOpen} title="You're not taking any courses yet" text="Find something you're curious about and start learning today." action={<Link to="/courses" className="btn-primary">Browse courses</Link>} />
      )}

      <div className="mt-6">
        <Metrics
          items={[
            { label: 'Courses enrolled', value: String(mine.length) },
            { label: 'Completed', value: String(completed.length), hint: completed.length ? `${completed.length} certificate${completed.length > 1 ? 's' : ''} earned` : undefined },
            { label: 'Time learned', value: duration(minutes) },
            { label: 'Current streak', value: '4 days', hint: 'Best: 9 days' },
          ]}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <SectionTitle title="In progress" action={<Link to="/dashboard/learning" className="text-[13px] text-muted hover:text-ink">View all</Link>} />
          {inProgress.length ? (
            <div className="panel divide-y divide-line overflow-hidden dark:divide-white/[0.08]">
              {inProgress.map(({ c, e }) => <LearningRow key={c.id} c={c} e={e} />)}
            </div>
          ) : <p className="text-[13px] text-muted">Nothing in progress.</p>}
        </section>
        <section>
          <SectionTitle title="This week" />
          <div className="panel p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-semibold tabular-nums">{duration(week.reduce((s, d) => s + d.value, 0))}</p>
              <p className="text-xs text-muted">Goal: 3h / week</p>
            </div>
            <p className="text-[13px] text-muted">Time spent learning</p>
            <div className="mt-6"><Bars data={week} height={110} unit="m" /></div>
            {completed.length > 0 && (
              <Link to="/dashboard/learning" className="mt-5 flex items-center gap-3 rounded-lg border border-line p-3 text-[13px] hover:bg-surface dark:border-white/10 dark:hover:bg-white/5">
                <Award className="size-4 text-ink" strokeWidth={1.75} />
                <span><span className="font-medium">Certificate earned</span><span className="block text-xs text-muted">{completed[0].c.title}</span></span>
              </Link>
            )}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <SectionTitle title="Recommended for you" action={<Link to="/courses" className="text-[13px] text-muted hover:text-ink">Browse all</Link>} />
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{recommended.map((c) => <CourseCard key={c.id} course={c} />)}</div>
      </section>
    </>
  )
}

export function MyLearning() {
  const mine = useMine()
  const [tab, setTab] = useState<'all' | 'progress' | 'done'>('all')
  const list = mine.filter(({ c, e }) => (tab === 'all' ? true : tab === 'done' ? progress(c, e) === 100 : progress(c, e) < 100))
  return (
    <>
      <PageHeader title="My learning" subtitle="Every course you're enrolled in." action={<Link to="/courses" className="btn-secondary">Find more courses</Link>} />
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: 'all', label: 'All courses', count: mine.length },
          { value: 'progress', label: 'In progress', count: mine.filter(({ c, e }) => progress(c, e) < 100).length },
          { value: 'done', label: 'Completed', count: mine.filter(({ c, e }) => progress(c, e) === 100).length },
        ]}
      />
      <div className="mt-6">
        {list.length ? (
          <div className="panel divide-y divide-line overflow-hidden dark:divide-white/[0.08]">
            {list.map(({ c, e }) => <LearningRow key={c.id} c={c} e={e} />)}
          </div>
        ) : <Empty icon={BookOpen} title="Nothing here yet" text="Courses appear here once you enrol." action={<Link to="/courses" className="btn-primary">Browse courses</Link>} />}
      </div>
    </>
  )
}

export function Wishlist() {
  const { db, user } = useStore()
  const list = (db.wishlists[user!.id] ?? []).map((id) => db.courses.find((c) => c.id === id)!).filter(Boolean)
  return (
    <>
      <PageHeader title="Wishlist" subtitle={`${list.length} saved course${list.length === 1 ? '' : 's'}`} />
      {list.length ? (
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{list.map((c) => <CourseCard key={c.id} course={c} />)}</div>
      ) : <Empty icon={Heart} title="No saved courses" text="Tap the heart on any course to save it for later." action={<Link to="/courses" className="btn-primary">Browse courses</Link>} />}
    </>
  )
}

export function Orders() {
  const { db, user } = useStore()
  const orders = db.orders.filter((o) => o.userId === user!.id).sort((a, b) => b.date.localeCompare(a.date))
  return (
    <>
      <PageHeader title="Purchase history" subtitle="Receipts for every course you've bought." />
      {orders.length ? (
        <div className="panel overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10">
                <th className="px-5 py-3">Course</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Order</th><th className="px-5 py-3 text-right">Amount</th><th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0 dark:border-white/[0.06]">
                  <td className="px-5 py-3.5 font-medium">{o.courseIds.map((id) => db.courses.find((c) => c.id === id)?.title).join(', ')}</td>
                  <td className="px-5 py-3.5 text-muted">{date(o.date)}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted">{o.id}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular-nums">{money(o.total)}</td>
                  <td className="px-5 py-3.5"><Badge>{o.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Empty icon={Receipt} title="No purchases yet" text="Your receipts will appear here." />}
    </>
  )
}
