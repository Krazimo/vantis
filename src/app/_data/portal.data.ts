import type { Project } from '@/features/govern/types/project.types'
import type { Language } from '@/features/shared/types/i18n.types'

export type FilterType = 'project' | 'developer' | 'rera'
export type { Language, Project }

export const TRANSLATIONS = {
  en: {
    brand: 'Vantis',
    tagline: 'Palantir for Indian real estate',
    heading: 'Know the truth about\nyour K-RERA project',
    sub: 'Search any K-RERA registered project. Instant compliance status. No login required.',
    placeholder: { project: 'Search project name...', developer: 'Search developer name...', rera: 'Enter RERA number...' },
    filterLabels: ['Project', 'Developer', 'RERA Number'],
    stats: [
      { value: '8,357', label: 'Projects Monitored' },
      { value: '891',   label: 'QPR Defaulters' },
      { value: '234',   label: 'Litigation Alerts' },
    ],
    langToggle: 'ಕನ್ನಡ',
    officerLogin: 'Officer Login',
    noResults: 'No projects found.',
    poweredBy: 'Powered by Orianode Technologies · Data updated daily from K-RERA',
  },
  kn: {
    brand: 'ವಾಂಟಿಸ್',
    tagline: 'ಭಾರತೀಯ ರಿಯಲ್ ಎಸ್ಟೇಟ್‌ಗಾಗಿ ಪ್ಯಾಲಾಂಟಿರ್',
    heading: 'ನಿಮ್ಮ K-RERA ಯೋಜನೆಯ\nಸತ್ಯ ತಿಳಿಯಿರಿ',
    sub: 'ಯಾವುದೇ K-RERA ನೋಂದಾಯಿತ ಯೋಜನೆ ಹುಡುಕಿ. ತಕ್ಷಣ ಅನುಸರಣೆ ಸ್ಥಿತಿ. ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ.',
    placeholder: { project: 'ಯೋಜನೆ ಹೆಸರು ಹುಡುಕಿ...', developer: 'ಡೆವಲಪರ್ ಹೆಸರು ಹುಡುಕಿ...', rera: 'RERA ಸಂಖ್ಯೆ ನಮೂದಿಸಿ...' },
    filterLabels: ['ಯೋಜನೆ', 'ಡೆವಲಪರ್', 'RERA ಸಂಖ್ಯೆ'],
    stats: [
      { value: '8,357', label: 'ಮೇಲ್ವಿಚಾರಣೆ ಯೋಜನೆಗಳು' },
      { value: '891',   label: 'QPR ಡೀಫಾಲ್ಟರ್‌ಗಳು' },
      { value: '234',   label: 'ಮೊಕದ್ದಮೆ ಎಚ್ಚರಿಕೆಗಳು' },
    ],
    langToggle: 'English',
    officerLogin: 'ಅಧಿಕಾರಿ ಲಾಗಿನ್',
    noResults: 'ಯಾವುದೇ ಯೋಜನೆ ಕಂಡುಬಂದಿಲ್ಲ.',
    poweredBy: 'ಒರಿಯಾನೋಡ್ ತಂತ್ರಜ್ಞಾನಗಳಿಂದ ಪ್ರಾಯೋಜಿತ · ಪ್ರತಿ ದಿನ K-RERA ನವೀಕರಣ',
  },
} as const

export type Tx = typeof TRANSLATIONS[Language]

export const filterKeys: FilterType[] = ['project', 'developer', 'rera']

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
