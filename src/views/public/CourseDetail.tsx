'use client'

import clsx from 'clsx'
import { Award, Check, ChevronDown, FileText, Heart, Infinity as InfinityIcon, Lock, PlayCircle, Smartphone, Star, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from '@/lib/router'
import { Avatar, Badge, CourseImage, Modal, Stars } from '../../components/ui'
import type { Lesson } from '../../data/types'
import { LESSON_ICON } from '../../lib/icons'
import { compact, date, duration, lessons, money, totalMinutes } from '../../lib/utils'
import { useStore } from '../../store/store'

export default function CourseDetail() {
  const { id } = useParams()
  const store = useStore()
  const { db, user } = store
  const nav = useNavigate()
  const course = db.courses.find((c) => c.id === id)
  const [open, setOpen] = useState<Record<string, boolean>>({ [`${id}-s1`]: true })
  const [preview, setPreview] = useState<Lesson | null>(null)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  if (!course) return <Navigate to="/courses" replace />
  const canSeeUnpublished = user && (user.role === 'admin' || user.id === course.tutorId)
  if (course.status !== 'published' && !canSeeUnpublished) return <Navigate to="/courses" replace />

  const tutor = db.users.find((u) => u.id === course.tutorId)
  const tutorCourses = db.courses.filter((c) => c.tutorId === course.tutorId && c.status === 'published')
  const all = lessons(course)
  const firstPreview = all.find((l) => l.preview)
  const enrolled = user ? db.enrollments.find((e) => e.userId === user.id && e.courseId === course.id) : undefined
  const inCart = user ? (db.carts[user.id] ?? []).includes(course.id) : false
  const wished = user ? (db.wishlists[user.id] ?? []).includes(course.id) : false
  const courseReviews = db.reviews.filter((r) => r.courseId === course.id)
  const reviewed = user && courseReviews.some((r) => r.userId === user.id)
  const allOpen = course.curriculum.every((s) => open[s.id])

  const purchase = () => {
    if (!user)
      return (
        <>
          <div className="flex items-start gap-3 text-[13px]">
            <Lock className="mt-0.5 size-4 shrink-0 text-muted" />
            <span><span className="font-medium">Pricing is for members.</span> <span className="text-muted">Log in or create a free account to see the price and enrol.</span></span>
          </div>
          <Link to={`/login?next=/courses/${course.id}`} className="btn-primary btn-lg mt-5 w-full">Log in to enrol</Link>
          <Link to="/signup" className="btn-secondary btn-lg mt-2 w-full">Create free account</Link>
        </>
      )
    if (user.role === 'tutor')
      return user.id === course.tutorId ? <Link to={`/tutor/courses/${course.id}/edit`} className="btn-primary btn-lg w-full">Edit this course</Link> : <p className="text-sm text-muted">You're signed in as an instructor. Switch to a student account to enrol.</p>
    if (user.role === 'admin') return <Link to="/admin/courses" className="btn-dark btn-lg w-full">Manage in admin</Link>
    if (enrolled)
      return (
        <>
          <p className="mb-3 flex items-center gap-2 text-[13px] font-medium"><Check className="size-4" /> You're enrolled in this course</p>
          <Link to={`/learn/${course.id}`} className="btn-primary btn-lg w-full">Go to course</Link>
        </>
      )
    return (
      <>
        <div className="text-[32px] font-semibold tracking-[-0.04em]">{money(course.price)}</div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => {
              if (inCart) return nav('/cart')
              store.addToCart(course.id)
              store.toast('Added to cart')
            }}
            className="btn-primary btn-lg flex-1"
          >
            {inCart ? 'Go to cart' : 'Add to cart'}
          </button>
          <button onClick={() => store.toggleWishlist(course.id)} className="btn-secondary btn-lg w-12 px-0" aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}>
            <Heart className={clsx('size-5', wished && 'fill-rose-500 text-rose-500')} />
          </button>
        </div>
        <button
          onClick={() => {
            store.addToCart(course.id)
            nav('/cart')
          }}
          className="btn-secondary btn-lg mt-2 w-full"
        >
          Buy now
        </button>
        <p className="mt-3 text-center text-xs text-muted">30-day money-back guarantee</p>
      </>
    )
  }

  return (
    <>
      <section className="container-x pt-12 sm:pt-16">
        <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
          <Link to="/courses" className="hover:text-ink">Courses</Link> <span className="text-faint">/</span>
          <Link to={`/courses?category=${encodeURIComponent(course.category)}`} className="hover:text-ink">{course.category}</Link>
        </nav>
        {course.status !== 'published' && <p className="mt-5"><Badge>{course.status}</Badge> <span className="text-xs text-muted">— hidden from learners</span></p>}
        <h1 className="display mt-5 max-w-4xl text-[40px] sm:text-[64px]">{course.title}</h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">{course.subtitle}</p>
        <dl className="mt-10 grid grid-cols-2 gap-y-5 border-t border-line pt-5 text-[13px] sm:grid-cols-5">
          <div><dt className="text-muted">Instructor</dt><dd className="mt-1 font-medium"><a href="#instructor" className="hover:underline">{tutor?.name}</a></dd></div>
          <div><dt className="text-muted">Rating</dt><dd className="mt-1 font-medium">{course.rating > 0 ? <a href="#reviews" className="hover:underline">{course.rating.toFixed(1)} ★ <span className="font-normal text-muted">({compact(course.reviews)})</span></a> : 'New'}</dd></div>
          <div><dt className="text-muted">Learners</dt><dd className="mt-1 font-medium">{compact(course.students)}</dd></div>
          <div><dt className="text-muted">Length</dt><dd className="mt-1 font-medium">{duration(totalMinutes(course))} · {course.level}</dd></div>
          <div><dt className="text-muted">Updated</dt><dd className="mt-1 font-medium">{date(course.updated)}</dd></div>
        </dl>
      </section>

      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="order-2 min-w-0 space-y-16 py-10 lg:order-1">
          <section>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">What you'll learn</h2>
            <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-muted"><Check className="mt-0.5 size-3.5 shrink-0 text-ink" strokeWidth={2.5} /> {o}</li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.02em]">Course content</h2>
                <p className="mt-1 text-sm text-muted">{course.curriculum.length} sections · {all.length} lessons · {duration(totalMinutes(course))} total length</p>
              </div>
              <button onClick={() => setOpen(Object.fromEntries(course.curriculum.map((s) => [s.id, !allOpen])))} className="text-[13px] text-muted hover:text-ink">
                {allOpen ? 'Collapse all' : 'Expand all'}
              </button>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-line dark:border-white/10">
              {course.curriculum.map((s) => (
                <div key={s.id} className="border-b border-line last:border-0 dark:border-white/10">
                  <button onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-surface" aria-expanded={!!open[s.id]}>
                    <ChevronDown className={clsx('size-4 shrink-0 transition', open[s.id] && 'rotate-180')} />
                    <span className="flex-1 text-sm font-medium">{s.title}</span>
                    <span className="hidden text-xs text-muted sm:inline">{s.lessons.length} lessons · {duration(s.lessons.reduce((a, l) => a + l.minutes, 0))}</span>
                  </button>
                  {open[s.id] && (
                    <ul className="py-2">
                      {s.lessons.map((l) => {
                        const Icon = LESSON_ICON[l.type]
                        return (
                          <li key={l.id} className="flex items-center gap-3 px-5 py-2 pl-12 text-sm">
                            <Icon className="size-4 shrink-0 text-muted" />
                            {l.preview ? (
                              <button onClick={() => setPreview(l)} className="flex-1 text-left text-ink underline underline-offset-2">{l.title}</button>
                            ) : (
                              <span className="flex-1">{l.title}</span>
                            )}
                            {l.preview && <span className="hidden text-xs text-muted sm:inline">Preview</span>}
                            <span className="w-12 text-right text-xs text-muted tabular-nums">{duration(l.minutes)}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Requirements</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-faint">{course.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Description</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{course.description}</p>
          </section>

          <section id="instructor" className="scroll-mt-24">
            <h2 className="text-lg font-semibold tracking-[-0.02em]">Instructor</h2>
            <p className="mt-4 text-[15px] font-medium">{tutor?.name}</p>
            <p className="text-sm text-muted">{tutor?.headline}</p>
            <div className="mt-4 flex items-center gap-5">
              <Avatar name={tutor?.name ?? ''} src={tutor?.avatar} size={72} />
              <ul className="space-y-1.5 text-[13px] text-muted">
                <li className="flex items-center gap-2"><Star className="size-4 text-muted" /> {(tutorCourses.reduce((s, c) => s + c.rating, 0) / (tutorCourses.length || 1)).toFixed(1)} instructor rating</li>
                <li className="flex items-center gap-2"><Users className="size-4 text-muted" /> {compact(tutorCourses.reduce((s, c) => s + c.students, 0))} learners</li>
                <li className="flex items-center gap-2"><PlayCircle className="size-4 text-muted" /> {tutorCourses.length} courses</li>
              </ul>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{tutor?.bio}</p>
          </section>

          <section id="reviews" className="scroll-mt-24">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.02em]">
              {course.rating > 0 && <>{course.rating.toFixed(1)} course rating · </>}
              {compact(course.reviews)} ratings
            </h2>
            {enrolled && !reviewed && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!text.trim()) return
                  store.addReview(course.id, rating, text.trim())
                  setText('')
                  store.toast('Thanks for your review')
                }}
                className="mt-5 rounded-xl border border-line p-5 dark:border-white/10"
              >
                <p className="text-sm font-semibold">Rate this course</p>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} stars`}>
                      <Star className={clsx('size-6', i <= rating ? 'fill-ink text-ink' : 'fill-slate-200 text-slate-200 dark:fill-[#1f2270] dark:text-[#1f2270]')} />
                    </button>
                  ))}
                </div>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="field-area mt-3" placeholder="What did you like? What could be better?" />
                <button className="btn-primary mt-3">Post review</button>
              </form>
            )}
            <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
              {courseReviews.length ? courseReviews.map((r) => {
                const u = db.users.find((x) => x.id === r.userId)
                return (
                  <div key={r.id} className="border-t border-line py-5 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <Avatar name={u?.name ?? 'Learner'} src={u?.avatar} size={40} />
                      <div>
                        <div className="text-[13px] font-medium">{u?.name ?? 'Learner'}</div>
                        <div className="flex items-center gap-2 text-xs text-muted"><Stars value={r.rating} size={12} /> {date(r.date)}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{r.text}</p>
                  </div>
                )
              }) : <p className="text-sm text-muted">No written reviews yet.</p>}
            </div>
          </section>
        </div>

        <aside className="order-1 lg:order-2">
          <div className="sticky top-20 mt-10 overflow-hidden rounded-2xl bg-[#f6f8fb]">
            <button onClick={() => firstPreview && setPreview(firstPreview)} className="group relative block w-full" disabled={!firstPreview}>
              <CourseImage src={course.image} category={course.category} hue={course.hue} className="aspect-video" />
              {firstPreview && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent text-white">
                  <span className="grid size-12 place-items-center rounded-full bg-white text-[#1c244b] transition group-hover:scale-105"><PlayCircle className="size-7" /></span>
                  <span className="text-[13px] font-medium">Preview this course</span>
                </span>
              )}
            </button>
            <div className="p-6">
              {purchase()}
              <div className="mt-6 space-y-2.5 border-t border-line pt-5">
                <p className="text-xs text-muted">Includes</p>
                {[
                  [PlayCircle, `${duration(all.filter((l) => l.type === 'video').reduce((s, l) => s + l.minutes, 0))} on-demand video`],
                  [FileText, `${all.filter((l) => l.type !== 'video').length} readings & quizzes`],
                  [Smartphone, 'Access on mobile and desktop'],
                  [InfinityIcon, 'Full lifetime access'],
                  [Award, 'Certificate of completion'],
                ].map(([Icon, t]) => {
                  const I = Icon as typeof PlayCircle
                  return <p key={t as string} className="flex items-center gap-3 text-[13px]"><I className="size-3.5 text-muted" /> {t as string}</p>
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} title="Course preview" wide>
        <p className="mb-3 text-sm text-muted">{course.title}</p>
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-lg bg-black text-white">
          {course.image && <img src={course.image} alt="" className="absolute inset-0 size-full object-cover opacity-40" />}
          <div className="relative text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/95 text-[#1c244b]"><PlayCircle className="size-8" /></span>
            <p className="mt-3 font-semibold">{preview?.title}</p>
            <p className="text-sm text-white/70">{preview && duration(preview.minutes)} · demo player</p>
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold text-muted">Free sample videos</p>
        <ul className="mt-2 divide-y divide-line dark:divide-white/10">
          {all.filter((l) => l.preview).map((l) => (
            <li key={l.id}>
              <button onClick={() => setPreview(l)} className={clsx('flex w-full items-center gap-3 py-2.5 text-left text-sm', l.id === preview?.id ? 'font-medium' : 'text-muted')}>
                <PlayCircle className="size-4" /> <span className="flex-1">{l.title}</span> <span className="text-xs text-muted">{duration(l.minutes)}</span>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  )
}
