'use client'

import { Users, Shield } from 'lucide-react'
import { ROWS } from './_data/homebuyer.data'
import HomebuyerTable from './_components/HomebuyerTable'
import { StatCard } from '@/features/govern/components/StatCard'

export default function HomebuyerEarlyWarning() {
  const totalDistressed = ROWS.filter(r => r.tier === 'CRITICAL').reduce((s, r) => s + r.homebuyers, 0)
  const totalCapital    = ROWS.filter(r => r.tier !== 'CLEAR').reduce((s, r) => s + r.capital_crore, 0)
  const criticalCount   = ROWS.filter(r => r.tier === 'CRITICAL').length

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Homebuyer Early Warning</h1>
          <p className="text-gray text-xs mt-1">Proactive protection for at-risk homebuyers</p>
        </div>
        <Users className="w-6 h-6 text-gray hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <StatCard label="Homebuyers in Distressed Projects" value={totalDistressed.toLocaleString('en-IN')} valueColor="text-red" />
        <StatCard label="Total Capital at Risk" value={`₹${totalCapital.toFixed(0)} Cr`} valueColor="text-red" />
        <StatCard label="Projects in Critical State" value={String(criticalCount)} valueColor="text-amber" />
      </div>

      <HomebuyerTable />

      <div className="border-l-2 border-gold pl-4 bg-surface rounded-sm p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Vantis Proactive Intelligence</div>
            <div className="text-off-white text-sm leading-relaxed">
              K-RERA currently waits for homebuyers to file complaints.{' '}
              <strong>Vantis flags projects before the complaints arrive</strong> — using QPR patterns, escrow velocity,
              and litigation signals to identify distress 6–8 quarters early.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
