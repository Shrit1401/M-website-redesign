'use client'

import { useState } from 'react'
import { useStore } from '../store/store'
import { Avatar, Badge, PageHeader } from './ui'

export function AccountPage({ title = 'Account settings' }: { title?: string }) {
  const { user, updateProfile, toast } = useStore()
  const [form, setForm] = useState({ name: user!.name, email: user!.email, headline: user!.headline ?? '', bio: user!.bio ?? '' })
  const [pw, setPw] = useState({ current: '', next: '' })

  return (
    <>
      <PageHeader title={title} subtitle="Manage your profile and password." />
      <div className="space-y-6">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault()
            updateProfile(form)
            toast('Profile saved')
          }}
        >
          <div className="grid gap-8 p-6 md:grid-cols-[220px_1fr]">
            <div>
              <h3 className="font-medium">Profile</h3>
              <p className="mt-1 text-[13px] text-muted">{user!.role === 'tutor' ? 'Shown on your course pages.' : 'How you appear on Revive.'}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar name={form.name || 'U'} src={user!.avatar} size={64} />
                <div>
                  <p className="font-medium">{form.name}</p>
                  <Badge>{user!.role}</Badge>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label" htmlFor="a-name">Full name</label><input id="a-name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div><label className="label" htmlFor="a-email">Email</label><input id="a-email" className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              </div>
              <div><label className="label" htmlFor="a-head">Headline</label><input id="a-head" className="field" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Product designer" /></div>
              {user!.role === 'tutor' && (
                <div><label className="label" htmlFor="a-bio">Bio</label><textarea id="a-bio" className="field-area" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
              )}
            </div>
          </div>
          <div className="flex justify-end border-t border-line px-6 py-4 dark:border-white/10"><button className="btn-primary">Save profile</button></div>
        </form>
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault()
            if (pw.current !== user!.password) return toast('Current password is incorrect')
            if (pw.next.length < 6) return toast('New password must be at least 6 characters')
            updateProfile({ password: pw.next })
            setPw({ current: '', next: '' })
            toast('Password updated')
          }}
        >
          <div className="grid gap-8 p-6 md:grid-cols-[220px_1fr]">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="mt-1 text-[13px] text-muted">Use at least 6 characters.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="a-cur">Current password</label><input id="a-cur" className="field" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></div>
              <div><label className="label" htmlFor="a-new">New password</label><input id="a-new" className="field" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
            </div>
          </div>
          <div className="flex justify-end border-t border-line px-6 py-4 dark:border-white/10"><button className="btn-secondary">Update password</button></div>
        </form>
      </div>
    </>
  )
}
