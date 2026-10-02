# 3. Authentication and roles

Today:

- `login`, `signup`, `loginAs`, `logout` in `src/store/store.tsx` compare plain-text passwords and save the user id in `localStorage` (`revive-session`).
- `RequireRole` and `DashboardLayout role="..."` in `src/layouts/DashboardLayout.tsx` redirect users who have the wrong role. This happens on the client, after render.

After:

- **Auth.js v5** with a Credentials provider (email + password, bcrypt).
- The session is a signed JWT cookie that holds `id` and `role`.
- **Middleware** blocks `/dashboard`, `/tutor`, `/admin` and `/learn` early. **Server-side guards** in each layout or page do the real checks.

## `src/lib/auth.ts`

```ts
import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import type { Role } from '@prisma/client'
import { prisma } from './prisma'

declare module 'next-auth' {
  interface Session {
    user: { id: string; role: Role } & DefaultSession['user']
  }
  interface User {
    role: Role
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
        if (!user) return null
        if (!(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null
        if (user.status === 'SUSPENDED') return null // surface a nicer message in the login action

        return { id: user.id, name: user.name, email: user.email, image: user.avatar, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      return session
    },
  },
})
```

## `src/app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

## `src/lib/guards.ts` (replaces `RequireRole`)

```ts
import { redirect } from 'next/navigation'
import type { Role } from '@prisma/client'
import { auth } from './auth'

export const HOME_FOR: Record<Role, string> = { STUDENT: '/dashboard', TUTOR: '/tutor', ADMIN: '/admin' }

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(role: Role) {
  const user = await requireUser()
  if (user.role !== role) redirect(HOME_FOR[user.role])
  return user
}
```

Use it at the top of each area's `layout.tsx`:

```tsx
// src/app/admin/layout.tsx
import { requireRole } from '@/lib/guards'
import DashboardShell from '@/components/DashboardShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('ADMIN')
  return <DashboardShell role="ADMIN" user={user}>{children}</DashboardShell>
}
```

**Server actions must check the role again.** Layout checks only protect page rendering. A server action can be called directly.

## `src/middleware.ts` (early redirect)

```ts
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const AREA_ROLE = { '/dashboard': 'STUDENT', '/learn': 'STUDENT', '/tutor': 'TUTOR', '/admin': 'ADMIN' } as const

export default auth((req) => {
  const path = req.nextUrl.pathname
  const area = (Object.keys(AREA_ROLE) as (keyof typeof AREA_ROLE)[]).find((p) => path.startsWith(p))
  if (!area) return

  if (!req.auth) {
    const url = new URL('/login', req.url)
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/tutor/:path*', '/admin/:path*', '/checkout/:path*'],
}
```

## Server actions: `src/actions/auth.ts`

```ts
'use server'

import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/lib/auth'
import { HOME_FOR } from '@/lib/guards'

export type FormState = { error?: string } | undefined

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const user = await prisma.user.findUnique({ where: { email }, select: { status: true, role: true } })
  if (user?.status === 'SUSPENDED') {
    return { error: 'This account has been suspended. Contact support@reviveskills.com.' }
  }
  try {
    await signIn('credentials', { email, password: form.get('password'), redirect: false })
  } catch (e) {
    if (e instanceof AuthError) return { error: 'Incorrect email or password.' }
    throw e
  }
  redirect(String(form.get('next') || HOME_FOR[user!.role]))
}

const signupSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'TUTOR']), // never allow ADMIN from the public form
})

export async function signupAction(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const { name, email, password, role } = parsed.data
  if (await prisma.user.findUnique({ where: { email } })) {
    return { error: 'An account with this email already exists.' }
  }
  await prisma.user.create({ data: { name, email, role, passwordHash: await bcrypt.hash(password, 10) } })
  await signIn('credentials', { email, password, redirect: false })
  redirect(HOME_FOR[role])
}

// Replaces loginAs(role) — the one-click demo buttons. Hide behind a flag in production.
const DEMO_EMAIL: Record<Role, string> = {
  STUDENT: 'student@revive.dev',
  TUTOR: 'tutor@revive.dev',
  ADMIN: 'admin@revive.dev',
}

export async function demoLoginAction(role: Role) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') throw new Error('Demo login disabled')
  await signIn('credentials', { email: DEMO_EMAIL[role], password: 'demo123', redirect: false })
  redirect(HOME_FOR[role])
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' })
}
```

## Login page (client form)

```tsx
// src/app/(auth)/login/LoginForm.tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined)
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ''} />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}
      <button disabled={pending}>Log in</button>
    </form>
  )
}
```

Move the markup and styles from `src/views/public/Auth.tsx` into this component. Only the submit logic changes.

## Reading the user in client components

The header (`UserMenu`) and similar components need the current user. Do one of the following:

- Pass `user` down as a prop from a server layout (simplest), or
- Wrap the app in `<SessionProvider>` from `next-auth/react` and call `useSession()`.

## Add to `.env`

```bash
NEXT_PUBLIC_DEMO_MODE="true"
```
