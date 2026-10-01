import { ArrowRight, CheckCircle2, CreditCard, Lock, Mail, MapPin, Phone, ShieldCheck, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CourseImage, Empty, Stars } from '../../components/ui'
import { compact, duration, homeFor, money, totalMinutes } from '../../lib/utils'
import { useStore } from '../../store/store'

export function About() {
  const { db } = useStore()
  const published = db.courses.filter((c) => c.status === 'published')
  return (
    <>
      <section className="container-x grid grid-cols-1 items-center gap-12 pt-24 pb-16 lg:grid-cols-2">
        <div>
          <p className="kicker">About Revive Skills</p>
          <h1 className="mt-3 text-4xl leading-[1.1] font-semibold tracking-[-0.03em] text-navy sm:text-5xl dark:text-white">Helping people revive their careers through practical skills.</h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Revive Skills LLC offers expert-led, career-focused training designed to equip you with the technical and professional skills needed to thrive in today's job market.
          </p>
        </div>
        <div className="mono overflow-hidden rounded-2xl"><img src="/img/team.jpg" alt="People learning together" className="aspect-[4/3] w-full object-cover" /></div>
      </section>
      <section className="container-x"><div className="border-y border-line">
        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {[[compact(published.reduce((s, c) => s + c.students, 0)), 'Learners enrolled'], [String(published.length), 'Courses'], [String(db.categories.length), 'Categories'], ['4.8', 'Average rating']].map(([n, l]) => (
            <div key={l}>
              <div className="text-[32px] font-semibold tracking-[-0.04em]">{n}</div>
              <div className="mt-1 text-sm text-muted">{l}</div>
            </div>
          ))}
        </div></div>
      </section>
      <section className="container-x grid gap-10 py-16 md:grid-cols-3">
        {[
          ['Practical first', 'Every course is built around the tasks you will actually do on the job, not theory for its own sake.'],
          ['Flexible by design', 'Self-paced lessons that fit around work, family and life — on any device, whenever it suits you.'],
          ['People who care', 'Instructors and a support team who respond. Questions go to support@reviveskills.com.'],
        ].map(([t, d]) => (
          <div key={t}>
            <h3 className="text-[17px] font-medium tracking-[-0.02em]">{t}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export function JoinUs() {
  return (
    <>
      <section className="container-x pt-24 sm:pt-32">
        <p className="text-[13px] text-muted">Join us as an instructor</p>
        <h1 className="display mt-5 text-[52px] sm:text-[88px]">
          Share what you know.
          <br />
          <span className="text-brand-500">Get paid for it.</span>
        </h1>
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-[17px] leading-relaxed text-muted">Build a course with simple tools, reach motivated learners and keep 70% of every sale.</p>
          <div className="flex items-center gap-5">
            <Link to="/signup?role=tutor" className="btn-primary btn-lg">Start teaching <ArrowRight className="size-4" /></Link>
            <Link to="/login?demo=tutor" className="text-sm font-medium underline-offset-4 hover:underline">See the tutor demo</Link>
          </div>
        </div>
        <div className="mono mt-16 overflow-hidden rounded-2xl">
          <img src="/img/hero-3.jpg" alt="An instructor teaching a class" className="aspect-[21/9] w-full object-cover" />
        </div>
      </section>
      <section className="container-x pt-24">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {[
            ['Reach career-focused learners', 'Your course is discoverable by thousands of people actively investing in their careers.'],
            ['See what is working', 'Track enrolments, completion and revenue for every course in one dashboard.'],
            ['Keep 70% of every sale', 'Transparent revenue share, paid out on the 5th of every month.'],
          ].map(([t, d], i) => (
            <div key={t}>
              <span className="text-[11px] text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-[17px] font-medium tracking-[-0.02em]">{t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export function Contact() {
  const { toast } = useStore()
  const [sent, setSent] = useState(false)
  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="kicker">Contact</p>
        <h1 className="display mt-5 text-[44px] sm:text-[64px]">Get in touch</h1>
        <p className="mt-3 max-w-md text-muted">Questions about a course, a partnership or teaching with us? We usually reply within one business day.</p>
        <dl className="mt-10 space-y-6">
          {[[Mail, 'Email', 'support@reviveskills.com'], [Phone, 'Phone', '+1-224-386-8661'], [MapPin, 'Office', '424 N Lake Shore Dr, Palatine, IL 60067']].map(([Icon, l, v]) => {
            const I = Icon as typeof Mail
            return (
              <div key={l as string} className="flex gap-4">
                <span className="grid size-9 place-items-center rounded-full border border-line"><I className="size-[18px]" /></span>
                <div><dt className="text-sm text-muted">{l as string}</dt><dd className="font-medium">{v as string}</dd></div>
              </div>
            )
          })}
        </dl>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSent(true)
          toast('Message sent')
        }}
        className="panel space-y-4 p-6 sm:p-8"
      >
        {sent ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
            <p className="mt-3 text-lg font-medium">Thanks — we'll be in touch.</p>
            <p className="text-sm text-muted">A copy of your message has been sent to your inbox.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" required className="field h-11" /></div>
              <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" required type="email" className="field h-11" /></div>
            </div>
            <div>
              <label className="label" htmlFor="c-topic">Topic</label>
              <select id="c-topic" className="field h-11"><option>Course question</option><option>Billing</option><option>Teaching on Revive</option><option>Partnerships</option></select>
            </div>
            <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" required rows={5} className="field-area" /></div>
            <button className="btn-primary btn-lg w-full">Send message</button>
          </>
        )}
      </form>
    </div>
  )
}

export function MakePayment() {
  const { toast } = useStore()
  const [amount, setAmount] = useState('')
  const [paying, setPaying] = useState(false)
  const [ref, setRef] = useState('')
  const value = Number(amount) || 0

  if (ref) {
    return (
      <div className="container-x max-w-lg py-24 text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald-500" strokeWidth={1.5} />
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">Payment received</h1>
        <p className="mt-2 text-muted">Reference <span className="font-mono text-ink dark:text-white">{ref}</span>. A receipt for {money(value)} has been sent to your email.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-primary btn-lg">Back to home</Link>
          <Link to="/contact" className="btn-secondary btn-lg">Contact support</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="kicker">Make a payment</p>
        <h1 className="display mt-5 text-[44px] sm:text-[64px]">Pay an invoice</h1>
        <p className="mt-3 max-w-md text-muted">Use this page to pay an invoice, an instalment or a custom amount agreed with our team. To buy a course, add it to your cart instead.</p>
        <ul className="mt-10 space-y-4 text-[13px] text-muted">
          {['Have your invoice or enrolment number ready', 'You will get an email receipt straight away', 'Questions about a charge? Email support@reviveskills.com'].map((t) => (
            <li key={t} className="flex gap-3"><CheckCircle2 className="size-4 shrink-0 text-brand-500" />{t}</li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (value <= 0) return toast('Enter an amount greater than $0')
          setPaying(true)
          setTimeout(() => {
            setRef(`RS-${Date.now().toString(36).toUpperCase()}`)
            toast('Payment received')
          }, 900)
        }}
        className="panel space-y-4 p-6 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="p-name">Full name</label><input id="p-name" required className="field h-11" /></div>
          <div><label className="label" htmlFor="p-email">Email</label><input id="p-email" required type="email" className="field h-11" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="p-ref">Invoice or enrolment no.</label><input id="p-ref" className="field h-11" placeholder="Optional" /></div>
          <div>
            <label className="label" htmlFor="p-amount">Amount (USD)</label>
            <div className="relative"><span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-muted">$</span><input id="p-amount" required inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} className="field h-11 pl-7 tabular-nums" placeholder="0.00" /></div>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="p-card">Card number</label>
          <div className="relative"><CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><input id="p-card" className="field h-11 pl-9 tabular-nums" defaultValue="4242 4242 4242 4242" /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label" htmlFor="p-exp">Expiry</label><input id="p-exp" className="field h-11" defaultValue="12 / 29" /></div>
          <div><label className="label" htmlFor="p-cvc">CVC</label><input id="p-cvc" className="field h-11" defaultValue="123" /></div>
        </div>
        <button disabled={paying} className="btn-primary btn-lg w-full">{paying ? 'Processing…' : value > 0 ? `Pay ${money(value)}` : 'Pay'}</button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted"><Lock className="size-3" /> Demo payment — no money is taken</p>
      </form>
    </div>
  )
}

export function Cart() {
  const store = useStore()
  const { db, user } = store
  const nav = useNavigate()
  const [paying, setPaying] = useState(false)
  if (!user) return <Navigate to="/login?next=/cart" replace />
  if (user.role !== 'student') return <Navigate to={homeFor(user.role)} replace />
  const items = (db.carts[user.id] ?? []).map((id) => db.courses.find((c) => c.id === id)!).filter(Boolean)
  const subtotal = items.reduce((s, c) => s + c.price, 0)

  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-semibold tracking-[-0.03em]">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="mt-8"><Empty icon={ShoppingCart} title="Your cart is empty" text="Keep exploring to find a course you'll love." action={<Link to="/courses" className="btn-primary">Browse courses</Link>} /></div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="border-b border-line pb-3 text-sm font-medium dark:border-white/10">{items.length} course{items.length === 1 ? '' : 's'} in cart</p>
            {items.map((c) => (
              <div key={c.id} className="flex gap-4 border-b border-line py-5 dark:border-white/10">
                <CourseImage src={c.image} category={c.category} hue={c.hue} className="aspect-video w-32 shrink-0 rounded-lg sm:w-40" />
                <div className="min-w-0 flex-1">
                  <Link to={`/courses/${c.id}`} className="font-medium hover:text-brand-600">{c.title}</Link>
                  <p className="text-sm text-muted">By {db.users.find((u) => u.id === c.tutorId)?.name}</p>
                  {c.rating > 0 && <p className="mt-1 flex items-center gap-1.5 text-[13px]"><span className="font-medium text-amber-700">{c.rating}</span><Stars value={c.rating} size={12} /><span className="text-muted">({compact(c.reviews)})</span></p>}
                  <p className="mt-1 text-xs text-muted">{duration(totalMinutes(c))} total · {c.level}</p>
                  <button onClick={() => store.removeFromCart(c.id)} className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Remove</button>
                </div>
                <div className="text-right font-medium">{money(c.price)}</div>
              </div>
            ))}
          </div>
          <div className="h-fit rounded-xl border border-line p-6 lg:sticky lg:top-24 dark:border-white/10">
            <p className="text-sm font-medium text-muted">Total</p>
            <p className="text-4xl font-semibold tracking-[-0.03em]">{money(subtotal)}</p>
            <div className="mt-6 space-y-3">
              <label className="label" htmlFor="card">Card number</label>
              <div className="relative"><CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" /><input id="card" className="field h-11 pl-9 tabular-nums" defaultValue="4242 4242 4242 4242" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label" htmlFor="exp">Expiry</label><input id="exp" className="field h-11" defaultValue="12 / 29" /></div>
                <div><label className="label" htmlFor="cvc">CVC</label><input id="cvc" className="field h-11" defaultValue="123" /></div>
              </div>
            </div>
            <button
              disabled={paying}
              onClick={() => {
                setPaying(true)
                setTimeout(() => nav(`/checkout/success?order=${store.checkout()}`), 900)
              }}
              className="btn-primary btn-lg mt-6 w-full"
            >
              {paying ? 'Processing…' : `Pay ${money(subtotal)}`}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock className="size-3" /> Demo checkout — no payment is taken</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted"><ShieldCheck className="size-3" /> 30-day money-back guarantee</p>
          </div>
        </div>
      )}
    </div>
  )
}

export function CheckoutSuccess() {
  const [p] = useSearchParams()
  return (
    <div className="container-x max-w-lg py-24 text-center">
      <CheckCircle2 className="mx-auto size-14 text-emerald-500" strokeWidth={1.5} />
      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">You're enrolled</h1>
      <p className="mt-2 text-muted">Order <span className="font-mono text-ink dark:text-white">{p.get('order')}</span> is confirmed. Your new courses are waiting in My learning.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/dashboard/learning" className="btn-primary btn-lg">Start learning</Link>
        <Link to="/courses" className="btn-secondary btn-lg">Keep browsing</Link>
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="container-x max-w-lg py-28 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">We couldn't find that page</h1>
      <p className="mt-2 text-muted">It may have moved, or the link might be wrong.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/courses" className="btn-secondary">Browse courses</Link>
      </div>
    </div>
  )
}
