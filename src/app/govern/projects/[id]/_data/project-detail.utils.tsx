import type { QPREntry } from './project-detail.types'

const TODAY = new Date('2026-05-13')

export function getDueDate(quarter: string): Date {
  const [q, year] = quarter.split(' ')
  const y = parseInt(year)
  if (q === 'Q1') return new Date(`${y}-01-15`)
  if (q === 'Q2') return new Date(`${y}-04-15`)
  if (q === 'Q3') return new Date(`${y}-07-15`)
  return new Date(`${y}-10-15`)
}

export function daysLate(quarter: string, entry: QPREntry): number {
  const due = getDueDate(quarter)
  const ref = entry.filed_date ? new Date(entry.filed_date) : TODAY
  return Math.max(0, Math.floor((ref.getTime() - due.getTime()) / 86_400_000))
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtCrore(n: number): string {
  return `₹${n.toLocaleString('en-IN')} Cr`
}

export function fmtInr(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)} L`
  return `₹${n.toLocaleString('en-IN')}`
}

export function statusColor(s: string): string {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}

export function statusDot(s: string): string {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}

export function riskColor(score: number): string {
  if (score >= 70) return 'text-status-compliant'
  if (score >= 40) return 'text-status-caution'
  return 'text-status-risk'
}

export function riskBarColor(score: number): string {
  if (score >= 70) return 'bg-status-compliant'
  if (score >= 40) return 'bg-status-caution'
  return 'bg-status-risk'
}

export function qprRowClass(status: string): string {
  if (status === 'MISSED') return 'bg-status-risk/5'
  if (status === 'LATE')   return 'bg-status-caution/5'
  return ''
}

export function qprStatusEl(status: string) {
  if (status === 'ON_TIME') return <span className="text-status-compliant font-medium text-xs">On Time</span>
  if (status === 'LATE')    return <span className="text-status-caution font-medium text-xs">Late</span>
  if (status === 'MISSED')  return <span className="text-status-risk font-medium text-xs">Missed</span>
  return <span className="text-muted-foreground text-xs">N/A</span>
}

export function severityTextColor(s: string): string {
  if (s === 'CRITICAL' || s === 'HIGH') return 'text-status-risk'
  if (s === 'MEDIUM')                   return 'text-status-caution'
  return 'text-muted-foreground'
}

export function severityDotBg(s: string): string {
  if (s === 'CRITICAL' || s === 'HIGH') return 'bg-status-risk'
  if (s === 'MEDIUM')                   return 'bg-status-caution'
  return 'bg-muted'
}
