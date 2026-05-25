'use client'

import { useState, useMemo } from 'react'
import { Scale } from 'lucide-react'
import { ALL_CASES, TABS, courtCategory, type CourtFilter } from './_data/litigation-watchlist.data'
import LitigationCard from './_components/LitigationCard'

export default function LitigationWatchlist() {
  const [filter, setFilter] = useState<CourtFilter>('ALL')

  const filtered = useMemo(() =>
    filter === 'ALL' ? ALL_CASES : ALL_CASES.filter(l => courtCategory(l) === filter)
  , [filter])

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Litigation Watchlist</h1>
          <p className="text-gray text-xs mt-1">Active court cases · eCourts integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-red" />
          <span className="font-mono text-red text-sm font-bold">{ALL_CASES.length}</span>
          <span className="text-gray text-xs">active alerts</span>
        </div>
      </div>

      <div className="flex gap-0 border-b border-border mb-5 overflow-x-auto scrollbar-none">
        {TABS.map(({ id, label, count }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px ${
              filter === id
                ? id === 'HIGH_COURT' || id === 'CRIMINAL' ? 'border-red text-red' : id === 'DISTRICT' ? 'border-amber text-amber' : 'border-gold text-gold'
                : 'border-transparent text-gray hover:text-gold-light'
            }`}>
            {label}
            <span className="font-mono text-[10px] opacity-70">{count}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-sm p-12 text-center">
          <Scale className="w-8 h-8 text-gray mx-auto mb-3" />
          <div className="text-off-white text-sm font-medium mb-1">No Cases Found</div>
          <div className="text-gray text-xs">No litigation records match this filter.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => <LitigationCard key={l.id} item={l} />)}
        </div>
      )}
    </div>
  )
}
