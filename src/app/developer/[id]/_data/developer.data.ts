import developersData from '@/data/developers.json'
import projectsData from '@/data/projects.json'

export type Language = 'en' | 'kn'

export interface Developer {
  id: string
  name: string
  city: string
  state: string
  trust_score: number
  total_projects: number
  active_projects: number
  completed_projects: number
  total_units: number
  status: string
  years_active: number
  contact_email: string
  contact_phone: string
  projects: string[]
}

export interface Project {
  id: string
  name: string
  location: string
  status: string
  total_units: number
  units_sold: number
  completion_date: string
  risk_score: number
}

export const DEVELOPERS = developersData as Developer[]
export const PROJECTS = projectsData as Project[]

export const COMPONENT_SCORES: Record<string, number[]> = {
  'prestige-group':        [95, 90, 98],
  'zion-estate':           [88, 72, 85],
  'skylark-constructions': [62, 48, 45],
  'ozone-group':           [8,  10, 12],
}

export const TX = {
  en: {
    notFound: 'Developer not found.',
    back: '← Back',
    yearsActive: 'Years Active',
    trustScore: 'Vantis Trust Score',
    stats: ['Total Projects', 'Active Projects', 'Completed', 'Total Units'],
    compliance: 'Compliance Components',
    labels: ['QPR Compliance Rate', 'Complaint Density', 'Completion Rate'],
    projects: 'Registered Projects',
    units: 'units sold of',
    due: 'Due',
    cta: 'Get Full Developer Intelligence Report',
    ctaSub: '₹499 · Includes litigation history, financial analysis, homebuyer risk assessment',
    langToggle: 'ಕನ್ನಡ',
    riskScore: 'Risk Score',
  },
  kn: {
    notFound: 'ಡೆವಲಪರ್ ಕಂಡುಬಂದಿಲ್ಲ.',
    back: '← ಹಿಂದೆ',
    yearsActive: 'ವರ್ಷಗಳ ಸಕ್ರಿಯ',
    trustScore: 'ವಾಂಟಿಸ್ ವಿಶ್ವಾಸ ಸ್ಕೋರ್',
    stats: ['ಒಟ್ಟು ಯೋಜನೆಗಳು', 'ಸಕ್ರಿಯ ಯೋಜನೆಗಳು', 'ಪೂರ್ಣಗೊಂಡವು', 'ಒಟ್ಟು ಘಟಕಗಳು'],
    compliance: 'ಅನುಸರಣೆ ಘಟಕಗಳು',
    labels: ['QPR ಅನುಸರಣೆ ದರ', 'ದೂರು ಸಾಂದ್ರತೆ', 'ಪೂರ್ಣಗೊಳಿಸುವ ದರ'],
    projects: 'ನೋಂದಾಯಿತ ಯೋಜನೆಗಳು',
    units: 'ಘಟಕಗಳು ಮಾರಾಟ',
    due: 'ಮುಕ್ತಾಯ',
    cta: 'ಪೂರ್ಣ ಡೆವಲಪರ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ವರದಿ ಪಡೆಯಿರಿ',
    ctaSub: '₹499 · ಮೊಕದ್ದಮೆ ಇತಿಹಾಸ, ಆರ್ಥಿಕ ವಿಶ್ಲೇಷಣೆ, ಗೃಹಖರೀದಿದಾರ ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ ಒಳಗೊಂಡಿದೆ',
    langToggle: 'English',
    riskScore: 'ರಿಸ್ಕ್ ಸ್ಕೋರ್',
  },
} as const

export type Tx = typeof TX[Language]

export function scoreColor(s: number) {
  if (s >= 70) return 'text-green'
  if (s >= 45) return 'text-amber'
  return 'text-red'
}

export function scoreBorder(s: number) {
  if (s >= 70) return 'border-green/20'
  if (s >= 45) return 'border-amber/30'
  return 'border-red/30'
}

export function barColor(v: number) {
  if (v >= 70) return 'bg-green'
  if (v >= 45) return 'bg-amber'
  return 'bg-red'
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

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}
