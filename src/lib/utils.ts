import type { Course, Enrollment, Role } from '../data/types'

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const compact = (n: number) => Intl.NumberFormat('en-US', { notation: 'compact' }).format(n)

export const date = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const duration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h ? `${h}h ${m ? `${m}m` : ''}`.trim() : `${m}m`
}

export const lessons = (c: Course) => c.curriculum.flatMap((s) => s.lessons)
export const totalMinutes = (c: Course) => lessons(c).reduce((s, l) => s + l.minutes, 0)

export const progress = (c: Course, e?: Enrollment) => {
  if (!e) return 0
  const all = lessons(c)
  return all.length ? Math.round((e.completed.filter((id) => all.some((l) => l.id === id)).length / all.length) * 100) : 0
}

export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const hueFrom = (s: string) => [...s].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7)

export const homeFor = (role: Role) => (role === 'admin' ? '/admin' : role === 'tutor' ? '/tutor' : '/dashboard')

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
