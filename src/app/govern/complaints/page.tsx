'use client'

import { useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import { COMPLAINTS, FILTER_TABS, type FilterTab } from './_data/complaints.data'
import { tabOf } from './_data/complaints.utils'
import ComplaintsTable from './_components/ComplaintsTable'
import ComplaintsModals from './_components/ComplaintsModals'
import { FilterBar } from '@/features/govern/components/FilterBar'

export default function ComplaintManagement() {
  const [activeTab,     setActiveTab]     = useState<FilterTab>('all')
  const [expandedId,    setExpandedId]    = useState<string | null>(null)
  const [scheduleModal, setScheduleModal] = useState<{ id: string; date: string } | null>(null)
  const [orderModal,    setOrderModal]    = useState<{ id: string; text: string } | null>(null)

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = { all: COMPLAINTS.length, filed: 0, hearing_scheduled: 0, order_passed: 0, resolved: 0 }
    for (const c of COMPLAINTS) counts[tabOf(c)]++
    return counts
  }, [])

  const filtered = useMemo(
    () => activeTab === 'all' ? COMPLAINTS : COMPLAINTS.filter(c => tabOf(c) === activeTab),
    [activeTab]
  )

  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Complaint Management</h1>
          <p className="text-gray text-xs mt-1">Track, schedule hearings, and record orders</p>
        </div>
        <FileText className="w-6 h-6 text-gray hidden sm:block" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-border rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-off-white">17</div>
          <div className="text-gray text-xs mt-1">Total Complaints</div>
        </div>
        <div className="bg-surface border border-amber/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-amber">14</div>
          <div className="text-gray text-xs mt-1">Pending</div>
        </div>
        <div className="bg-surface border border-green/20 rounded-sm p-4 text-center">
          <div className="font-syne text-3xl font-bold text-green">3</div>
          <div className="text-gray text-xs mt-1">Resolved</div>
        </div>
      </div>

      <FilterBar
        tabs={FILTER_TABS.map(t => ({ key: t.key, label: t.label, count: tabCounts[t.key] }))}
        active={activeTab}
        onChange={k => setActiveTab(k as FilterTab)}
        className="mb-4"
      />

      <ComplaintsTable
        complaints={filtered}
        expandedId={expandedId}
        onToggle={id => setExpandedId(prev => prev === id ? null : id)}
        onSchedule={id => setScheduleModal({ id, date: '' })}
        onOrder={id => setOrderModal({ id, text: '' })}
      />

      <ComplaintsModals
        scheduleModal={scheduleModal}
        orderModal={orderModal}
        onScheduleChange={setScheduleModal}
        onOrderChange={setOrderModal}
        onCloseSchedule={() => setScheduleModal(null)}
        onCloseOrder={() => setOrderModal(null)}
      />
    </div>
  )
}
