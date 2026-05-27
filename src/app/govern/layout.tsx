'use client'

import { useState } from 'react'
import { Shield, Menu } from 'lucide-react'
import { roleTextColor, roleDotBg } from './_data/govern-layout.data'
import SidebarNav from './_components/SidebarNav'
import LoginScreen from './_components/LoginScreen'
import { useOfficer } from '@/features/govern/hooks/useOfficer'
import { useDemoMode } from '@/features/govern/hooks/useDemoMode'

export default function GovernLayout({ children }: { children: React.ReactNode }) {
  const { mounted, officer, saveOfficer, clearOfficer } = useOfficer()
  const { demoMode } = useDemoMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!mounted) return <div className="min-h-screen bg-background" />

  if (!officer) {
    return <LoginScreen onLogin={saveOfficer} />
  }

  function handleLogout() {
    clearOfficer()
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden md:block fixed left-0 top-0 h-full z-30">
        <SidebarNav officer={officer} onLogout={handleLogout} onClose={() => {}} />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <SidebarNav officer={officer} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-primary transition-colors duration-150">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-syne text-sm text-primary">Vantis Govern</span>
            {demoMode && <span className="text-[9px] font-bold bg-primary text-background px-1.5 py-0.5 rounded tracking-widest">DEMO</span>}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[10px] ${roleTextColor(officer.role)}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleDotBg(officer.role)}`} />
            {officer.role}
          </span>
        </div>

        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-card sticky top-0 z-20">
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">K-RERA Officer Portal</span>
          <div className="flex items-center gap-3">
            {demoMode && <span className="text-[10px] font-bold bg-primary text-background px-2 py-0.5 rounded tracking-widest">DEMO</span>}
            <span className="text-foreground text-xs">{officer.name}</span>
            <span className={`inline-flex items-center gap-1.5 text-xs ${roleTextColor(officer.role)}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleDotBg(officer.role)}`} />
              {officer.role}
            </span>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
