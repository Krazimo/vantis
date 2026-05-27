'use client'

import { useState, useMemo } from 'react'
import { Scale } from 'lucide-react'
import { ALL_CASES, TABS, courtCategory, type CourtFilter } from './_data/litigation-watchlist.data'
import LitigationCard from './_components/LitigationCard'
import { FilterBar } from '@/features/govern/components/FilterBar'

export default function LitigationWatchlist() {
  const [filter, setFilter] = useState<CourtFilter>('ALL')

  const filtered = useMemo(() =>
    filter === 'ALL' ? ALL_CASES : ALL_CASES.filter(l => courtCategory(l) === filter)
  , [filter])

  return (
    <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-foreground">Litigation Watchlist</h1>
          <p className="text-muted-foreground text-xs mt-1">Active court cases · eCourts integration</p>
        </div>
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-status-risk" />
          <span className="font-mono text-status-risk text-sm font-bold">{ALL_CASES.length}</span>
          <span className="text-muted-foreground text-xs">active alerts</span>
        </div>
      </div>

      <FilterBar
        tabs={TABS.map(({ id, label, count }) => ({ key: id, label, count }))}
        active={filter}
        onChange={k => setFilter(k as CourtFilter)}
        className="mb-5"
      />

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <Scale className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-foreground text-sm font-medium mb-1">No Cases Found</div>
          <div className="text-muted-foreground text-xs">No litigation records match this filter.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => <LitigationCard key={l.id} item={l} />)}
        </div>
      )}
    </div>
  )
}
