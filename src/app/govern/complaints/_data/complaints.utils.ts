import type { Complaint, FilterTab } from './complaints.data'

const TODAY = new Date('2026-05-13')

export function daysPending(filedDate: string, resolvedDate?: string): number {
  const end = resolvedDate ? new Date(resolvedDate) : TODAY
  return Math.floor((end.getTime() - new Date(filedDate).getTime()) / (1000 * 60 * 60 * 24))
}

export function tabOf(c: Complaint): FilterTab {
  if (c.status === 'RESOLVED') return 'resolved'
  if (c.hearing_date) return 'hearing_scheduled'
  return 'filed'
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function statusBadgeColor(c: Complaint): string {
  if (c.status === 'RESOLVED') return 'text-status-compliant'
  if (c.hearing_date) return 'text-blue'
  return 'text-status-caution'
}

export function statusBadgeDot(c: Complaint): string {
  if (c.status === 'RESOLVED') return 'bg-status-compliant'
  if (c.hearing_date) return 'bg-blue'
  return 'bg-status-caution'
}

export function statusLabel(c: Complaint): string {
  if (c.status === 'RESOLVED') return 'Resolved'
  if (c.hearing_date) return 'Hearing Scheduled'
  return 'Filed'
}
