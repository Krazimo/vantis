'use client'

import { useState } from 'react'
import { User, Bell } from 'lucide-react'
import { ROLE_DISPLAY, NAME_MAP, NOTIF_ITEMS } from './_data/settings.data'
import DataFreshnessSection from './_components/DataFreshnessSection'
import DemoModeSection from './_components/DemoModeSection'
import { useOfficer } from '@/features/govern/hooks/useOfficer'
import { useDemoMode } from '@/features/govern/hooks/useDemoMode'
import { PageShell } from '@/features/govern/components/PageShell'

export default function Settings() {
  const { mounted, officer: rawOfficer } = useOfficer()
  const { demoMode, toggleDemoMode } = useDemoMode()
  const [notif, setNotif] = useState({ priority1: true, qprDefaults: true, newLitigation: false, weeklyReport: true })

  const officer = rawOfficer
    ? { email: rawOfficer.email, role: rawOfficer.role, name: NAME_MAP[rawOfficer.email] ?? rawOfficer.name }
    : null

  if (!mounted) return <div className="min-h-screen bg-background" />

  return (
    <PageShell
      title="Settings"
      subtitle="Account, notifications, data freshness, and demo mode"
    >
      <div className="max-w-3xl">
        <div className="bg-card border border-border rounded-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Current User</h2>
          </div>
          {officer ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Name</div><div className="text-foreground text-sm">{officer.name}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Email</div><div className="font-mono text-xs text-primary">{officer.email}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Role</div><div className="text-foreground text-sm">{ROLE_DISPLAY[officer.role] ?? officer.role}</div></div>
              <div><div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Session</div><div className="text-status-compliant text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-status-compliant rounded-full inline-block" />Active</div></div>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">No session found. <a href="/govern" className="text-primary hover:underline">Log in</a></p>
          )}
        </div>

        <div className="bg-card border border-border rounded-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Notification Preferences</h2>
          </div>
          <div className="space-y-4">
            {NOTIF_ITEMS.map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-foreground flex items-center gap-2">
                    {item.label}
                    {item.locked && <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-sm">LOCKED</span>}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                <button disabled={item.locked}
                  onClick={() => !item.locked && setNotif(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${notif[item.key as keyof typeof notif] ? 'bg-primary' : 'bg-muted border border-border'} ${item.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-background rounded-full shadow transition-transform duration-200 ${notif[item.key as keyof typeof notif] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <DataFreshnessSection />
        <DemoModeSection demoMode={demoMode} onToggle={toggleDemoMode} />
      </div>
    </PageShell>
  )
}
