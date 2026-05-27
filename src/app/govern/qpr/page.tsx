'use client'

import { useState, useMemo } from 'react'
import { BarChart2 } from 'lucide-react'
import { ALL_ROWS, CURRENT_STATS, FILTER_TABS, QUARTERS, type FilterTab } from './_data/qpr-tracker.data'
import { penalty, fmtInr } from './_data/qpr-tracker.utils'
import QPRTable from './_components/QPRTable'
import BatchNoticeModal from './_components/BatchNoticeModal'

export default function QPRTracker() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [batchModal, setBatchModal] = useState(false)

  const displayRows = useMemo(() =>
    activeFilter === 'ALL' ? ALL_ROWS : ALL_ROWS.filter(r => r.entry.status === activeFilter)
  , [activeFilter])

  const missedRows = ALL_ROWS.filter(r => r.entry.status === 'MISSED')
  const totalPenalty = missedRows.reduce((s, r) => s + penalty(r.quarter, r.entry), 0)

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    const missedIds = displayRows.filter(r => r.entry.status === 'MISSED').map(r => r.id)
    const allSelected = missedIds.every(id => selected.has(id))
    setSelected(allSelected ? new Set() : new Set(missedIds))
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground">QPR Compliance Tracker</h1>
          <p className="text-muted-foreground text-xs mt-1">Quarterly Progress Reports · {QUARTERS.length} quarters tracked</p>
        </div>
        <BarChart2 className="w-6 h-6 text-muted-foreground hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-sm p-4 text-center">
          <div className="text-3xl font-bold text-foreground">{CURRENT_STATS.dueCount}</div>
          <div className="text-muted-foreground text-xs mt-1">Projects Due This Quarter</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">Q1 2026</div>
        </div>
        <div className="bg-card border border-status-compliant/20 rounded-sm p-4 text-center">
          <div className="text-3xl font-bold text-status-compliant">{CURRENT_STATS.onTimeCount}</div>
          <div className="text-muted-foreground text-xs mt-1">Filed On Time</div>
          <div className="text-[10px] text-status-compliant/60 mt-0.5">Q1 2026</div>
        </div>
        <div className="bg-card border border-status-risk/20 rounded-sm p-4 text-center">
          <div className="text-3xl font-bold text-status-risk">{CURRENT_STATS.defaultingCount}</div>
          <div className="text-muted-foreground text-xs mt-1">Defaulting</div>
          <div className="text-[10px] text-status-risk/60 mt-0.5">Q1 2026</div>
        </div>
      </div>

      {totalPenalty > 0 && (
        <div className="bg-status-risk/5 border border-status-risk/20 rounded-sm p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-status-risk text-xs font-semibold uppercase tracking-widest mb-0.5">Total Penalty Accrued Across All Defaulters</div>
            <div className="text-2xl font-bold text-status-risk">{fmtInr(totalPenalty)}</div>
          </div>
          <div className="text-muted-foreground text-xs">@ Rs.25,000 per project per day</div>
        </div>
      )}

      <div className="flex gap-0 border-b border-border mb-4 overflow-x-auto scrollbar-none">
        {FILTER_TABS.map(({ id, label, count }) => (
          <button key={id} onClick={() => setActiveFilter(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors duration-150 -mb-px ${
              activeFilter === id
                ? id === 'MISSED' ? 'border-status-risk text-status-risk' : id === 'LATE' ? 'border-status-caution text-status-caution' : id === 'ON_TIME' ? 'border-status-compliant text-status-compliant' : 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-primary/80'
            }`}>
            {label}
            <span className="text-[10px] opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <QPRTable rows={displayRows} selected={selected} onToggleRow={toggleRow} onToggleAll={toggleAll} />

      <BatchNoticeModal
        selected={selected}
        displayRows={displayRows}
        open={batchModal}
        onClose={() => setBatchModal(false)}
        onClear={() => setSelected(new Set())}
        onConfirm={() => { setBatchModal(false); setSelected(new Set()) }}
        onOpenModal={() => setBatchModal(true)}
      />
    </div>
  )
}
