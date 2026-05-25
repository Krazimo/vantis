import projectsData from '@/data/projects.json'

export type Language = 'en' | 'kn'
export type Step = 1 | 2 | 3 | 'success'

export interface Project { id: string; name: string; developer_name: string; location: string }
export const PROJECTS = projectsData as Project[]

export const NATURES = [
  { key: 'possession_delay', en: 'Possession Delay',        kn: 'ಸ್ವಾಧೀನ ವಿಳಂಬ' },
  { key: 'construction',     en: 'Construction Quality',    kn: 'ನಿರ್ಮಾಣ ಗುಣಮಟ್ಟ' },
  { key: 'refund',           en: 'Refund Not Received',     kn: 'ಮರುಪಾವತಿ ಬಾಕಿ' },
  { key: 'false_info',       en: 'False Information',       kn: 'ತಪ್ಪು ಮಾಹಿತಿ' },
  { key: 'amenities',        en: 'Amenities Not Delivered', kn: 'ಸೌಲಭ್ಯ ಒದಗಿಸಿಲ್ಲ' },
  { key: 'other',            en: 'Other',                   kn: 'ಇತರ' },
] as const

export const TX = {
  en: {
    title: 'File a Complaint', sub: 'K-RERA Complaint Registration',
    step1: 'Your Details', step2: 'Project & Issue', step3: 'Complaint Details',
    name: 'Full Name', phone: 'Phone Number', email: 'Email Address',
    next: 'Next →', back: '← Back', submit: 'Submit Complaint',
    searchProject: 'Search project name…', nature: 'Nature of Complaint',
    complaintText: 'Describe your complaint', charCount: 'characters',
    minChars: 'Minimum 50 characters required',
    photoUpload: 'Upload supporting documents (optional)',
    photoDrag: 'Drag & drop files here or click to browse', photoSub: 'PDF, JPG, PNG — max 5MB each',
    successTitle: 'Complaint Filed Successfully', successSub: 'Your complaint has been registered with K-RERA.',
    refLabel: 'Reference Number', whatsapp: 'WhatsApp Confirmation Preview', trackBtn: 'Track Your Complaint',
    phoneErr: 'Enter a valid 10-digit phone number', emailErr: 'Enter a valid email address',
    nameErr: 'Name is required', projectErr: 'Select a project', natureErr: 'Select nature of complaint',
    langToggle: 'ಕನ್ನಡ',
  },
  kn: {
    title: 'ದೂರು ಸಲ್ಲಿಸಿ', sub: 'K-RERA ದೂರು ನೋಂದಣಿ',
    step1: 'ನಿಮ್ಮ ವಿವರ', step2: 'ಯೋಜನೆ ಮತ್ತು ಸಮಸ್ಯೆ', step3: 'ದೂರಿನ ವಿವರ',
    name: 'ಪೂರ್ಣ ಹೆಸರು', phone: 'ಫೋನ್ ಸಂಖ್ಯೆ', email: 'ಇಮೇಲ್ ವಿಳಾಸ',
    next: 'ಮುಂದೆ →', back: '← ಹಿಂದೆ', submit: 'ದೂರು ಸಲ್ಲಿಸಿ',
    searchProject: 'ಯೋಜನೆ ಹೆಸರು ಹುಡುಕಿ…', nature: 'ದೂರಿನ ಸ್ವರೂಪ',
    complaintText: 'ನಿಮ್ಮ ದೂರನ್ನು ವಿವರಿಸಿ', charCount: 'ಅಕ್ಷರಗಳು',
    minChars: 'ಕನಿಷ್ಠ 50 ಅಕ್ಷರಗಳು ಬೇಕು',
    photoUpload: 'ಸಹಾಯಕ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಐಚ್ಛಿಕ)',
    photoDrag: 'ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ', photoSub: 'PDF, JPG, PNG — ಗರಿಷ್ಠ 5MB',
    successTitle: 'ದೂರು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ', successSub: 'ನಿಮ್ಮ ದೂರನ್ನು K-RERA ನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.',
    refLabel: 'ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ', whatsapp: 'WhatsApp ದೃಢೀಕರಣ ಪೂರ್ವವೀಕ್ಷಣೆ', trackBtn: 'ನಿಮ್ಮ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
    phoneErr: '10-ಅಂಕಿ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ', emailErr: 'ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ',
    nameErr: 'ಹೆಸರು ಅಗತ್ಯ', projectErr: 'ಯೋಜನೆ ಆಯ್ಕೆ ಮಾಡಿ', natureErr: 'ದೂರಿನ ಸ್ವರೂಪ ಆಯ್ಕೆ ಮಾಡಿ',
    langToggle: 'English',
  },
} as const

export type Tx = typeof TX[Language]

export function generateRef(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `VG-2026-${n}`
}
