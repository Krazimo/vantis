'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Shield, X } from 'lucide-react'
import { NAV, roleTextColor, roleDotBg, type Officer } from '../_data/govern-layout.data'

interface Props {
  officer: Officer
  onLogout: () => void
  onClose: () => void
}

export default function SidebarNav({ officer, onLogout, onClose }: Props) {
  const pathname = usePathname()
  return (
    <div className="flex flex-col h-full w-[220px] bg-surface border-r border-border">
      <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold" />
          <span className="font-syne text-base text-gold">Vantis Govern</span>
        </div>
        <button onClick={onClose} className="md:hidden text-gray hover:text-gold transition-colors duration-150">
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 border-l-2 ${
                active ? 'text-gold bg-border-gold/40 border-gold' : 'text-gray-light hover:text-gold hover:bg-surface2 border-transparent'
              }`}>
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="text-off-white text-xs font-medium truncate">{officer.name}</div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] mt-1.5 ${roleTextColor(officer.role)}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${roleDotBg(officer.role)}`} />
          {officer.role}
        </span>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-gray hover:text-red text-xs mt-3 transition-colors duration-150">
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </div>
  )
}
