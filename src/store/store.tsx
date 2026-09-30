import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createSeed } from '../data/seed'
import type { Course, DB, Enrollment, Role, User } from '../data/types'

const DB_KEY = 'revive-db-v2'
const SESSION_KEY = 'revive-session'

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    /* ignore corrupted storage */
  }
  return fallback()
}

function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) — app keeps working in memory */
  }
}

export const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 9)}`
export const today = () => new Date().toISOString().slice(0, 10)

interface Toast {
  id: string
  message: string
}

interface Store {
  db: DB
  user: User | null
  toasts: Toast[]
  toast: (message: string) => void
  login: (email: string, password: string) => User | string
  loginAs: (role: Role) => User
  signup: (name: string, email: string, password: string, role: Role) => User | string
  logout: () => void
  updateProfile: (patch: Partial<User>) => void
  // commerce
  addToCart: (courseId: string) => void
  removeFromCart: (courseId: string) => void
  toggleWishlist: (courseId: string) => void
  checkout: () => string | null
  enrollFree: (courseId: string) => void
  // learning
  markLesson: (courseId: string, lessonId: string, done: boolean) => void
  setLastLesson: (courseId: string, lessonId: string) => void
  addReview: (courseId: string, rating: number, text: string) => void
  // tutor
  saveCourse: (course: Course) => void
  deleteCourse: (courseId: string) => void
  // admin
  setCourseStatus: (courseId: string, status: Course['status']) => void
  setUser: (userId: string, patch: Partial<User>) => void
  addUser: (user: User) => void
  deleteUser: (userId: string) => void
  refundOrder: (orderId: string) => void
  addCategory: (name: string) => void
  removeCategory: (name: string) => void
  resetDemo: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(() => load(DB_KEY, createSeed))
  const [sessionId, setSessionId] = useState<string | null>(() => load<string | null>(SESSION_KEY, () => null))
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => { save(DB_KEY, db) }, [db])
  useEffect(() => { save(SESSION_KEY, sessionId) }, [sessionId])

  const user = useMemo(() => db.users.find((u) => u.id === sessionId) ?? null, [db.users, sessionId])

  const toast = useCallback((message: string) => {
    const id = uid('t')
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const update = useCallback((fn: (d: DB) => DB) => setDb((d) => fn(d)), [])

  const store: Store = {
    db,
    user,
    toasts,
    toast,

    login(email, password) {
      const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
      if (!u || u.password !== password) return 'Incorrect email or password.'
      if (u.status === 'suspended') return 'This account has been suspended. Contact support@reviveskills.com.'
      setSessionId(u.id)
      return u
    },
    loginAs(role) {
      const u = db.users.find((x) => x.role === role && x.status === 'active')!
      setSessionId(u.id)
      return u
    },
    signup(name, email, password, role) {
      if (db.users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return 'An account with this email already exists.'
      const u: User = { id: uid('u'), name: name.trim(), email: email.trim(), password, role, status: 'active', joined: today() }
      update((d) => ({ ...d, users: [...d.users, u] }))
      setSessionId(u.id)
      return u
    },
    logout() {
      setSessionId(null)
    },
    updateProfile(patch) {
      if (!user) return
      update((d) => ({ ...d, users: d.users.map((u) => (u.id === user.id ? { ...u, ...patch } : u)) }))
    },

    addToCart(courseId) {
      if (!user) return
      update((d) => {
        const cart = d.carts[user.id] ?? []
        return cart.includes(courseId) ? d : { ...d, carts: { ...d.carts, [user.id]: [...cart, courseId] } }
      })
    },
    removeFromCart(courseId) {
      if (!user) return
      update((d) => ({ ...d, carts: { ...d.carts, [user.id]: (d.carts[user.id] ?? []).filter((c) => c !== courseId) } }))
    },
    toggleWishlist(courseId) {
      if (!user) return
      update((d) => {
        const list = d.wishlists[user.id] ?? []
        const next = list.includes(courseId) ? list.filter((c) => c !== courseId) : [...list, courseId]
        return { ...d, wishlists: { ...d.wishlists, [user.id]: next } }
      })
    },
    checkout() {
      if (!user) return null
      const cart = db.carts[user.id] ?? []
      if (!cart.length) return null
      const total = cart.reduce((s, id) => s + (db.courses.find((c) => c.id === id)?.price ?? 0), 0)
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 89999)}`
      update((d) => ({
        ...d,
        orders: [...d.orders, { id: orderId, userId: user.id, courseIds: cart, total, date: today(), status: 'paid' }],
        enrollments: [...d.enrollments, ...cart.map((courseId): Enrollment => ({ userId: user.id, courseId, completed: [], enrolledAt: today() }))],
        courses: d.courses.map((c) => (cart.includes(c.id) ? { ...c, students: c.students + 1 } : c)),
        carts: { ...d.carts, [user.id]: [] },
      }))
      return orderId
    },
    enrollFree(courseId) {
      if (!user) return
      update((d) => ({ ...d, enrollments: [...d.enrollments, { userId: user.id, courseId, completed: [], enrolledAt: today() }] }))
    },

    markLesson(courseId, lessonId, done) {
      if (!user) return
      update((d) => ({
        ...d,
        enrollments: d.enrollments.map((e) => {
          if (e.userId !== user.id || e.courseId !== courseId) return e
          const set = new Set(e.completed)
          if (done) set.add(lessonId)
          else set.delete(lessonId)
          return { ...e, completed: [...set] }
        }),
      }))
    },
    setLastLesson(courseId, lessonId) {
      if (!user) return
      update((d) => ({
        ...d,
        enrollments: d.enrollments.map((e) => (e.userId === user.id && e.courseId === courseId ? { ...e, lastLessonId: lessonId } : e)),
      }))
    },
    addReview(courseId, rating, text) {
      if (!user) return
      update((d) => ({ ...d, reviews: [{ id: uid('r'), courseId, userId: user.id, rating, text, date: today() }, ...d.reviews] }))
    },

    saveCourse(course) {
      update((d) => {
        const exists = d.courses.some((c) => c.id === course.id)
        return { ...d, courses: exists ? d.courses.map((c) => (c.id === course.id ? course : c)) : [...d.courses, course] }
      })
    },
    deleteCourse(courseId) {
      update((d) => ({ ...d, courses: d.courses.filter((c) => c.id !== courseId) }))
    },

    setCourseStatus(courseId, status) {
      update((d) => ({ ...d, courses: d.courses.map((c) => (c.id === courseId ? { ...c, status } : c)) }))
    },
    setUser(userId, patch) {
      update((d) => ({ ...d, users: d.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)) }))
    },
    addUser(u) {
      update((d) => ({ ...d, users: [...d.users, u] }))
    },
    deleteUser(userId) {
      update((d) => ({ ...d, users: d.users.filter((u) => u.id !== userId) }))
    },
    refundOrder(orderId) {
      update((d) => ({ ...d, orders: d.orders.map((o) => (o.id === orderId ? { ...o, status: 'refunded' } : o)) }))
    },
    addCategory(name) {
      update((d) => (d.categories.includes(name) ? d : { ...d, categories: [...d.categories, name] }))
    },
    removeCategory(name) {
      update((d) => ({ ...d, categories: d.categories.filter((c) => c !== name) }))
    },
    resetDemo() {
      setDb(createSeed())
    },
  }

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
