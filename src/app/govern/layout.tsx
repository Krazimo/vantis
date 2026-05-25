'use client'

import { useState, useEffect } from 'react'
import { Shield, Menu } from 'lucide-react'
import { roleTextColor, roleDotBg, type Officer } from './_data/govern-layout.data'
import SidebarNav from './_components/SidebarNav'
import LoginScreen from './_components/LoginScreen'

export default function GovernLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [officer, setOfficer] = useState<Officer | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('vantis_officer')
      if (stored) setOfficer(JSON.parse(stored))
      if (localStorage.getItem('vantis_demo_mode') === 'true') setDemoMode(true)
    } catch { /* ignore */ }

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setDemoMode(prev => {
          const next = !prev
          try { localStorage.setItem('vantis_demo_mode', String(next)) } catch { /* ignore */ }
          return next
        })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  if (!mounted) return <div className="min-h-screen bg-background" />

  if (!officer) {
    return <LoginScreen onLogin={o => { localStorage.setItem('vantis_officer', JSON.stringify(o)); setOfficer(o) }} />
  }

  function handleLogout() {
    localStorage.removeItem('vantis_officer')
    setOfficer(null)
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
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-light hover:text-gold transition-colors duration-150">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            <span className="font-syne text-sm text-gold">Vantis Govern</span>
            {demoMode && <span className="text-[9px] font-bold bg-gold text-background px-1.5 py-0.5 rounded tracking-widest">DEMO</span>}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[10px] ${roleTextColor(officer.role)}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleDotBg(officer.role)}`} />
            {officer.role}
          </span>
        </div>

        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-surface sticky top-0 z-20">
          <span className="font-mono text-xs text-gray tracking-widest uppercase">K-RERA Officer Portal</span>
          <div className="flex items-center gap-3">
            {demoMode && <span className="text-[10px] font-bold bg-gold text-background px-2 py-0.5 rounded tracking-widest">DEMO</span>}
            <span className="text-off-white text-xs">{officer.name}</span>
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
