import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { POSTS } from '../../data/news'
import { date } from '../../lib/utils'

export function News() {
  const [featured, ...rest] = POSTS
  return (
    <div className="container-x pt-24">
      <p className="kicker">News</p>
      <h1 className="display mt-5 text-[44px] sm:text-[64px]">Notes on learning and careers</h1>
      <p className="mt-3 max-w-md text-muted">Guides, course updates and stories from the Revive Skills community.</p>

      <Link to={`/news/${featured.slug}`} className="group mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div className="mono overflow-hidden rounded-2xl">
          <img src={featured.image} alt="" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
        </div>
        <div>
          <p className="text-xs text-muted">{featured.category} · {date(featured.date)}</p>
          <h2 className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.03em] group-hover:underline group-hover:underline-offset-4">{featured.title}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{featured.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium">Read article <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span>
        </div>
      </Link>

      <div className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link key={p.slug} to={`/news/${p.slug}`} className="group">
            <div className="mono overflow-hidden rounded-xl">
              <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
            <p className="mt-4 text-xs text-muted">{p.category} · {date(p.date)}</p>
            <h3 className="mt-2 text-[17px] leading-snug font-medium tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function NewsPost() {
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/news" replace />
  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)
  return (
    <article className="container-x pt-16">
      <div className="mx-auto max-w-2xl">
        <Link to="/news" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink"><ArrowLeft className="size-3.5" /> All news</Link>
        <p className="mt-10 text-xs text-muted">{post.category} · {date(post.date)} · {post.author}</p>
        <h1 className="mt-3 text-4xl leading-[1.1] font-semibold tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
      </div>
      <div className="mono mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl">
        <img src={post.image} alt="" className="aspect-[21/9] w-full object-cover" />
      </div>
      <div className="mx-auto mt-10 max-w-2xl space-y-5 text-[16px] leading-[1.75]">
        {post.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>
      <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-line p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-medium">Ready to start learning?</p>
          <p className="mt-1 text-[13px] text-muted">Browse expert-led, career-focused courses.</p>
        </div>
        <Link to="/courses" className="btn-primary mt-4 sm:mt-0">Explore courses</Link>
      </div>
      <div className="mx-auto mt-16 max-w-2xl border-t border-line pt-10">
        <p className="text-xs font-medium">More from News</p>
        <div className="mt-5 grid gap-8 sm:grid-cols-2">
          {more.map((p) => (
            <Link key={p.slug} to={`/news/${p.slug}`} className="group">
              <p className="text-xs text-muted">{date(p.date)}</p>
              <h3 className="mt-1 text-[15px] leading-snug font-medium group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}
