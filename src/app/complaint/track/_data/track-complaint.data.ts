import complaintsData from '@/data/complaints.json'
import type { Complaint } from '@/features/govern/types/complaint.types'
import type { Language } from '@/features/shared/types/i18n.types'

export type { Complaint, Language }

export const COMPLAINTS = complaintsData as Complaint[]

export type TrackStep = 'filed' | 'acknowledged' | 'notice_issued' | 'hearing_scheduled' | 'order_passed' | 'resolved'

export const ALL_STEPS: { key: TrackStep; en: string; kn: string }[] = [
  { key: 'filed',             en: 'Filed',         kn: 'ದಾಖಲು' },
  { key: 'acknowledged',      en: 'Acknowledged',  kn: 'ದೃಢೀಕರಣ' },
  { key: 'notice_issued',     en: 'Notice Issued', kn: 'ನೋಟೀಸ್' },
  { key: 'hearing_scheduled', en: 'Hearing',       kn: 'ವಿಚಾರಣೆ' },
  { key: 'order_passed',      en: 'Order Passed',  kn: 'ಆದೇಶ' },
  { key: 'resolved',          en: 'Resolved',      kn: 'ಇತ್ಯರ್ಥ' },
]

export const TX = {
  en: {
    title: 'Track Complaint', sub: 'Enter your reference number or registered phone',
    placeholder: 'VG-2026-XXXXXX or CMP-2024-001', search: 'Track',
    notFound: 'No complaint found with this reference.',
    notFoundSub: 'Contact K-RERA helpline: 1800-425-9297 (Toll Free)\nEmail: helpdesk-rera@karnataka.gov.in',
    ref: 'Reference Number', project: 'Project', category: 'Nature', filed: 'Filed On',
    hearing: 'Next Hearing', resolved: 'Resolved On', amount: 'Amount at Risk',
    officer: 'Assigned Officer', progress: 'Case Progress', nextStep: 'Next Step',
    langToggle: 'ಕನ್ನಡ', timeline: 'Timeline',
    enterRef: 'Enter your complaint reference number above', example: 'Example: CMP-2024-001',
    resolution: 'Resolution',
  },
  kn: {
    title: 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', sub: 'ನಿಮ್ಮ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಅಥವಾ ನೋಂದಾಯಿತ ಫೋನ್ ನಮೂದಿಸಿ',
    placeholder: 'VG-2026-XXXXXX ಅಥವಾ CMP-2024-001', search: 'ಹುಡುಕಿ',
    notFound: 'ಈ ಉಲ್ಲೇಖದೊಂದಿಗೆ ಯಾವುದೇ ದೂರು ಕಂಡುಬಂದಿಲ್ಲ.',
    notFoundSub: 'K-RERA ಸಹಾಯವಾಣಿ: 1800-425-9297 (ಟೋಲ್ ಫ್ರೀ)\nಇಮೇಲ್: helpdesk-rera@karnataka.gov.in',
    ref: 'ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ', project: 'ಯೋಜನೆ', category: 'ಸ್ವರೂಪ', filed: 'ದಾಖಲಾದ ದಿನಾಂಕ',
    hearing: 'ಮುಂದಿನ ವಿಚಾರಣೆ', resolved: 'ಇತ್ಯರ್ಥ ದಿನಾಂಕ', amount: 'ರಿಸ್ಕ್‌ನಲ್ಲಿ ಮೊತ್ತ',
    officer: 'ನಿಯೋಜಿತ ಅಧಿಕಾರಿ', progress: 'ಪ್ರಕರಣ ಪ್ರಗತಿ', nextStep: 'ಮುಂದಿನ ಹೆಜ್ಜೆ',
    langToggle: 'English', timeline: 'ಟೈಮ್‌ಲೈನ್',
    enterRef: 'ಮೇಲೆ ನಿಮ್ಮ ದೂರಿನ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ', example: 'ಉದಾಹರಣೆ: CMP-2024-001',
    resolution: 'ನಿರ್ಣಯ',
  },
} as const

export type Tx = typeof TX[Language]

export const NEXT_STEPS: Record<TrackStep, { en: string; kn: string }> = {
  filed:             { en: 'Your complaint is being reviewed. You will be notified within 5 working days.', kn: 'ನಿಮ್ಮ ದೂರನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ. 5 ಕೆಲಸದ ದಿನಗಳಲ್ಲಿ ನಿಮಗೆ ತಿಳಿಸಲಾಗುತ್ತದೆ.' },
  acknowledged:      { en: 'K-RERA has acknowledged your complaint and is preparing a show-cause notice.', kn: 'K-RERA ನಿಮ್ಮ ದೂರನ್ನು ದೃಢೀಕರಿಸಿದ್ದು ನೋಟೀಸ್ ತಯಾರಿಸುತ್ತಿದೆ.' },
  notice_issued:     { en: 'A show-cause notice has been issued to the developer. Awaiting their response.', kn: 'ಡೆವಲಪರ್‌ಗೆ ನೋಟೀಸ್ ನೀಡಲಾಗಿದೆ. ಅವರ ಪ್ರತಿಕ್ರಿಯೆ ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ.' },
  hearing_scheduled: { en: 'A hearing has been scheduled. Both parties will be heard before an order is passed.', kn: 'ವಿಚಾರಣೆ ನಿಗದಿ ಆಗಿದೆ. ಆದೇಶ ಮೊದಲು ಎರಡೂ ಕಡೆಗಳನ್ನು ಕೇಳಲಾಗುತ್ತದೆ.' },
  order_passed:      { en: 'An order has been passed. If the developer fails to comply, enforcement proceedings will begin.', kn: 'ಆದೇಶ ನೀಡಲಾಗಿದೆ. ಡೆವಲಪರ್ ಅನುಸರಿಸದಿದ್ದಲ್ಲಿ ಜಾರ� ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗುತ್ತದೆ.' },
  resolved:          { en: 'Your complaint has been resolved. Check the resolution summary below.', kn: 'ನಿಮ್ಮ ದೂರು ಇತ್ಯರ್ಥವಾಗಿದೆ. ಕೆಳಗೆ ನಿರ್ಣಯ ಸಾರಾಂಶ ನೋಡಿ.' },
}

export function getActiveStep(c: Complaint): TrackStep {
  if (c.status === 'RESOLVED') return 'resolved'
  if (c.hearing_date) return 'hearing_scheduled'
  return 'notice_issued'
}

export function getStepIndex(key: TrackStep): number {
  return ALL_STEPS.findIndex(s => s.key === key)
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function buildTimeline(c: Complaint, lang: Language): { date: string; label: string }[] {
  const events = [{ date: fmtDate(c.filed_date), label: lang === 'en' ? 'Complaint filed' : 'ದೂರು ದಾಖಲಾಗಿದೆ' }]
  if (c.hearing_date) {
    events.push({ date: fmtDate(c.filed_date), label: lang === 'en' ? 'Show-cause notice issued' : 'ನೋಟೀಸ್ ನೀಡಲಾಗಿದೆ' })
    events.push({ date: fmtDate(c.hearing_date), label: lang === 'en' ? 'Hearing scheduled' : 'ವಿಚಾರಣೆ ನಿಗದಿ' })
  }
  if (c.resolution_date) {
    events.push({ date: fmtDate(c.resolution_date), label: lang === 'en' ? 'Complaint resolved' : 'ದೂರು ಇತ್ಯರ್ಥ' })
  }
  return events.reverse()
}
