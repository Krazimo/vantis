import projectsData from '@/data/projects.json'

export interface NoticeProject {
  id: string
  name: string
  rera: string
  developer_name: string
  location: string
  complaints_pending: number
}

export const PROJECTS = projectsData as NoticeProject[]

export const VIOLATION_TYPES = [
  { value: 'qpr_default',  label: 'QPR Default',                   section: 'Section 63' },
  { value: 'registration', label: 'Project Registration Violation', section: 'Section 59' },
  { value: 'false_info',   label: 'False Information Submitted',    section: 'Section 60' },
  { value: 'unregistered', label: 'Unregistered Project Activity',  section: 'Section 59' },
  { value: 'other',        label: 'Other Regulatory Violation',     section: 'Section 64' },
] as const

export type ViolationValue = typeof VIOLATION_TYPES[number]['value']

export const TODAY_DISPLAY = '13 May 2026'
export const NOTICE_NUMBER_BASE = 'K-RERA/NOTICE'
