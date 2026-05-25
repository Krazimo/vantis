import projectsData from '@/data/projects.json'
import qprData from '@/data/qpr.json'

export interface Project {
  id: string
  name: string
  rera: string
  developer_name: string
  location: string
  type: string
  total_units: number
  units_sold: number
  status: string
  risk_score: number
  certificate_status: string
  complaints_pending: number
}

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
  if (s === 'COMPLIANT') return 'text-green'
  if (s === 'CAUTION')   return 'text-amber'
  return 'text-red'
}
export function statusDot(s: string) {
  if (s === 'COMPLIANT') return 'bg-green'
  if (s === 'CAUTION')   return 'bg-amber'
  return 'bg-red'
}
export function qprClasses(status: string) {
  if (status === 'ON_TIME') return 'text-green'
  if (status === 'LATE')    return 'text-amber'
  if (status === 'MISSED')  return 'text-red'
  return 'text-gray'
}
export function qprLabel(status: string) {
  if (status === 'ON_TIME') return 'On Time'
  if (status === 'LATE')    return 'Late'
  if (status === 'MISSED')  return 'Missed'
  return 'N/A'
}
export function certClasses(status: string) {
  if (status === 'FULL')        return 'text-green'
  if (status === 'PROVISIONAL') return 'text-amber'
  if (status === 'NONE')        return 'text-red'
  return 'text-gray'
}
export function riskScoreColor(score: number) {
  if (score >= 70) return 'text-green'
  if (score >= 40) return 'text-amber'
  return 'text-red'
}
export function riskBarColor(score: number) {
  if (score >= 70) return 'bg-green'
  if (score >= 40) return 'bg-amber'
  return 'bg-red'
}
