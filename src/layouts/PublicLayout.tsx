import clsx from 'clsx'
import { ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShoppingCart, User as UserIcon, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar, Logo } from '../components/ui'
import { homeFor } from '../lib/utils'
import { useStore } from '../store/store'

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onOutside()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onOutside])
  return ref
}

export function UserMenu() {
  const { user, logout } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  const nav = useNavigate()
  if (!user) return null
  const accountPath = user.role === 'student' ? '/dashboard/account' : user.role === 'tutor' ? '/tutor/account' : '/admin/settings'

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full p-0.5 transition hover:opacity-80" aria-label="Account menu" aria-expanded={open}>
        <Avatar name={user.name} src={user.avatar} size={28} />
      </button>
      {open && (
        <div className="animate-rise absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white shadow-lift dark:bg-[#0a083b]">
          <div className="flex items-center gap-3 border-b border-line p-3.5">
            <Avatar name={user.name} src={user.avatar} size={40} />
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold">{user.name}</div>
              <div className="truncate text-xs text-muted">{user.email}</div>
            </div>
          </div>
          <div className="p-1.5">
            {[
              { to: homeFor(user.role), label: 'Dashboard', icon: LayoutDashboard },
              { to: accountPath, label: 'Account settings', icon: UserIcon },
            ].map((i) => (
              <Link key={i.to} to={i.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] hover:bg-surface">
                <i.icon className="size-4 text-muted" /> {i.label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout()
                nav('/')
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] hover:bg-surface"
            >
              <LogOut className="size-4 text-muted" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryMenu() {
  const { db } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  const loc = useLocation()
  useEffect(() => { setOpen(false) }, [loc.search, loc.pathname])
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-ink" aria-expanded={open}>
        Categories <ChevronDown className={clsx('size-3.5 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full -left-4 z-50 pt-3">
          <div className="animate-rise w-64 rounded-xl border border-line bg-white p-1.5 shadow-lift dark:bg-[#0a083b]">
            {db.categories.map((c, i) => {
              const n = db.courses.filter((x) => x.status === 'published' && x.category === c).length
              return (
                <Link key={c} to={`/courses?category=${encodeURIComponent(c)}`} className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] hover:bg-surface">
                  <span className="w-5 text-xs text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{c}</span>
                  <span className="text-xs text-faint">{n}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function Navbar() {
  const { user, db } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [mobile, setMobile] = useState(false)
  const [searching, setSearching] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  useEffect(() => { setMobile(false); setSearching(false) }, [loc.pathname])

  const cartCount = user ? (db.carts[user.id] ?? []).length : 0
  const search = (e: React.FormEvent) => {
    e.preventDefault()
    nav(q.trim() ? `/courses?q=${encodeURIComponent(q.trim())}` : '/courses')
  }
  const links = [
    { to: '/courses', label: 'Courses' },
    { to: '/about', label: 'About' },
    ...(!user || user.role === 'student' ? [{ to: '/teach', label: 'Teach' }] : []),
  ]
  const linkCls = ({ isActive }: { isActive: boolean }) => clsx('text-[13px] transition-colors', isActive ? 'text-ink' : 'text-muted hover:text-ink')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/80 backdrop-blur-xl dark:bg-[#0a083b]/80">
      <div className="container-x flex h-14 items-center gap-8">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          <CategoryMenu />
          {links.map((l) => <NavLink key={l.to} to={l.to} end className={linkCls}>{l.label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {searching ? (
            <form onSubmit={search} className="relative hidden sm:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onBlur={() => !q && setSearching(false)} placeholder="Search courses" className="field h-8 w-56 rounded-full pl-8" aria-label="Search courses" />
            </form>
          ) : (
            <button onClick={() => setSearching(true)} className="btn-icon hidden sm:inline-flex" aria-label="Search"><Search className="size-4" /></button>
          )}
          {user ? (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/dashboard/learning" className="btn-ghost hidden lg:inline-flex">My learning</Link>
                  <Link to="/cart" className="btn-icon relative" aria-label={`Cart, ${cartCount} items`}>
                    <ShoppingCart className="size-4" />
                    {cartCount > 0 && <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-ink" />}
                  </Link>
                </>
              )}
              {user.role !== 'student' && <Link to={homeFor(user.role)} className="btn-ghost hidden sm:inline-flex">Dashboard</Link>}
              <div className="ml-2"><UserMenu /></div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
              <Link to="/signup" className="btn-primary ml-1 h-8">Sign up</Link>
            </>
          )}
          <button onClick={() => setMobile(!mobile)} className="btn-icon md:hidden" aria-label="Menu" aria-expanded={mobile}>
            {mobile ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {mobile && (
        <div className="animate-rise border-t border-line px-5 pt-4 pb-6 md:hidden">
          <form onSubmit={search} className="relative mb-5">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses" className="field h-10 rounded-full pl-8" />
          </form>
          <div className="space-y-1">
            {links.map((l) => <Link key={l.to} to={l.to} className="block py-2 text-2xl font-semibold tracking-[-0.03em]">{l.label}</Link>)}
            {user ? <Link to={homeFor(user.role)} className="block py-2 text-2xl font-semibold tracking-[-0.03em]">Dashboard</Link> : <Link to="/login" className="block py-2 text-2xl font-semibold tracking-[-0.03em]">Log in</Link>}
          </div>
          <p className="mt-6 mb-2 text-xs text-muted">Categories</p>
          <div className="grid grid-cols-2 gap-y-1">
            {db.categories.map((c) => <Link key={c} to={`/courses?category=${encodeURIComponent(c)}`} className="py-1 text-[13px] text-muted hover:text-ink">{c}</Link>)}
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  const { db } = useStore()
  const cols = [
    { title: 'Learn', links: db.categories.slice(0, 5).map((c) => ({ to: `/courses?category=${encodeURIComponent(c)}`, label: c })) },
    { title: 'Company', links: [{ to: '/about', label: 'About' }, { to: '/teach', label: 'Teach' }, { to: '/contact', label: 'Contact' }, { to: '/courses', label: 'All courses' }] },
    { title: 'Demo', links: [{ to: '/login?demo=student', label: 'Student view' }, { to: '/login?demo=tutor', label: 'Tutor view' }, { to: '/login?demo=admin', label: 'Admin view' }] },
  ]
  return (
    <footer className="mt-32 border-t border-line">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">Expert-led, career-focused courses. Pursue your passion — keep learning.</p>
          <p className="mt-6 text-[13px] text-muted">support@reviveskills.com<br />224-386-8661</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="mb-3 text-xs font-medium">{c.title}</h4>
            <ul className="space-y-2">
              {c.links.map((l) => <li key={l.to}><Link to={l.to} className="text-[13px] text-muted transition-colors hover:text-ink">{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x flex flex-wrap justify-between gap-2 border-t border-line py-6 text-xs text-faint">
        <span>© {new Date().getFullYear()} Revive Skills LLC</span>
        <span>Demo — data stays in your browser</span>
      </div>
    </footer>
  )
}

export default function PublicLayout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
