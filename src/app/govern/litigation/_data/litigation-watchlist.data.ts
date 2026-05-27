import litigationData from '@/data/litigation.json'
import projectsData from '@/data/projects.json'
import type { LitigationItem } from '@/features/govern/types/litigation.types'

export type { LitigationItem }

export type CourtFilter = 'ALL' | 'HIGH_COURT' | 'DISTRICT' | 'CRIMINAL'

export const TODAY = new Date('2026-05-13')

const projects = projectsData as { id: string; survey_numbers: string[] }[]

export function getSurveyNumbers(projectId: string): string {
  return projects.find(p => p.id === projectId)?.survey_numbers.join(', ') ?? '—'
}

export function daysSince(d: string): number {
  return Math.floor((TODAY.getTime() - new Date(d).getTime()) / 86_400_000)
}

export function daysUntil(d: string): number {
  return Math.floor((new Date(d).getTime() - TODAY.getTime()) / 86_400_000)
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function severityOrder(s: string): number {
  if (s === 'CRITICAL') return 0
  if (s === 'HIGH')     return 1
  if (s === 'MEDIUM')   return 2
  return 3
}

export function courtCategory(item: LitigationItem): string {
  if (item.court.toLowerCase().includes('high court')) return 'HIGH_COURT'
  if (item.type === 'Criminal') return 'CRIMINAL'
  return 'DISTRICT'
}

export function leftBorder(item: LitigationItem): string {
  if (item.court.toLowerCase().includes('high court')) return 'border-l-4 border-l-red'
  if (item.type === 'Criminal') return 'border-l-4 border-l-red'
  return 'border-l-4 border-l-amber'
}

export function caseTypeColor(type: string): string {
  if (type === 'Writ' || type === 'Criminal') return 'text-status-risk'
  if (type === 'Civil') return 'text-status-caution'
  return 'text-muted-foreground'
}
export function caseTypeDot(type: string): string {
  if (type === 'Writ' || type === 'Criminal') return 'bg-status-risk'
  if (type === 'Civil') return 'bg-status-caution'
  return 'bg-muted-light'
}

export function severityTextColor(severity: string): string {
  if (severity === 'CRITICAL' || severity === 'HIGH') return 'text-status-risk'
  if (severity === 'MEDIUM') return 'text-status-caution'
  return 'text-muted-foreground'
}
export function severityDot(severity: string): string {
  if (severity === 'CRITICAL' || severity === 'HIGH') return 'bg-status-risk'
  if (severity === 'MEDIUM') return 'bg-status-caution'
  return 'bg-muted-light'
}

export const ALL_CASES = [...(litigationData as LitigationItem[])]
  .sort((a, b) => severityOrder(a.severity) - severityOrder(b.severity))

export const TABS: { id: CourtFilter; label: string; count: number }[] = [
  { id: 'ALL',        label: 'All',           count: ALL_CASES.length },
  { id: 'HIGH_COURT', label: 'High Court',    count: ALL_CASES.filter(l => courtCategory(l) === 'HIGH_COURT').length },
  { id: 'DISTRICT',   label: 'District Court', count: ALL_CASES.filter(l => courtCategory(l) === 'DISTRICT').length },
  { id: 'CRIMINAL',   label: 'Criminal',      count: ALL_CASES.filter(l => courtCategory(l) === 'CRIMINAL').length },
]
