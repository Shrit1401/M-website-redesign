'use client'

import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { Link } from '@/lib/router'
import type { Course } from '../data/types'
import { duration, money, totalMinutes } from '../lib/utils'
import { useStore } from '../store/store'
import { CourseImage, PriceLock } from './ui'

export function CourseCard({ course }: { course: Course }) {
  const { db, user, toggleWishlist } = useStore()
  const tutor = db.users.find((u) => u.id === course.tutorId)
  const wished = user ? (db.wishlists[user.id] ?? []).includes(course.id) : false

  return (
    <Link to={`/courses/${course.id}`} className="group flex flex-col">
      <div className="relative">
        <CourseImage src={course.image} category={course.category} hue={course.hue} className="aspect-[4/3] rounded-xl [&_img]:group-hover:scale-[1.03]" />
        {user?.role === 'student' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(course.id)
            }}
            className={clsx('absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-white/90 backdrop-blur transition', wished ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus:opacity-100')}
            aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={clsx('size-3.5 text-[#1c244b]', wished && 'fill-[#1c244b]')} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="line-clamp-2 text-[15px] leading-snug font-medium tracking-[-0.01em]">{course.title}</h3>
        <p className="mt-1 text-[13px] text-muted">
          {tutor?.name} · {duration(totalMinutes(course))}
          {course.rating > 0 && <> · {course.rating.toFixed(1)} ★</>}
        </p>
        <div className="mt-auto pt-3 text-[13px]">
          {user ? <span className="font-medium">{money(course.price)}</span> : <PriceLock />}
        </div>
      </div>
    </Link>
  )
}
