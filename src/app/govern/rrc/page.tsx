'use client'

import { Shield, AlertTriangle } from 'lucide-react'
import { RRCS } from './_data/rrc.data'
import RRCCard from './_components/RRCCard'

export default function RRCTracker() {
  const totalOutstanding = RRCS.filter(r => r.status !== 'RECOVERED').reduce((s, r) => s + r.amount_lakh, 0)

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-foreground">RRC Tracker</h1>
          <p className="text-muted-foreground text-xs mt-1">Revenue Recovery Certificate proceedings</p>
        </div>
        <Shield className="w-6 h-6 text-muted-foreground hidden sm:block" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-foreground">{RRCS.length}</div>
          <div className="text-muted-foreground text-xs mt-1">Active RRCs</div>
        </div>
        <div className="bg-card border border-status-risk/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-status-risk">₹{totalOutstanding.toFixed(2)} L</div>
          <div className="text-muted-foreground text-xs mt-1">Outstanding</div>
        </div>
        <div className="bg-card border border-status-compliant/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-status-compliant">₹0</div>
          <div className="text-muted-foreground text-xs mt-1">Recovered This Quarter</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {RRCS.map(rrc => <RRCCard key={rrc.id} rrc={rrc} />)}
      </div>

      <div className="border-l-2 border-primary pl-4 bg-card rounded-sm p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <div className="text-primary text-xs font-semibold uppercase tracking-widest mb-1">Auto-Escalation Policy</div>
            <div className="text-foreground text-sm leading-relaxed">
              RRCs unacknowledged for <strong>30 days</strong> are automatically escalated to the District Collector&apos;s
              office for coercive recovery. RRC-2026-001 is currently <strong className="text-status-risk">2 days from auto-escalation</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
