import type { Complaint } from '@/features/govern/types/complaint.types'

export type { Complaint }
export type FilterTab = 'all' | 'filed' | 'hearing_scheduled' | 'order_passed' | 'resolved'

export const COMPLAINTS: Complaint[] = [
  { id: 'CMP-2024-001', project_id: 'ozone-urbana',   project_name: 'Ozone Urbana',   filed_date: '2024-02-14', category: 'Possession Delay',      status: 'PENDING',  description: 'Possession promised by December 2021, still not received. Developer has stopped responding.', amount_at_risk_lakh: 48.5, assigned_officer: 'legal@krera.gov.in',    hearing_date: '2026-05-28' },
  { id: 'CMP-2024-002', project_id: 'ozone-urbana',   project_name: 'Ozone Urbana',   filed_date: '2024-03-22', category: 'Possession Delay',      status: 'PENDING',  description: 'Flat booked in 2018. EMI paid for 6 years. No possession. Builder not reachable.',          amount_at_risk_lakh: 62.0, assigned_officer: 'legal@krera.gov.in',    hearing_date: '2026-05-28' },
  { id: 'CMP-2024-003', project_id: 'ozone-urbana',   project_name: 'Ozone Urbana',   filed_date: '2024-04-10', category: 'Refund Demand',         status: 'PENDING',  description: 'Requesting full refund with interest at 10.85% p.a. as per RERA Section 18.',              amount_at_risk_lakh: 55.0, assigned_officer: 'legal@krera.gov.in',    hearing_date: '2026-06-04' },
  { id: 'CMP-2023-001', project_id: 'ozone-urbana',   project_name: 'Ozone Urbana',   filed_date: '2023-08-15', category: 'Possession Delay',      status: 'RESOLVED', description: 'Possession delay of 3 years. Settled with compensation.',                                  amount_at_risk_lakh: 41.0, assigned_officer: 'legal@krera.gov.in',    hearing_date: null, resolution_date: '2024-01-20', resolution_summary: 'Developer paid compensation of Rs.3.2 lakh. Possession agreement signed.' },
  { id: 'CMP-2025-001', project_id: 'skylark-arcadia', project_name: 'Skylark Arcadia', filed_date: '2025-01-08', category: 'Construction Defects', status: 'PENDING',  description: 'Seepage in flat on 4th floor. Developer not addressing despite multiple complaints.',       amount_at_risk_lakh: 18.5, assigned_officer: 'technical@krera.gov.in', hearing_date: '2026-05-30' },
  { id: 'CMP-2025-002', project_id: 'skylark-arcadia', project_name: 'Skylark Arcadia', filed_date: '2025-03-14', category: 'Possession Delay',      status: 'PENDING',  description: 'Completion date September 2026 now in doubt. No construction progress visible for 2 months.', amount_at_risk_lakh: 22.0, assigned_officer: 'technical@krera.gov.in', hearing_date: '2026-06-11' },
  { id: 'CMP-2023-002', project_id: 'skylark-arcadia', project_name: 'Skylark Arcadia', filed_date: '2023-11-20', category: 'Amenity Deficiency',   status: 'RESOLVED', description: 'Promised clubhouse not constructed as per agreement.',                                       amount_at_risk_lakh: 8.0,  assigned_officer: 'technical@krera.gov.in', hearing_date: null, resolution_date: '2024-04-15', resolution_summary: 'Developer committed to completing clubhouse by December 2026. Affidavit filed.' },
]

export const ANON: Record<string, string> = {
  'CMP-2024-001': 'Homebuyer 001',
  'CMP-2024-002': 'Homebuyer 002',
  'CMP-2024-003': 'Homebuyer 003',
  'CMP-2023-001': 'Homebuyer 004',
  'CMP-2025-001': 'Homebuyer 005',
  'CMP-2025-002': 'Homebuyer 006',
  'CMP-2023-002': 'Homebuyer 007',
}

export const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',               label: 'All' },
  { key: 'filed',             label: 'Filed' },
  { key: 'hearing_scheduled', label: 'Hearing Scheduled' },
  { key: 'order_passed',      label: 'Order Passed' },
  { key: 'resolved',          label: 'Resolved' },
]
