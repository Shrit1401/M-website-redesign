'use client'

import clsx from 'clsx'
import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from '@/lib/router'
import { CourseCard } from '../../components/CourseCard'
import { Empty, Stars } from '../../components/ui'
import type { Course } from '../../data/types'
import { totalMinutes } from '../../lib/utils'
import { useStore } from '../../store/store'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const RATINGS = [['4.5', '4.5 & up'], ['4.0', '4.0 & up']] as const
const LENGTHS = [['short', 'Under 3 hours', 0, 180], ['mid', '3–6 hours', 180, 360], ['long', '6+ hours', 360, Infinity]] as const

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="mb-3 text-xs font-medium text-muted">{title}</legend>
      <div className="space-y-2.5">{children}</div>
    </fieldset>
  )
}

function Option({ checked, onChange, label, count, type = 'radio' }: { checked: boolean; onChange: () => void; label: ReactNode; count?: number; type?: 'radio' | 'checkbox' }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
      <input type={type} checked={checked} onChange={onChange} className="size-3.5 accent-[#467ff7]" />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-muted tabular-nums">{count}</span>}
    </label>
  )
}

export default function Courses() {
  const { db, user } = useStore()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const level = params.get('level') ?? ''
  const rating = params.get('rating') ?? ''
  const length = params.get('length') ?? ''
  const sort = params.get('sort') ?? 'popular'

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (!value || next.get(key) === value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const published = db.courses.filter((c) => c.status === 'published')
  const matches = (c: Course, skip?: string) => {
    const term = q.toLowerCase()
    const tutor = db.users.find((u) => u.id === c.tutorId)?.name ?? ''
    const len = LENGTHS.find((l) => l[0] === length)
    const mins = totalMinutes(c)
    return (
      (!term || `${c.title} ${c.subtitle} ${c.category} ${tutor}`.toLowerCase().includes(term)) &&
      (skip === 'category' || !category || c.category === category) &&
      (skip === 'level' || !level || c.level === level || c.level === 'All levels') &&
      (skip === 'rating' || !rating || c.rating >= Number(rating)) &&
      (skip === 'length' || !len || (mins >= len[2] && mins < len[3]))
    )
  }

  const list = useMemo(() => {
    const r = published.filter((c) => matches(c))
    const sorters: Record<string, (a: Course, b: Course) => number> = {
      popular: (a, b) => b.students - a.students,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.updated.localeCompare(a.updated),
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
    }
    return r.sort(sorters[sort] ?? sorters.popular)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db.courses, q, category, level, rating, length, sort])

  const active = [
    q && { k: 'q', label: `“${q}”` },
    category && { k: 'category', label: category },
    level && { k: 'level', label: level },
    rating && { k: 'rating', label: `${rating}+ rating` },
    length && { k: 'length', label: LENGTHS.find((l) => l[0] === length)?.[1] ?? '' },
  ].filter(Boolean) as { k: string; label: string }[]

  const filters = (
    <div>
      <Group title="Category">
        <Option checked={!category} onChange={() => set('category', '')} label="All categories" count={published.filter((c) => matches(c, 'category')).length} />
        {db.categories.map((c) => (
          <Option key={c} checked={category === c} onChange={() => set('category', c)} label={c} count={published.filter((x) => x.category === c && matches(x, 'category')).length} />
        ))}
      </Group>
      <Group title="Level">
        {LEVELS.map((l) => (
          <Option key={l} type="checkbox" checked={level === l} onChange={() => set('level', l)} label={l} count={published.filter((x) => (x.level === l || x.level === 'All levels') && matches(x, 'level')).length} />
        ))}
      </Group>
      <Group title="Rating">
        {RATINGS.map(([v, l]) => (
          <Option key={v} checked={rating === v} onChange={() => set('rating', v)} label={<span className="flex items-center gap-2"><Stars value={Number(v)} size={13} /> {l}</span>} count={published.filter((x) => x.rating >= Number(v) && matches(x, 'rating')).length} />
        ))}
      </Group>
      <Group title="Video length">
        {LENGTHS.map(([v, l, lo, hi]) => (
          <Option key={v} type="checkbox" checked={length === v} onChange={() => set('length', v)} label={l} count={published.filter((x) => totalMinutes(x) >= lo && totalMinutes(x) < hi && matches(x, 'length')).length} />
        ))}
      </Group>
    </div>
  )

  return (
    <div className="container-x pb-10">
      <nav className="pt-6 text-[13px] text-muted"><Link to="/" className="hover:text-ink dark:hover:text-white">Home</Link> <span className="mx-1.5">/</span> <span className="text-ink dark:text-white">Courses</span></nav>
      <h1 className="display mt-6 text-[40px] sm:text-[64px]">{q ? `Results for “${q}”` : category || 'All courses'}</h1>
      <p className="mt-4 text-[15px] text-muted">{category ? `Career-focused ${category.toLowerCase()} courses taught by practitioners.` : 'Browse every course on Revive Skills.'}</p>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-y border-line py-3">
        <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary lg:hidden"><SlidersHorizontal className="size-4" /> Filters{active.length ? ` (${active.length})` : ''}</button>
        <p className="text-[13px] font-medium">{list.length} course{list.length === 1 ? '' : 's'}</p>
        <div className="flex flex-wrap gap-1.5">
          {active.map((a) => (
            <button key={a.k} onClick={() => set(a.k, '')} className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs hover:border-ink">
              {a.label} <X className="size-3" />
            </button>
          ))}
          {active.length > 1 && <button onClick={() => setParams({})} className="px-1 text-xs font-semibold text-muted hover:text-ink">Clear all</button>}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted">Sort by</span>
          <select value={sort} onChange={(e) => set('sort', e.target.value === 'popular' ? '' : e.target.value)} className="field h-8 w-auto border-0 pr-7 font-medium hover:bg-surface">
            <option value="popular">Most popular</option>
            <option value="rating">Highest rated</option>
            <option value="newest">Newest</option>
            {user && <option value="price-asc">Price: low to high</option>}
            {user && <option value="price-desc">Price: high to low</option>}
          </select>
        </label>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[230px_1fr]">
        <aside className={clsx(showFilters ? 'block' : 'hidden', 'lg:block')}>{filters}</aside>
        <div>
          {list.length ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          ) : (
            <Empty icon={SearchX} title="No courses match" text="Try removing a filter or searching for something broader." action={<button className="btn-secondary" onClick={() => setParams({})}>Clear filters</button>} />
          )}
        </div>
      </div>
    </div>
  )
}
