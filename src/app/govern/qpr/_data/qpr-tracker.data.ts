import qprData from '@/data/qpr.json'
import type { QPREntry } from '@/features/govern/types/qpr.types'

export type { QPREntry }

export interface QPRRow {
  id: string
  project_id: string
  project_name: string
  developer_name: string
  quarter: string
  entry: QPREntry
}

export type FilterTab = 'ALL' | 'ON_TIME' | 'LATE' | 'MISSED'

export const TODAY = new Date('2026-05-13')
export const CURRENT_QUARTER = 'Q1 2026'
export const QUARTERS = qprData.quarters

export const ALL_ROWS: QPRRow[] = qprData.submissions.flatMap(sub =>
  qprData.quarters.map(q => {
    const key = q.toLowerCase().replace(' ', '_') as keyof typeof sub
    const entry = sub[key] as unknown as QPREntry
    return {
      id: `${sub.project_id}-${q}`,
      project_id: sub.project_id,
      project_name: sub.project_name,
      developer_name: sub.developer_name,
      quarter: q,
      entry,
    }
  })
)

const currentRows = ALL_ROWS.filter(r => r.quarter === CURRENT_QUARTER && r.entry.status !== 'NA')

export const CURRENT_STATS = {
  dueCount: currentRows.length,
  onTimeCount: currentRows.filter(r => r.entry.status === 'ON_TIME').length,
  defaultingCount: currentRows.filter(r => r.entry.status === 'MISSED' || r.entry.status === 'LATE').length,
}

export const FILTER_TABS: { id: FilterTab; label: string; count: number }[] = [
  { id: 'ALL',     label: 'All',     count: ALL_ROWS.filter(r => r.entry.status !== 'NA').length },
  { id: 'ON_TIME', label: 'On Time', count: ALL_ROWS.filter(r => r.entry.status === 'ON_TIME').length },
  { id: 'LATE',    label: 'Late',    count: ALL_ROWS.filter(r => r.entry.status === 'LATE').length },
  { id: 'MISSED',  label: 'Missed',  count: ALL_ROWS.filter(r => r.entry.status === 'MISSED').length },
]
