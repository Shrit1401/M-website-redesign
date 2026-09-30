import clsx from 'clsx'
import {
  BookOpen, Briefcase, Code2, Cog, Database, FlaskConical, HeartPulse, Lock, MessageCircle, Music, Scale, Star, X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { hueFrom, initials } from '../lib/utils'
import { useStore } from '../store/store'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Communication: MessageCircle,
  Development: Code2,
  'Data Science': Database,
  Business: Briefcase,
  'Music & Arts': Music,
  Engineering: Cog,
  'Health Science': HeartPulse,
  'Law & Justice': Scale,
}
export const categoryIcon = (c: string) => CATEGORY_ICONS[c] ?? (c.length % 2 ? FlaskConical : BookOpen)

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" className="fill-logo-navy dark:fill-white" />
      <path d="M20 8.5a9 9 0 0 0-5.3 16.3c.8.6 1.2 1.4 1.2 2.4v.6h8.2v-.6c0-1 .4-1.8 1.2-2.4A9 9 0 0 0 20 8.5Z" className="fill-logo-blue" />
      <path d="M17.7 14.6 15.4 17l2.3 2.4M22.3 14.6l2.3 2.4-2.3 2.4" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="stroke-white" />
      <path d="M16.6 31h6.8M17.6 33.6h4.8" strokeWidth="1.7" strokeLinecap="round" className="stroke-logo-blue" />
    </svg>
  )
}

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={clsx('inline-flex shrink-0 items-center gap-2', className)} aria-label="Revive Skills home">
      <LogoMark className="size-6" />
      <span className={clsx('text-[15px] font-semibold tracking-[-0.02em]', light ? 'text-white' : 'text-ink')}>
        Revive<span className="font-normal text-muted"> Skills</span>
      </span>
    </Link>
  )
}

export function Avatar({ name, src, size = 36, className }: { name: string; src?: string; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  const h = hueFrom(name)
  if (src && !failed) {
    return <img src={src} alt="" onError={() => setFailed(true)} className={clsx('mono shrink-0 rounded-full object-cover', className)} style={{ width: size, height: size }} />
  }
  return (
    <span
      className={clsx('inline-grid shrink-0 place-items-center rounded-full font-semibold', className)}
      style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${h} 0% ${h % 2 ? 92 : 88}%)`, color: '#404040' }}
    >
      {initials(name)}
    </span>
  )
}

/** Course thumbnail: the photo when there is one, otherwise a quiet tinted placeholder (e.g. tutor-created courses). */
export function CourseImage({ src, category, hue, className }: { src?: string; category: string; hue: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  void hue
  if (src && !failed) {
    return (
      <div className={clsx('mono overflow-hidden bg-surface', className)}>
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className="size-full object-cover" />
      </div>
    )
  }
  const Icon = categoryIcon(category)
  return (
    <div className={clsx('grid place-items-center bg-surface', className)}>
      <Icon className="size-1/4 max-h-8 max-w-8 text-faint" strokeWidth={1.25} />
    </div>
  )
}

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-px" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(value) ? 'fill-ink text-ink' : 'fill-slate-200 text-slate-200 dark:fill-[#1f2270] dark:text-[#1f2270]'} />
      ))}
    </span>
  )
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={clsx('h-[3px] w-full overflow-hidden rounded-full bg-line', className)}>
      <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  )
}

export function PriceLock({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 text-xs text-muted', className)}>
      <Lock className="size-3" /> Log in for price
    </span>
  )
}

const DOT: Record<string, string> = {
  published: 'bg-emerald-500', active: 'bg-emerald-500', paid: 'bg-emerald-500',
  pending: 'bg-amber-500', draft: 'bg-slate-300', rejected: 'bg-rose-500', suspended: 'bg-rose-500', refunded: 'bg-slate-300',
  student: 'bg-slate-300', tutor: 'bg-slate-500', admin: 'bg-ink',
}
const STATUS_LABEL: Record<string, string> = { pending: 'In review', rejected: 'Changes requested' }
export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-ink capitalize">
      <span className={clsx('size-1.5 rounded-full', DOT[children] ?? 'bg-slate-300')} />
      {STATUS_LABEL[children] ?? children}
    </span>
  )
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm dark:bg-black/70" onClick={onClose} />
      <div className={clsx('animate-rise relative max-h-[90vh] w-full overflow-auto rounded-2xl border border-line bg-white shadow-lift dark:bg-[#0a083b]', wide ? 'max-w-2xl' : 'max-w-md')}>
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <button onClick={onClose} className="btn-icon -mr-2 size-8" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-6 pt-3 pb-6">{children}</div>
      </div>
    </div>
  )
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line px-6 py-16 text-center">
      <Icon className="size-5 text-faint" strokeWidth={1.5} />
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] text-muted">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export interface Metric {
  label: string
  value: string
  delta?: number
  hint?: string
}
/** KPIs as a quiet row separated by hairlines. */
export function Metrics({ items }: { items: Metric[] }) {
  return (
    <div className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
      {items.map((m, i) => (
        <div key={m.label} className={clsx('py-5', i % 2 === 1 ? 'pl-5' : 'pr-5', i < 2 && 'border-b border-line lg:border-b-0', 'lg:px-5 lg:first:pl-0', i > 0 && 'lg:border-l lg:border-line', i % 2 === 1 && 'border-l border-line')}>
          <div className="text-xs text-muted">{m.label}</div>
          <div className="mt-2 text-[26px] leading-none font-semibold tracking-[-0.03em] tabular-nums">{m.value}</div>
          {m.delta !== undefined ? (
            <div className="mt-2 text-xs text-muted">
              <span className={clsx('font-medium', m.delta >= 0 ? 'text-ink' : 'text-rose-600')}>{m.delta >= 0 ? '+' : '−'}{Math.abs(m.delta)}%</span> {m.hint ?? 'vs last period'}
            </div>
          ) : m.hint ? (
            <div className="mt-2 text-xs text-muted">{m.hint}</div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] leading-tight font-semibold tracking-[-0.035em]">{title}</h1>
        {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  )
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[13px] font-semibold">{title}</h2>
      {action}
    </div>
  )
}

export function Toaster() {
  const { toasts } = useStore()
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="animate-rise rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-on-brand">
          {t.message}
        </div>
      ))}
    </div>
  )
}

/** Text tabs with a hairline underline. */
export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; count?: number }[] }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-6 border-b border-line">
        {items.map((i) => (
          <button
            key={i.value}
            onClick={() => onChange(i.value)}
            className={clsx(
              '-mb-px flex items-center gap-1.5 border-b pb-2.5 text-[13px] font-medium transition-colors',
              value === i.value ? 'border-brand-500 text-ink' : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {i.label}
            {i.count !== undefined && <span className="text-faint tabular-nums">{i.count}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
