export interface QPREntry {
  status: string
  filed_date: string | null
  completion_pct: number | null
}

export interface Submission {
  project_id: string
  [key: string]: QPREntry | string
}

export interface LitigationItem {
  type: string
  court: string
  filed: string
  status: string
}

export interface Project {
  id: string
  name: string
  rera: string
  developer_id: string
  developer_name: string
  location: string
  survey_numbers: string[]
  type: string
  total_units: number
  units_sold: number
  declared_cost_crore: number
  completion_date: string
  registration_date: string
  registration_valid_until: string
  extensions: number
  status: string
  risk_score: number
  certificate_id: string | null
  certificate_status: string
  complaints_pending: number
  complaints_resolved: number
  litigation: LitigationItem[]
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

export function statusSentence(project: Project) {
  if (project.status === 'COMPLIANT')
    return `${project.name} is fully compliant with K-RERA regulations. All reports filed on time, no pending complaints, and no active litigation. This project has a clean regulatory record.`
  if (project.status === 'CAUTION')
    return `${project.name} has compliance concerns. Some QPR filings were late and complaints are pending. Review all details carefully before proceeding.`
  return `${project.name} is HIGH RISK. Multiple consecutive QPR failures, ${project.complaints_pending} pending complaints, and ${project.litigation.length} active court case${project.litigation.length !== 1 ? 's' : ''}. Exercise extreme caution.`
}

export function qprKey(quarter: string): string {
  return quarter.toLowerCase().replace(' ', '_')
}
export function dotClasses(status: string) {
  if (status === 'ON_TIME') return 'bg-green border-green shadow-[0_0_8px_rgba(46,204,113,0.5)]'
  if (status === 'LATE')    return 'bg-amber border-amber shadow-[0_0_8px_rgba(243,156,18,0.5)]'
  if (status === 'MISSED')  return 'bg-red border-red shadow-[0_0_8px_rgba(231,76,60,0.5)]'
  return 'bg-gray/30 border-gray/30'
}
export function dotLabel(status: string) {
  if (status === 'ON_TIME') return 'Filed'
  if (status === 'LATE')    return 'Late'
  if (status === 'MISSED')  return 'Missed'
  return 'N/A'
}
export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
