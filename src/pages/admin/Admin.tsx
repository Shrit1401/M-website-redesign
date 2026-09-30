import clsx from 'clsx'
import { Ban, Check, CheckCircle2, Download, Eye, FolderTree, MoreHorizontal, Plus, RotateCcw, Search, Star, Trash2, UserPlus, X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AccountPage } from '../../components/AccountForm'
import { AreaChart, BarList, Bars } from '../../components/charts'
import { Avatar, Badge, categoryIcon, CourseImage, Empty, Metrics, Modal, PageHeader, SectionTitle, Tabs } from '../../components/ui'
import { DEMO_PASSWORD } from '../../data/seed'
import type { Course, Role, User } from '../../data/types'
import { compact, date, money } from '../../lib/utils'
import { today, uid, useStore } from '../../store/store'
import { MONTHS, monthlyGross, sum } from '../../lib/analytics'

const th = 'px-3 py-3 first:pl-5 last:pr-5'
const td = 'px-3 py-3 first:pl-5 last:pr-5'

function RowMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(!open)} className="btn-icon size-8" aria-label="More actions" aria-expanded={open}><MoreHorizontal className="size-4" /></button>
      {open && <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-line bg-white p-1 text-left shadow-lift dark:border-white/10 dark:bg-[#111111]" onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}
const menuItem = 'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] hover:bg-surface dark:hover:bg-white/5'

function ReviewQueue({ compactView }: { compactView?: boolean }) {
  const store = useStore()
  const { db } = store
  const pending = db.courses.filter((c) => c.status === 'pending')
  if (!pending.length) return <div className="panel p-6 text-center text-[13px] text-muted"><CheckCircle2 className="mx-auto mb-2 size-6 text-emerald-500" /> No courses waiting for review.</div>
  return (
    <div className="panel divide-y divide-line dark:divide-white/[0.08]">
      {pending.map((c) => {
        const tutor = db.users.find((u) => u.id === c.tutorId)
        return (
          <div key={c.id} className="flex flex-wrap items-center gap-4 p-4">
            <CourseImage src={c.image} category={c.category} hue={c.hue} className="aspect-video w-24 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
              <Link to={`/courses/${c.id}`} className="font-medium hover:text-brand-600">{c.title}</Link>
              <p className="flex items-center gap-1.5 text-xs text-muted"><Avatar name={tutor?.name ?? ''} src={tutor?.avatar} size={16} /> {tutor?.name} · {c.category} · submitted {date(c.updated)}</p>
            </div>
            <div className="flex gap-2">
              {!compactView && <Link to={`/courses/${c.id}`} className="btn-secondary btn-sm"><Eye className="size-3.5" /> Review</Link>}
              <button onClick={() => { store.setCourseStatus(c.id, 'rejected'); store.toast('Sent back to instructor') }} className="btn-secondary btn-sm">Request changes</button>
              <button onClick={() => { store.setCourseStatus(c.id, 'published'); store.toast('Course published') }} className="btn-primary btn-sm"><Check className="size-3.5" /> Approve</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AdminOverview() {
  const { db } = useStore()
  const published = db.courses.filter((c) => c.status === 'published')
  const monthly = monthlyGross(db, published)
  const gmv = sum(monthly)
  const byCat = db.categories.map((cat) => ({ label: cat, value: published.filter((c) => c.category === cat).reduce((s, c) => s + c.students, 0) })).filter((x) => x.value).sort((a, b) => b.value - a.value)
  const signups = MONTHS.map((label, i) => ({ label, value: [820, 940, 1120, 1080, 1390, 1610][i] + db.users.filter((u) => u.joined.slice(5, 7) === String(i + 4).padStart(2, '0')).length }))
  const tutors = db.users.filter((u) => u.role === 'tutor').map((t) => {
    const cs = published.filter((c) => c.tutorId === t.id)
    return { t, courses: cs.length, learners: cs.reduce((s, c) => s + c.students, 0), revenue: sum(monthlyGross(db, cs)) }
  }).sort((a, b) => b.revenue - a.revenue)
  const pending = db.courses.filter((c) => c.status === 'pending').length

  return (
    <>
      <PageHeader title="Platform overview" subtitle="April – September 2026" action={<button className="btn-secondary" onClick={() => window.print()}><Download className="size-4" /> Export</button>} />
      <Metrics
        items={[
          { label: 'Gross revenue', value: money(gmv), delta: 24 },
          { label: 'Active learners', value: compact(published.reduce((s, c) => s + c.students, 0)), delta: 12 },
          { label: 'New sign-ups (Sep)', value: compact(signups[signups.length - 1].value), delta: 16, hint: 'vs August' },
          { label: 'Live courses', value: String(published.length), hint: `${pending} awaiting review` },
        ]}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="panel p-5">
          <SectionTitle title="Revenue" action={<span className="text-xs text-muted">Monthly, all courses</span>} />
          <AreaChart data={monthly} format={money} />
        </div>
        <div className="panel p-5">
          <SectionTitle title="Learners by category" />
          <BarList data={byCat.slice(0, 7)} format={compact} />
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle title={`Review queue${pending ? ` · ${pending}` : ''}`} action={<Link to="/admin/courses" className="text-[13px] text-muted hover:text-ink">All courses</Link>} />
        <ReviewQueue compactView />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionTitle title="Top instructors" />
          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[480px] text-[13px]">
              <thead><tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10"><th className={th}>Instructor</th><th className={`${th} text-right`}>Courses</th><th className={`${th} text-right`}>Learners</th><th className={`${th} text-right`}>Gross · 6 mo</th></tr></thead>
              <tbody>
                {tutors.map(({ t, courses, learners, revenue }) => (
                  <tr key={t.id} className="border-b border-line last:border-0 dark:border-white/[0.06]">
                    <td className={td}><div className="flex items-center gap-2.5"><Avatar name={t.name} src={t.avatar} size={30} /><span className="font-medium">{t.name}</span></div></td>
                    <td className={`${td} text-right tabular-nums`}>{courses}</td>
                    <td className={`${td} text-right tabular-nums`}>{compact(learners)}</td>
                    <td className={`${td} text-right font-medium tabular-nums`}>{money(revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <SectionTitle title="Sign-ups per month" />
          <div className="panel p-5"><Bars data={signups} height={150} /></div>
        </div>
      </div>
    </>
  )
}

export function AdminUsers() {
  const store = useStore()
  const { db, user: me } = store
  const [q, setQ] = useState('')
  const [role, setRole] = useState<'all' | Role>('all')
  const [adding, setAdding] = useState(false)
  const [confirm, setConfirm] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'student' as Role })
  const list = db.users.filter((u) => (role === 'all' || u.role === role) && `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()))
  const count = (r: Role) => db.users.filter((u) => u.role === r).length

  return (
    <>
      <PageHeader title="Users" subtitle={`${db.users.length} accounts`} action={<button onClick={() => setAdding(true)} className="btn-primary"><UserPlus className="size-4" /> Add user</button>} />
      <Tabs value={role} onChange={setRole} items={[{ value: 'all', label: 'All', count: db.users.length }, { value: 'student', label: 'Students', count: count('student') }, { value: 'tutor', label: 'Tutors', count: count('tutor') }, { value: 'admin', label: 'Admins', count: count('admin') }]} />
      <div className="panel mt-5 overflow-hidden">
        <div className="border-b border-line p-3 dark:border-white/10">
          <div className="relative max-w-sm"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search users" /></div>
        </div>
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead><tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10"><th className={th}>User</th><th className={th}>Role</th><th className={th}>Status</th><th className={th}>Activity</th><th className={th}>Joined</th><th className={`${th} w-12`} /></tr></thead>
            <tbody>
              {list.map((u) => {
                const activity = u.role === 'tutor' ? `${db.courses.filter((c) => c.tutorId === u.id).length} courses` : u.role === 'student' ? `${db.enrollments.filter((e) => e.userId === u.id).length} enrolments` : '—'
                const self = u.id === me!.id
                return (
                  <tr key={u.id} className="border-b border-line last:border-0 hover:bg-surface/60 dark:border-white/[0.06] dark:hover:bg-white/[0.02]">
                    <td className={td}><div className="flex items-center gap-3"><Avatar name={u.name} src={u.avatar} size={34} /><div><div className="font-medium">{u.name}{self && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}</div><div className="text-xs text-muted">{u.email}</div></div></div></td>
                    <td className={td}><Badge>{u.role}</Badge></td>
                    <td className={td}><Badge>{u.status}</Badge></td>
                    <td className={`${td} text-muted`}>{activity}</td>
                    <td className={`${td} text-muted`}>{date(u.joined)}</td>
                    <td className={`${td} text-right`}>
                      {!self && (
                        <RowMenu>
                          <p className="px-2.5 pt-1.5 pb-1 text-[11px] font-medium text-muted">Change role</p>
                          {(['student', 'tutor', 'admin'] as Role[]).filter((r) => r !== u.role).map((r) => (
                            <button key={r} onClick={() => { store.setUser(u.id, { role: r }); store.toast(`${u.name} is now ${r === 'admin' ? 'an' : 'a'} ${r}`) }} className={`${menuItem} capitalize`}>Make {r}</button>
                          ))}
                          <div className="my-1 h-px bg-line dark:bg-white/10" />
                          <button onClick={() => { const s = u.status === 'active' ? 'suspended' : 'active'; store.setUser(u.id, { status: s }); store.toast(s === 'active' ? 'Account reactivated' : 'Account suspended') }} className={menuItem}>
                            {u.status === 'active' ? <><Ban className="size-4 text-muted" /> Suspend</> : <><CheckCircle2 className="size-4 text-muted" /> Reactivate</>}
                          </button>
                          <button onClick={() => setConfirm(u)} className={`${menuItem} text-rose-600`}><Trash2 className="size-4" /> Delete</button>
                        </RowMenu>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!list.length && <p className="p-8 text-center text-[13px] text-muted">No users match your filters.</p>}
        </div>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add a user">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (db.users.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) return store.toast('That email is already in use')
            const nu: User = { id: uid('u'), name: form.name, email: form.email, password: DEMO_PASSWORD, role: form.role, status: 'active', joined: today() }
            store.addUser(nu)
            setAdding(false)
            setForm({ name: '', email: '', role: 'student' })
            store.toast(`${nu.name} added`)
          }}
        >
          <div><label className="label" htmlFor="nu-name">Full name</label><input id="nu-name" required className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="label" htmlFor="nu-email">Email</label><input id="nu-email" required type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="nu-role">Role</label><select id="nu-role" className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}><option value="student">Student</option><option value="tutor">Tutor</option><option value="admin">Admin</option></select></div>
          <p className="text-xs text-muted">The account is created with the demo password “{DEMO_PASSWORD}”.</p>
          <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setAdding(false)} className="btn-secondary">Cancel</button><button className="btn-primary">Add user</button></div>
        </form>
      </Modal>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete this user?">
        <p className="text-[13px] text-muted"><span className="font-medium text-ink dark:text-white">{confirm?.name}</span> ({confirm?.email}) will lose access immediately. This can't be undone.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setConfirm(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => { store.deleteUser(confirm!.id); setConfirm(null); store.toast('User deleted') }} className="btn bg-rose-600 text-white hover:bg-rose-700">Delete user</button>
        </div>
      </Modal>
    </>
  )
}

export function AdminCourses() {
  const store = useStore()
  const { db } = store
  const [tab, setTab] = useState<'all' | Course['status']>(() => (db.courses.some((c) => c.status === 'pending') ? 'pending' : 'published'))
  const [q, setQ] = useState('')
  const list = db.courses.filter((c) => (tab === 'all' || c.status === tab) && c.title.toLowerCase().includes(q.toLowerCase()))
  const count = (s: Course['status']) => db.courses.filter((c) => c.status === s).length

  return (
    <>
      <PageHeader title="Courses" subtitle="Review submissions and moderate the catalogue." />
      <Tabs value={tab} onChange={setTab} items={[{ value: 'pending', label: 'Review queue', count: count('pending') }, { value: 'published', label: 'Published', count: count('published') }, { value: 'rejected', label: 'Changes requested', count: count('rejected') }, { value: 'draft', label: 'Drafts', count: count('draft') }, { value: 'all', label: 'All', count: db.courses.length }]} />
      <div className="mt-5">
        {tab === 'pending' ? <ReviewQueue /> : (
          <div className="panel overflow-hidden">
            <div className="border-b border-line p-3 dark:border-white/10">
              <div className="relative max-w-sm"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><input className="field pl-9" placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" /></div>
            </div>
            {list.length ? (
              <div className="overflow-x-auto lg:overflow-visible">
                <table className="w-full min-w-[820px] text-[13px]">
                  <thead><tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10"><th className={th}>Course</th><th className={th}>Instructor</th><th className={th}>Status</th><th className={`${th} text-right`}>Price</th><th className={`${th} text-right`}>Learners</th><th className={`${th} text-right`}>Rating</th><th className={`${th} w-12`} /></tr></thead>
                  <tbody>
                    {list.map((c) => {
                      const tutor = db.users.find((u) => u.id === c.tutorId)
                      return (
                        <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface/60 dark:border-white/[0.06] dark:hover:bg-white/[0.02]">
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <CourseImage src={c.image} category={c.category} hue={c.hue} className="aspect-video w-16 shrink-0 rounded-md" />
                              <div className="min-w-0"><Link to={`/courses/${c.id}`} className="block truncate font-medium hover:text-brand-600">{c.title}</Link><span className="text-xs text-muted">{c.category}{c.bestseller && ' · Featured'}</span></div>
                            </div>
                          </td>
                          <td className={`${td} text-muted`}>{tutor?.name ?? '—'}</td>
                          <td className={td}><Badge>{c.status}</Badge></td>
                          <td className={`${td} text-right tabular-nums`}>{money(c.price)}</td>
                          <td className={`${td} text-right tabular-nums`}>{compact(c.students)}</td>
                          <td className={`${td} text-right tabular-nums`}>{c.rating ? c.rating.toFixed(1) : '—'}</td>
                          <td className={`${td} text-right`}>
                            <RowMenu>
                              <Link to={`/courses/${c.id}`} className={menuItem}><Eye className="size-4 text-muted" /> View course</Link>
                              {c.status !== 'published' && <button onClick={() => { store.setCourseStatus(c.id, 'published'); store.toast('Course published') }} className={menuItem}><Check className="size-4 text-muted" /> Publish</button>}
                              {c.status === 'published' && <button onClick={() => { store.saveCourse({ ...c, bestseller: !c.bestseller }); store.toast(c.bestseller ? 'Removed from featured' : 'Marked as featured') }} className={menuItem}><Star className="size-4 text-muted" /> {c.bestseller ? 'Unfeature' : 'Feature on home'}</button>}
                              {c.status === 'published' && <button onClick={() => { store.setCourseStatus(c.id, 'draft'); store.toast('Course unpublished') }} className={`${menuItem} text-rose-600`}><X className="size-4" /> Unpublish</button>}
                            </RowMenu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : <div className="p-6"><Empty icon={CheckCircle2} title="Nothing here" text="No courses in this state." /></div>}
          </div>
        )}
      </div>
    </>
  )
}

export function AdminCategories() {
  const store = useStore()
  const { db } = store
  const [name, setName] = useState('')
  return (
    <>
      <PageHeader title="Categories" subtitle="The groups learners browse the catalogue by." />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const n = name.trim()
          if (!n) return
          store.addCategory(n)
          setName('')
          store.toast(`Added “${n}”`)
        }}
        className="mb-6 flex max-w-md gap-2"
      >
        <input className="field" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New category name" />
        <button className="btn-primary"><Plus className="size-4" /> Add</button>
      </form>
      {db.categories.length ? (
        <div className="panel divide-y divide-line dark:divide-white/[0.08]">
          {db.categories.map((cat) => {
            const Icon = categoryIcon(cat)
            const cs = db.courses.filter((c) => c.category === cat)
            const learners = cs.reduce((s, c) => s + c.students, 0)
            return (
              <div key={cat} className="flex items-center gap-4 px-5 py-3.5">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300"><Icon className="size-[18px]" /></span>
                <div className="flex-1"><p className="font-medium">{cat}</p><p className="text-xs text-muted">{cs.length} course{cs.length === 1 ? '' : 's'} · {compact(learners)} learners</p></div>
                <Link to={`/courses?category=${encodeURIComponent(cat)}`} className="btn-ghost btn-sm">View</Link>
                <button onClick={() => (cs.length ? store.toast('Move its courses to another category first') : store.removeCategory(cat))} className="btn-icon size-8 hover:text-rose-600" aria-label={`Remove ${cat}`}>
                  <Trash2 className="size-4" />
                </button>
              </div>
            )
          })}
        </div>
      ) : <Empty icon={FolderTree} title="No categories" text="Add your first category above." />}
    </>
  )
}

export function AdminPayments() {
  const store = useStore()
  const { db } = store
  const [status, setStatus] = useState<'all' | 'paid' | 'refunded'>('all')
  const [refund, setRefund] = useState<string | null>(null)
  const orders = [...db.orders].filter((o) => status === 'all' || o.status === status).sort((a, b) => b.date.localeCompare(a.date))
  const paid = db.orders.filter((o) => o.status === 'paid')
  const revenue = paid.reduce((s, o) => s + o.total, 0)
  const refunded = db.orders.filter((o) => o.status === 'refunded')
  return (
    <>
      <PageHeader title="Payments" subtitle="Transactions processed on the platform." />
      <Metrics
        items={[
          { label: 'Collected', value: money(revenue) },
          { label: 'Platform share (30%)', value: money(revenue * 0.3) },
          { label: 'Paid to instructors', value: money(revenue * 0.7) },
          { label: 'Refunded', value: money(refunded.reduce((s, o) => s + o.total, 0)), hint: `${refunded.length} order${refunded.length === 1 ? '' : 's'}` },
        ]}
      />
      <div className="mt-6"><Tabs value={status} onChange={setStatus} items={[{ value: 'all', label: 'All', count: db.orders.length }, { value: 'paid', label: 'Paid', count: paid.length }, { value: 'refunded', label: 'Refunded', count: refunded.length }]} /></div>
      <div className="panel mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] text-[13px]">
          <thead><tr className="border-b border-line text-left text-xs font-medium text-muted dark:border-white/10"><th className={th}>Order</th><th className={th}>Customer</th><th className={th}>Course</th><th className={th}>Date</th><th className={`${th} text-right`}>Amount</th><th className={th}>Status</th><th className={th} /></tr></thead>
          <tbody>
            {orders.map((o) => {
              const u = db.users.find((x) => x.id === o.userId)
              return (
                <tr key={o.id} className="border-b border-line last:border-0 dark:border-white/[0.06]">
                  <td className={`${td} font-mono text-xs text-muted`}>{o.id}</td>
                  <td className={td}><div className="flex items-center gap-2"><Avatar name={u?.name ?? '?'} src={u?.avatar} size={24} /><span className="font-medium">{u?.name ?? 'Deleted user'}</span></div></td>
                  <td className={`${td} max-w-56 truncate text-muted`}>{o.courseIds.map((id) => db.courses.find((c) => c.id === id)?.title ?? id).join(', ')}</td>
                  <td className={`${td} text-muted`}>{date(o.date)}</td>
                  <td className={`${td} text-right font-medium tabular-nums`}>{money(o.total)}</td>
                  <td className={td}><Badge>{o.status}</Badge></td>
                  <td className={`${td} text-right`}>{o.status === 'paid' && <button onClick={() => setRefund(o.id)} className="btn-ghost btn-sm">Refund</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Modal open={!!refund} onClose={() => setRefund(null)} title="Refund this order?">
        <p className="text-[13px] text-muted">Order <span className="font-mono text-ink dark:text-white">{refund}</span> will be marked as refunded. In production, the customer's card would be credited.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setRefund(null)} className="btn-secondary">Cancel</button>
          <button onClick={() => { store.refundOrder(refund!); store.toast(`Refunded ${refund}`); setRefund(null) }} className="btn-dark">Issue refund</button>
        </div>
      </Modal>
    </>
  )
}

function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: () => void; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div><p className="text-[13px] font-medium">{label}</p><p className="text-xs text-muted">{hint}</p></div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange} className={clsx('relative h-6 w-11 shrink-0 rounded-full transition-colors', on ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/20')}>
        <span className={clsx('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  )
}

export function AdminSettings() {
  const store = useStore()
  const [reset, setReset] = useState(false)
  const [s, setS] = useState({ name: 'Revive Skills', support: 'support@reviveskills.com', share: 70, signups: true, review: true, guestPricing: false })
  return (
    <>
      <PageHeader title="Settings" subtitle="Platform configuration and your admin account." />
      <form className="panel divide-y divide-line dark:divide-white/[0.08]" onSubmit={(e) => { e.preventDefault(); store.toast('Settings saved') }}>
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div><label className="label" htmlFor="s-name">Platform name</label><input id="s-name" className="field" value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></div>
          <div><label className="label" htmlFor="s-support">Support email</label><input id="s-support" className="field" value={s.support} onChange={(e) => setS({ ...s, support: e.target.value })} /></div>
          <div><label className="label" htmlFor="s-share">Instructor share (%)</label><input id="s-share" type="number" className="field" value={s.share} onChange={(e) => setS({ ...s, share: Number(e.target.value) })} /></div>
        </div>
        <div className="px-6">
          <Toggle on={s.signups} onChange={() => setS({ ...s, signups: !s.signups })} label="Allow new sign-ups" hint="Anyone can create a student or instructor account." />
          <Toggle on={s.review} onChange={() => setS({ ...s, review: !s.review })} label="Require review before publishing" hint="New courses go to the review queue before learners can see them." />
          <Toggle on={s.guestPricing} onChange={() => setS({ ...s, guestPricing: !s.guestPricing })} label="Show prices to guests" hint="When off, visitors must log in to see course prices." />
        </div>
        <div className="flex justify-end p-4"><button className="btn-primary">Save settings</button></div>
      </form>
      <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div><h3 className="font-medium">Reset demo data</h3><p className="text-[13px] text-muted">Restore all users, courses and orders to the original sample data.</p></div>
        <button onClick={() => setReset(true)} className="btn border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-400/30 dark:text-rose-300 dark:hover:bg-rose-400/10"><RotateCcw className="size-4" /> Reset data</button>
      </div>
      <div className="mt-12"><AccountPage title="Your admin account" /></div>
      <Modal open={reset} onClose={() => setReset(false)} title="Reset all demo data?">
        <p className="text-[13px] text-muted">Every change made in this browser will be lost.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => setReset(false)} className="btn-secondary">Cancel</button>
          <button onClick={() => { store.resetDemo(); setReset(false); store.toast('Demo data restored') }} className="btn bg-rose-600 text-white hover:bg-rose-700">Reset</button>
        </div>
      </Modal>
    </>
  )
}
