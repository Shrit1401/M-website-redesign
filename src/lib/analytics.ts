import type { Course, DB } from '../data/types'

export const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
export const TUTOR_SHARE = 0.7
const SEASON = [0.64, 0.72, 0.86, 0.8, 0.98, 1.1]

/**
 * Gross monthly sales for a set of courses: a historic baseline derived from each
 * course's lifetime students (pre-demo sales), plus real orders placed in the app.
 * Admin and tutor dashboards both use this, so their numbers always agree.
 */
export function monthlyGross(db: DB, courses: Course[]) {
  const ids = new Set(courses.map((c) => c.id))
  const base = courses.filter((c) => c.status === 'published').reduce((s, c) => s + c.students * c.price, 0) / 260
  return MONTHS.map((label, i) => {
    const m = String(i + 4).padStart(2, '0')
    const real = db.orders
      .filter((o) => o.status === 'paid' && o.date.slice(5, 7) === m)
      .reduce((s, o) => s + o.courseIds.filter((id) => ids.has(id)).reduce((a, id) => a + (db.courses.find((c) => c.id === id)?.price ?? 0), 0), 0)
    return { label, value: Math.round(base * SEASON[i] + real) }
  })
}

export const sum = (xs: { value: number }[]) => xs.reduce((s, x) => s + x.value, 0)
