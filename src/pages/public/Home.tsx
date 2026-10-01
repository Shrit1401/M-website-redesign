import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CourseCard } from '../../components/CourseCard'
import { Avatar } from '../../components/ui'
import { compact, homeFor } from '../../lib/utils'
import { useStore } from '../../store/store'

function Hero() {
  const { user, db } = useStore()
  const published = db.courses.filter((c) => c.status === 'published')
  return (
    <section className="container-x pt-24 pb-20 sm:pt-32">
      <h1 className="display animate-rise text-[52px] sm:text-[88px] lg:text-[112px]">
        Pursue your passion.
        <br />
        <span className="text-brand-500">Keep learning.</span>
      </h1>
      <div className="animate-rise mt-10 flex flex-col gap-8 [animation-delay:80ms] sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-md text-[17px] leading-relaxed text-muted">
          Expert-led, career-focused courses taught by people who do the work. Nothing extra.
        </p>
        <div className="flex items-center gap-5">
          <Link to="/courses" className="btn-primary btn-lg">Browse courses <ArrowRight className="size-4" /></Link>
          <Link to={user ? homeFor(user.role) : '/login'} className="text-sm font-medium text-ink underline-offset-4 hover:underline">
            {user ? 'Dashboard' : 'Try the demo'}
          </Link>
        </div>
      </div>
      <div className="animate-rise mono mt-16 overflow-hidden rounded-2xl [animation-delay:160ms]">
        <img src="/img/hero-1.jpg" alt="Three learners working together at a table" className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]" />
      </div>
      <dl className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
        {[
          [compact(published.reduce((s, c) => s + c.students, 0)) + '+', 'Learners'],
          [String(published.length), 'Courses'],
          [String(db.categories.length), 'Disciplines'],
          ['4.8', 'Average rating'],
        ].map(([n, l]) => (
          <div key={l}>
            <dt className="text-[32px] font-semibold tracking-[-0.04em] tabular-nums">{n}</dt>
            <dd className="text-[13px] text-muted">{l}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Catalogue() {
  const { db } = useStore()
  const cats = db.categories.filter((c) => db.courses.some((x) => x.status === 'published' && x.category === c))
  const [active, setActive] = useState('All')
  const list = db.courses
    .filter((c) => c.status === 'published' && (active === 'All' || c.category === active))
    .sort((a, b) => b.students - a.students)
    .slice(0, 8)

  return (
    <section className="container-x pt-20">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-[32px] font-semibold tracking-[-0.04em] sm:text-[40px]">Courses</h2>
        <Link to="/courses" className="group mb-2 inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
          View all <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="-mx-5 mt-6 overflow-x-auto border-y border-line px-5 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-8 py-4">
          {['All', ...cats].map((c, i) => (
            <button key={c} onClick={() => setActive(c)} className={clsx('flex items-baseline gap-2 text-[13px] transition-colors', active === c ? 'text-ink' : 'text-muted hover:text-ink')}>
              <span className="text-[11px] text-faint tabular-nums">{String(i).padStart(2, '0')}</span>
              <span className={clsx(active === c && 'font-medium')}>{c}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
        {list.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </section>
  )
}

function Principles() {
  const items = [
    ['Taught by practitioners', 'Engineers, coaches, analysts and artists with years of real-world experience — not professional presenters.'],
    ['Built around your week', 'Short lessons you can finish on a lunch break. Progress syncs across every device, automatically.'],
    ['Finish with proof', 'Complete a course to earn a certificate you can add to your résumé and LinkedIn profile.'],
  ]
  return (
    <section className="container-x pt-40">
      <h2 className="max-w-3xl text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[48px]">
        Learning often happens in classrooms. <span className="text-faint">It doesn't have to.</span>
      </h2>
      <div className="mt-16 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
        {items.map(([t, d], i) => (
          <div key={t}>
            <span className="text-[11px] text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.02em]">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Instructors() {
  const { db } = useStore()
  const tutors = db.users.filter((u) => u.role === 'tutor')
  return (
    <section className="container-x pt-40">
      <div className="flex items-end justify-between gap-6">
        <h2 className="text-[32px] font-semibold tracking-[-0.04em] sm:text-[40px]">Instructors</h2>
        <Link to="/join-us" className="group mb-2 inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">Teach on Revive <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></Link>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {tutors.map((t) => {
          const n = db.courses.filter((c) => c.tutorId === t.id && c.status === 'published').length
          return (
            <div key={t.id} className="group">
              <div className="mono overflow-hidden rounded-xl bg-surface">
                <img src={t.avatar} alt={t.name} className="aspect-[4/5] w-full object-cover object-top" />
              </div>
              <h3 className="mt-4 text-sm font-medium">{t.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{t.headline}</p>
              <p className="mt-1 text-xs text-faint">{n} courses</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Quote() {
  const { db } = useStore()
  const r = db.reviews[0]
  const u = db.users.find((x) => x.id === r?.userId)
  const c = db.courses.find((x) => x.id === r?.courseId)
  if (!r) return null
  return (
    <section className="container-x pt-40">
      <figure className="mx-auto max-w-4xl text-center">
        <blockquote className="text-[26px] leading-[1.25] font-medium tracking-[-0.03em] sm:text-[36px]">“{r.text}”</blockquote>
        <figcaption className="mt-10 inline-flex items-center gap-3 text-left">
          <Avatar name={u?.name ?? ''} src={u?.avatar} size={36} />
          <span className="text-[13px]"><span className="block font-medium">{u?.name}</span><span className="text-muted">{c?.title}</span></span>
        </figcaption>
      </figure>
    </section>
  )
}

function Cta() {
  const { user } = useStore()
  return (
    <section className="container-x pt-40">
      <div className="border-t border-line pt-16 text-center">
        <h2 className="display text-[44px] sm:text-[72px]">Start today.</h2>
        <p className="mx-auto mt-5 max-w-sm text-[15px] text-muted">Create a free account to see pricing, save courses and track your progress.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={user ? homeFor(user.role) : '/signup'} className="btn-primary btn-lg">{user ? 'Go to dashboard' : 'Create free account'}</Link>
          <Link to="/courses" className="btn-secondary btn-lg">Browse courses</Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Catalogue />
      <Principles />
      <Instructors />
      <Quote />
      <Cta />
    </>
  )
}
