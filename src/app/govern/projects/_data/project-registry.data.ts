import projectsData from '@/data/projects.json'
import qprData from '@/data/qpr.json'
import type { Project } from '@/features/govern/types/project.types'

export type { Project }

export type StatusFilter = 'ALL' | 'COMPLIANT' | 'CAUTION' | 'HIGH RISK'

export const PROJECTS = projectsData as Project[]

export const LAST_QUARTER = qprData.quarters[qprData.quarters.length - 1]

export const UNIQUE_DEVELOPERS = Array.from(new Set(PROJECTS.map(p => p.developer_name)))

export function qprKey(q: string) {
  return q.toLowerCase().replace(' ', '_')
}

export function getLastQPR(projectId: string): string {
  const sub = qprData.submissions.find(s => s.project_id === projectId)
  if (!sub) return 'NA'
  const entry = (sub as Record<string, unknown>)[qprKey(LAST_QUARTER)] as { status: string } | undefined
  return entry?.status ?? 'NA'
}

export function statusColor(s: string) {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}
export function statusDot(s: string) {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}
export function qprClasses(status: string) {
  if (status === 'ON_TIME') return 'text-status-compliant'
  if (status === 'LATE')    return 'text-status-caution'
  if (status === 'MISSED')  return 'text-status-risk'
  return 'text-muted-foreground'
}
export function qprLabel(status: string) {
  if (status === 'ON_TIME') return 'On Time'
  if (status === 'LATE')    return 'Late'
  if (status === 'MISSED')  return 'Missed'
  return 'N/A'
}
export function certClasses(status: string) {
  if (status === 'FULL')        return 'text-status-compliant'
  if (status === 'PROVISIONAL') return 'text-status-caution'
  if (status === 'NONE')        return 'text-status-risk'
  return 'text-muted-foreground'
}
export function riskScoreColor(score: number) {
  if (score >= 70) return 'text-status-compliant'
  if (score >= 40) return 'text-status-caution'
  return 'text-status-risk'
}
export function riskBarColor(score: number) {
  if (score >= 70) return 'bg-status-compliant'
  if (score >= 40) return 'bg-status-caution'
  return 'bg-status-risk'
}
