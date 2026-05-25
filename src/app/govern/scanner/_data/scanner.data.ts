export interface VerificationBlock {
  label: string
  source: string
  checked: string
  result: 'PASS' | 'WARNING' | 'FAIL'
  finding: string
}

export interface Application {
  id: string
  project_name: string
  developer: string
  submitted_date: string
  rera_type: string
  units: number
  survey_numbers: string[]
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  risk_score: number
  verifications: VerificationBlock[]
}

export const APPLICATIONS: Application[] = [
  {
    id: 'APP-2026-0034', project_name: 'Sunrise Heights Phase 2', developer: 'Sunrise Constructions Pvt Ltd',
    submitted_date: '2026-05-08', rera_type: 'Apartment', units: 120, survey_numbers: ['48/1', '48/2', '49/3'],
    risk: 'LOW', risk_score: 87,
    verifications: [
      { label: 'Title Verification',    source: 'Kaveri 2.0',    checked: 'Encumbrances, ownership chain, mortgage records', result: 'PASS', finding: 'All 3 survey parcels have clear title. No encumbrances detected.' },
      { label: 'Land Area Verification', source: 'Bhoomi',        checked: 'Survey extent, RTC records, area match',          result: 'PASS', finding: 'Declared area 2.48 acres matches Bhoomi records within 0.3%.' },
      { label: 'Litigation Check',       source: 'eCourts',       checked: 'Active cases, injunctions, stay orders',          result: 'PASS', finding: 'No active litigation found. No injunctions or stay orders on record.' },
      { label: 'FAR & Zoning',           source: 'BBMP/BDA',      checked: 'FSI limits, zoning classification, OC status',    result: 'PASS', finding: 'FSI 2.5 fully compliant with BBMP Revised Master Plan 2015.' },
      { label: 'Financial Consistency',  source: 'Internal/RERA', checked: 'Declared cost, sales projections, escrow plan',   result: 'PASS', finding: 'Declared cost ₹42 Cr consistent with unit pricing and market comparables.' },
    ],
  },
  {
    id: 'APP-2026-0031', project_name: 'Greenfield Verdant Residences', developer: 'Greenfield Developers',
    submitted_date: '2026-05-05', rera_type: 'Apartment', units: 240, survey_numbers: ['218/4A'],
    risk: 'MEDIUM', risk_score: 61,
    verifications: [
      { label: 'Title Verification',    source: 'Kaveri 2.0',    checked: 'Encumbrances, ownership chain, mortgage records', result: 'PASS',    finding: 'Survey No. 218/4A has clear title. Ownership chain verified back 30 years.' },
      { label: 'Land Area Verification', source: 'Bhoomi',        checked: 'Survey extent, RTC records, area match',          result: 'WARNING', finding: 'Declared area 1.82 acres; Bhoomi records show 1.71 acres. Discrepancy 6.1% — clarification required.' },
      { label: 'Litigation Check',       source: 'eCourts',       checked: 'Active cases, injunctions, stay orders',          result: 'PASS',    finding: 'No active litigation. No encumbrance or dispute on record.' },
      { label: 'FAR & Zoning',           source: 'BBMP/BDA',      checked: 'FSI limits, zoning classification, OC status',    result: 'WARNING', finding: 'FSI 2.75 marginally exceeds permissible 2.5 under current zoning. BDA variance not on file.' },
      { label: 'Financial Consistency',  source: 'Internal/RERA', checked: 'Declared cost, sales projections, escrow plan',   result: 'PASS',    finding: 'Declared cost ₹89 Cr broadly consistent with market comparables for this location.' },
    ],
  },
  {
    id: 'APP-2026-0028', project_name: 'Kaveri Riverside Towers', developer: 'Shambhavi Constructions',
    submitted_date: '2026-04-29', rera_type: 'Apartment', units: 380, survey_numbers: ['142/3B', '142/4', '143/1'],
    risk: 'HIGH', risk_score: 22,
    verifications: [
      { label: 'Title Verification',    source: 'Kaveri 2.0',    checked: 'Encumbrances, ownership chain, mortgage records', result: 'FAIL',    finding: 'Undisclosed mortgage of ₹4.2 Cr on Survey No. 142/3B. Developer did not disclose encumbrance in application.' },
      { label: 'Land Area Verification', source: 'Bhoomi',        checked: 'Survey extent, RTC records, area match',          result: 'FAIL',    finding: 'Declared area 3.4 acres; Bhoomi records show 2.79 acres. Discrepancy 18% — possible illegal layout conversion.' },
      { label: 'Litigation Check',       source: 'eCourts',       checked: 'Active cases, injunctions, stay orders',          result: 'WARNING', finding: 'OS 4421/2024 filed by adjacent landowner regarding boundary encroachment. Pending hearing.' },
      { label: 'FAR & Zoning',           source: 'BBMP/BDA',      checked: 'FSI limits, zoning classification, OC status',    result: 'PASS',    finding: 'FSI 2.25 within permissible limits under current zoning.' },
      { label: 'Financial Consistency',  source: 'Internal/RERA', checked: 'Declared cost, sales projections, escrow plan',   result: 'PASS',    finding: 'Declared cost ₹127 Cr within acceptable range for this scale and location.' },
    ],
  },
]

export const CERT_ID = 'VG-2026-007934-0004'

export const CERT_VERIFICATIONS = [
  { label: 'Title Verification',    source: 'Kaveri 2.0' },
  { label: 'Land Area Verification', source: 'Bhoomi' },
  { label: 'Litigation Check',       source: 'eCourts' },
  { label: 'FAR and Zoning',         source: 'BBMP/BDA' },
  { label: 'Financial Consistency',  source: 'Internal' },
]
