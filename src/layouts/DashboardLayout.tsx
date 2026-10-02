'use client'

import clsx from 'clsx'
import {
  BarChart3, Bell, BookOpen, Compass, CreditCard, FolderTree, GraduationCap, Heart, LayoutDashboard, Menu, PlusCircle,
  Receipt, Settings, ShoppingCart, User as UserIcon, Users, Wallet, X, type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, NavLink, useLocation } from '@/lib/router'
import { Avatar, Logo } from '../components/ui'
import type { Role } from '../data/types'
import { date, homeFor } from '../lib/utils'
import { useStore } from '../store/store'
import { UserMenu } from './PublicLayout'

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean; badge?: number }
type Group = { title?: string; items: Item[] }

function useNav(role: Role): Group[] {
  const { db, user } = useStore()
  if (role === 'student') {
    return [
      { items: [
        { to: '/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
        { to: '/dashboard/learning', label: 'My learning', icon: BookOpen },
        { to: '/courses', label: 'Browse courses', icon: Compass },
      ] },
      { title: 'Shopping', items: [
        { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart, badge: (db.wishlists[user!.id] ?? []).length || undefined },
        { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: (db.carts[user!.id] ?? []).length || undefined },
        { to: '/dashboard/orders', label: 'Purchase history', icon: Receipt },
      ] },
      { title: 'Account', items: [{ to: '/dashboard/account', label: 'Settings', icon: UserIcon }] },
    ]
  }
  if (role === 'tutor') {
    return [
      { items: [
        { to: '/tutor', label: 'Overview', icon: LayoutDashboard, end: true },
        { to: '/tutor/courses', label: 'Courses', icon: BookOpen, end: true },
        { to: '/tutor/courses/new', label: 'New course', icon: PlusCircle },
      ] },
      { title: 'Performance', items: [
        { to: '/tutor/students', label: 'Students', icon: Users },
        { to: '/tutor/earnings', label: 'Earnings', icon: Wallet },
      ] },
      { title: 'Account', items: [{ to: '/tutor/account', label: 'Instructor profile', icon: UserIcon }] },
    ]
  }
  return [
    { items: [{ to: '/admin', label: 'Overview', icon: BarChart3, end: true }] },
    { title: 'Manage', items: [
      { to: '/admin/users', label: 'Users', icon: Users },
      { to: '/admin/courses', label: 'Courses', icon: GraduationCap, badge: db.courses.filter((c) => c.status === 'pending').length || undefined },
      { to: '/admin/categories', label: 'Categories', icon: FolderTree },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    ] },
    { title: 'System', items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }] },
  ]
}

const ROLE_LABEL: Record<Role, string> = { student: 'Student', tutor: 'Instructor', admin: 'Super admin' }

function Sidebar({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const { user } = useStore()
  const groups = useNav(role)
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pt-3">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.title && <p className="mb-1 px-2.5 text-[11px] text-faint">{g.title}</p>}
            <div className="space-y-0.5">
              {g.items.map((i) => (
                <NavLink
                  key={i.to}
                  to={i.to}
                  end={i.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    clsx(
                      'flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors',
                      isActive ? 'bg-brand-50 font-medium text-ink' : 'text-muted hover:bg-black/[0.03] hover:text-ink dark:hover:bg-white/[0.04]',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <i.icon className={clsx('size-4', isActive ? 'text-brand-500' : 'text-faint')} strokeWidth={1.75} />
                      {i.label}
                      {i.badge && <span className="ml-auto text-[11px] text-faint tabular-nums">{i.badge}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <Avatar name={user!.name} src={user!.avatar} size={28} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium">{user!.name}</div>
            <div className="truncate text-xs text-muted">{ROLE_LABEL[role]}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Notifications({ role }: { role: Role }) {
  const { db, user } = useStore()
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const items: { text: string; when: string; to: string }[] =
    role === 'admin'
      ? db.courses.filter((c) => c.status === 'pending').map((c) => ({ text: `“${c.title}” was submitted for review`, when: date(c.updated), to: '/admin/courses' }))
      : role === 'tutor'
        ? db.enrollments
            .filter((e) => db.courses.find((c) => c.id === e.courseId)?.tutorId === user!.id)
            .sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt))
            .slice(0, 4)
            .map((e) => ({ text: `${db.users.find((u) => u.id === e.userId)?.name ?? 'A learner'} enrolled in ${db.courses.find((c) => c.id === e.courseId)?.title}`, when: date(e.enrolledAt), to: '/tutor/students' }))
        : [
            { text: 'New lesson added to Full Stack Web Development', when: 'Today', to: '/learn/fullstack-web' },
            { text: 'Machine Learning Foundations is in your cart', when: 'Yesterday', to: '/cart' },
          ]

  return (
    <div ref={ref} className="relative">
      <button onClick={() => { setOpen(!open); setSeen(true) }} className="btn-icon relative" aria-label="Notifications" aria-expanded={open}>
        <Bell className="size-4" />
        {!seen && items.length > 0 && <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-ink" />}
      </button>
      {open && (
        <div className="animate-rise absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-lift dark:bg-[#0a083b]">
          <p className="border-b border-line px-4 py-3 text-[13px] font-medium">Notifications</p>
          {items.length ? (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((n, i) => (
                <li key={i}>
                  <Link to={n.to} onClick={() => setOpen(false)} className="block border-b border-line px-4 py-3 last:border-0 hover:bg-surface">
                    <p className="text-[13px]">{n.text}</p>
                    <p className="mt-0.5 text-xs text-muted">{n.when}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-6 text-center text-sm text-muted">You're all caught up.</p>}
        </div>
      )}
    </div>
  )
}

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useStore()
  const loc = useLocation()
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(loc.pathname)}`} replace />
  if (user.role !== role) return <Navigate to={homeFor(user.role)} replace />
  return <>{children}</>
}

export default function DashboardLayout({ role, children }: { role: Role; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <RequireRole role={role}>
      <div className="min-h-screen bg-white lg:grid lg:grid-cols-[232px_1fr] dark:bg-[#0a083b]">
        <aside className="sticky top-0 hidden h-screen border-r border-line bg-surface lg:block">
          <Sidebar role={role} />
        </aside>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm dark:bg-black/60" onClick={() => setOpen(false)} />
            <aside className="animate-rise absolute inset-y-0 left-0 w-72 bg-surface dark:bg-[#0a083b]">
              <button onClick={() => setOpen(false)} className="btn-icon absolute top-3 right-3" aria-label="Close menu">
                <X className="size-5" />
              </button>
              <Sidebar role={role} onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}
        <div className="min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-white px-4 sm:px-8 dark:bg-[#0a083b]">
            <button onClick={() => setOpen(true)} className="btn-icon -ml-2 lg:hidden" aria-label="Open menu">
              <Menu className="size-4" />
            </button>
            <div className="lg:hidden"><Logo /></div>
            <span className="hidden text-[13px] text-muted lg:inline">{ROLE_LABEL[role]}</span>
            <div className="ml-auto flex items-center gap-1">
              <Link to="/" className="btn-ghost hidden px-3 sm:inline-flex">View site</Link>
              <Notifications role={role} />
              <div className="ml-1.5"><UserMenu /></div>
            </div>
          </header>
          <main className="animate-rise mx-auto max-w-[1120px] px-5 py-10 sm:px-10" key={pathname}>
            {children}
          </main>
        </div>
      </div>
    </RequireRole>
  )
}
