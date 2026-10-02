'use client'

// Thin React Router–style API on top of next/navigation, so pages written for
// react-router-dom keep working unchanged under the Next.js App Router.
import NextLink from 'next/link'
import { useParams as useNextParams, usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation'
import { useCallback, useEffect, type ComponentProps, type ReactNode } from 'react'

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & { to: string }

export function Link({ to, ...rest }: LinkProps) {
  return <NextLink href={to} {...rest} />
}

type NavLinkProps = Omit<LinkProps, 'className' | 'children'> & {
  end?: boolean
  className?: string | ((s: { isActive: boolean }) => string)
  children?: ReactNode | ((s: { isActive: boolean }) => ReactNode)
}

export function NavLink({ to, end, className, children, ...rest }: NavLinkProps) {
  const pathname = usePathname()
  const path = to.split('?')[0]
  const isActive = end ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)
  return (
    <NextLink
      href={to}
      aria-current={isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className({ isActive }) : className}
      {...rest}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </NextLink>
  )
}

export function useNavigate() {
  const router = useRouter()
  return useCallback(
    (to: string, opts?: { replace?: boolean }) => (opts?.replace ? router.replace(to) : router.push(to)),
    [router],
  )
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const nav = useNavigate()
  useEffect(() => { nav(to, { replace }) }, [nav, to, replace])
  return null
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  return useNextParams() as Partial<T>
}

export function useLocation() {
  const pathname = usePathname()
  const search = useNextSearchParams().toString()
  return { pathname, search: search ? `?${search}` : '' }
}

type ParamsInit = URLSearchParams | Record<string, string>

export function useSearchParams() {
  const params = useNextSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const setParams = useCallback(
    (next: ParamsInit, opts?: { replace?: boolean }) => {
      const qs = new URLSearchParams(next).toString()
      const url = qs ? `${pathname}?${qs}` : pathname
      if (opts?.replace) router.replace(url, { scroll: false })
      else router.push(url, { scroll: false })
    },
    [router, pathname],
  )
  return [new URLSearchParams(params.toString()), setParams] as const
}
