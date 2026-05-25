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
  if (s === 'COMPLIANT') return 'text-green'
  if (s === 'CAUTION')   return 'text-amber'
  return 'text-red'
}

export function statusDot(s: string): string {
  if (s === 'COMPLIANT') return 'bg-green'
  if (s === 'CAUTION')   return 'bg-amber'
  return 'bg-red'
}

export function riskColor(score: number): string {
  if (score >= 70) return 'text-green'
  if (score >= 40) return 'text-amber'
  return 'text-red'
}

export function riskBarColor(score: number): string {
  if (score >= 70) return 'bg-green'
  if (score >= 40) return 'bg-amber'
  return 'bg-red'
}

export function qprRowClass(status: string): string {
  if (status === 'MISSED') return 'bg-red/5'
  if (status === 'LATE')   return 'bg-amber/5'
  return ''
}

export function qprStatusEl(status: string) {
  if (status === 'ON_TIME') return <span className="text-green font-medium text-xs">On Time</span>
  if (status === 'LATE')    return <span className="text-amber font-medium text-xs">Late</span>
  if (status === 'MISSED')  return <span className="text-red font-medium text-xs">Missed</span>
  return <span className="text-gray text-xs">N/A</span>
}

export function severityTextColor(s: string): string {
  if (s === 'CRITICAL' || s === 'HIGH') return 'text-red'
  if (s === 'MEDIUM')                   return 'text-amber'
  return 'text-gray'
}

export function severityDotBg(s: string): string {
  if (s === 'CRITICAL' || s === 'HIGH') return 'bg-red'
  if (s === 'MEDIUM')                   return 'bg-amber'
  return 'bg-gray'
}
