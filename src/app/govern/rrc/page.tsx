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
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">RRC Tracker</h1>
          <p className="text-gray text-xs mt-1">Revenue Recovery Certificate proceedings</p>
        </div>
        <Shield className="w-6 h-6 text-gray hidden sm:block" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-border rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-off-white">{RRCS.length}</div>
          <div className="text-gray text-xs mt-1">Active RRCs</div>
        </div>
        <div className="bg-surface border border-red/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-red">₹{totalOutstanding.toFixed(2)} L</div>
          <div className="text-gray text-xs mt-1">Outstanding</div>
        </div>
        <div className="bg-surface border border-green/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-green">₹0</div>
          <div className="text-gray text-xs mt-1">Recovered This Quarter</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {RRCS.map(rrc => <RRCCard key={rrc.id} rrc={rrc} />)}
      </div>

      <div className="border-l-2 border-gold pl-4 bg-surface rounded-sm p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Auto-Escalation Policy</div>
            <div className="text-off-white text-sm leading-relaxed">
              RRCs unacknowledged for <strong>30 days</strong> are automatically escalated to the District Collector&apos;s
              office for coercive recovery. RRC-2026-001 is currently <strong className="text-red">2 days from auto-escalation</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
