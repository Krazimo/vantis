'use client'

import { useState, useEffect } from 'react'
import { User, Bell } from 'lucide-react'
import { ROLE_DISPLAY, NAME_MAP, NOTIF_ITEMS } from './_data/settings.data'
import DataFreshnessSection from './_components/DataFreshnessSection'
import DemoModeSection from './_components/DemoModeSection'

interface OfficerProfile { email: string; role: string; name: string }

export default function Settings() {
  const [mounted, setMounted] = useState(false)
  const [officer, setOfficer] = useState<OfficerProfile | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [notif, setNotif] = useState({ priority1: true, qprDefaults: true, newLitigation: false, weeklyReport: true })

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('vantis_officer')
      if (stored) {
        const parsed = JSON.parse(stored) as { email: string; role: string }
        setOfficer({ email: parsed.email, role: parsed.role, name: NAME_MAP[parsed.email] ?? parsed.email })
      }
      if (localStorage.getItem('vantis_demo_mode') === 'true') setDemoMode(true)
    } catch (error) { console.warn('vantis localStorage read unavailable:', error) }
  }, [])

  function toggleDemoMode() {
    const next = !demoMode
    setDemoMode(next)
    try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode localStorage write unavailable:', error) }
  }

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Settings</h1>
        <p className="text-gray text-xs mt-1">Account, notifications, data freshness, and demo mode</p>
      </div>

      <div className="bg-surface border border-border rounded-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gold" />
          <h2 className="font-syne text-sm font-semibold text-off-white uppercase tracking-widest">Current User</h2>
        </div>
        {officer ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><div className="text-[10px] uppercase tracking-widest text-gray mb-1">Name</div><div className="text-off-white text-sm">{officer.name}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-gray mb-1">Email</div><div className="font-mono text-xs text-gold">{officer.email}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-gray mb-1">Role</div><div className="text-off-white text-sm">{ROLE_DISPLAY[officer.role] ?? officer.role}</div></div>
            <div><div className="text-[10px] uppercase tracking-widest text-gray mb-1">Session</div><div className="text-green text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green rounded-full inline-block" />Active</div></div>
          </div>
        ) : (
          <p className="text-gray text-xs">No session found. <a href="/govern" className="text-gold hover:underline">Log in</a></p>
        )}
      </div>

      <div className="bg-surface border border-border rounded-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-gold" />
          <h2 className="font-syne text-sm font-semibold text-off-white uppercase tracking-widest">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {NOTIF_ITEMS.map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm text-off-white flex items-center gap-2">
                  {item.label}
                  {item.locked && <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-1.5 py-0.5 rounded-sm">LOCKED</span>}
                </div>
                <div className="text-xs text-gray mt-0.5">{item.desc}</div>
              </div>
              <button disabled={item.locked}
                onClick={() => !item.locked && setNotif(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${notif[item.key as keyof typeof notif] ? 'bg-gold' : 'bg-surface2 border border-border'} ${item.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow transition-transform duration-200 ${notif[item.key as keyof typeof notif] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <DataFreshnessSection />
      <DemoModeSection demoMode={demoMode} onToggle={toggleDemoMode} />
    </div>
  )
}
