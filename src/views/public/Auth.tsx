'use client'

import clsx from 'clsx'
import { BookOpen, Check, GraduationCap, ShieldCheck } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from '@/lib/router'
import { Avatar, Logo } from '../../components/ui'
import { DEMO_PASSWORD } from '../../data/seed'
import type { Role } from '../../data/types'
import { homeFor } from '../../lib/utils'
import { useStore } from '../../store/store'

const DEMOS: { role: Role; label: string; email: string; icon: typeof BookOpen }[] = [
  { role: 'student', label: 'Student', email: 'student@revive.dev', icon: BookOpen },
  { role: 'tutor', label: 'Tutor', email: 'tutor@revive.dev', icon: GraduationCap },
  { role: 'admin', label: 'Admin', email: 'admin@revive.dev', icon: ShieldCheck },
]

function Shell({ children }: { children: ReactNode }) {
  const { db } = useStore()
  const review = db.reviews[0]
  const reviewer = db.users.find((u) => u.id === review?.userId)
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">{children}</div>
        <p className="text-center text-xs text-muted">© {new Date().getFullYear()} Revive Skills LLC</p>
      </div>
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/img/team.jpg" alt="" className="mono absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        {review && (
          <figure className="absolute inset-x-10 bottom-10 text-white xl:inset-x-14 xl:bottom-14">
            <blockquote className="text-[26px] leading-snug font-medium tracking-[-0.03em]">“{review.text}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar name={reviewer?.name ?? ''} src={reviewer?.avatar} size={44} className="ring-2 ring-white/30" />
              <div>
                <p className="font-semibold">{reviewer?.name}</p>
                <p className="text-sm text-slate-300">Full Stack Web Development graduate</p>
              </div>
            </figcaption>
          </figure>
        )}
      </div>
    </div>
  )
}

export function Login() {
  const { login, user } = useStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next')
  const demo = params.get('demo') as Role | null
  const initial = DEMOS.find((x) => x.role === demo)
  const [email, setEmail] = useState(initial?.email ?? '')
  const [password, setPassword] = useState(initial ? DEMO_PASSWORD : '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) nav(next ?? homeFor(user.role), { replace: true })
  }, [user, next, nav])

  return (
    <Shell>
      <h1 className="text-[32px] font-semibold tracking-[-0.04em]">Log in to Revive</h1>
      <p className="mt-1.5 text-muted">Welcome back — pick up where you left off.</p>

      <div className="mt-10">
        <p className="text-xs text-muted">Try the demo as</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DEMOS.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => {
                setEmail(d.email)
                setPassword(DEMO_PASSWORD)
                setError('')
              }}
              className={clsx(
                'flex h-9 items-center justify-center gap-1.5 rounded-full border text-[13px] transition',
                email === d.email ? 'border-ink bg-ink text-on-brand' : 'border-line hover:border-slate-300',
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const r = login(email, password)
          if (typeof r === 'string') setError(r)
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field h-10" placeholder="you@example.com" />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label className="label" htmlFor="pw">Password</label>
            <span className="text-xs text-muted">Demo: {DEMO_PASSWORD}</span>
          </div>
          <input id="pw" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field h-10" />
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-300" role="alert">{error}</p>}
        <button className="btn-primary btn-lg w-full">Log in</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account? <Link to="/signup" className="font-medium text-ink hover:underline">Sign up</Link>
      </p>
    </Shell>
  )
}

export function Signup() {
  const { signup, user } = useStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role>(params.get('role') === 'tutor' ? 'tutor' : 'student')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) nav(homeFor(user.role), { replace: true })
  }, [user, nav])

  return (
    <Shell>
      <h1 className="text-[32px] font-semibold tracking-[-0.04em]">Create your account</h1>
      <p className="mt-1.5 text-muted">Free to join. See pricing and start learning today.</p>
      <div className="mt-8 grid grid-cols-2 gap-1 rounded-full bg-surface p-1" role="radiogroup">
        {(['student', 'tutor'] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            onClick={() => setRole(r)}
            className={clsx('h-8 rounded-full text-[13px] transition', role === r ? 'bg-white font-medium shadow-soft dark:bg-[#1f2270]' : 'text-muted hover:text-ink')}
          >
            {r === 'student' ? 'I want to learn' : 'I want to teach'}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (form.password.length < 6) return setError('Password must be at least 6 characters.')
          const r = signup(form.name, form.email, form.password, role)
          if (typeof r === 'string') setError(r)
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" autoComplete="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="field h-10" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field h-10" placeholder="you@example.com" />
        </div>
        <div>
          <label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="new-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field h-10" placeholder="At least 6 characters" />
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:bg-rose-400/10 dark:text-rose-300" role="alert">{error}</p>}
        <button className="btn-primary btn-lg w-full">Create account</button>
        <ul className="space-y-1.5 pt-1 text-[13px] text-muted">
          {(role === 'student' ? ['See course pricing', 'Save courses to your wishlist', 'Track progress and earn certificates'] : ['Build courses with the course builder', 'Track students and earnings', 'Keep 70% of every sale']).map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="size-3.5 text-ink" /> {t}</li>
          ))}
        </ul>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="font-medium text-ink hover:underline">Log in</Link>
      </p>
    </Shell>
  )
}
