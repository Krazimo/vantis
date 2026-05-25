import type { QPREntry } from './qpr-tracker.data'
import { TODAY } from './qpr-tracker.data'

export function getDueDate(quarter: string): Date {
  const [q, year] = quarter.split(' ')
  const y = parseInt(year)
  if (q === 'Q1') return new Date(`${y}-01-15`)
  if (q === 'Q2') return new Date(`${y}-04-15`)
  if (q === 'Q3') return new Date(`${y}-07-15`)
  return new Date(`${y}-10-15`)
}

export function daysOverdue(quarter: string, entry: QPREntry): number {
  if (entry.status !== 'MISSED' && entry.status !== 'LATE') return 0
  const due = getDueDate(quarter)
  const ref = entry.filed_date ? new Date(entry.filed_date) : TODAY
  return Math.max(0, Math.floor((ref.getTime() - due.getTime()) / 86_400_000))
}

export function penalty(quarter: string, entry: QPREntry): number {
  if (entry.status !== 'MISSED') return 0
  return daysOverdue(quarter, entry) * 25_000
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtInr(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`
  return `₹${n.toLocaleString('en-IN')}`
}
