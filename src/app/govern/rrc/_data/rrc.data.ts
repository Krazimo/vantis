export type RRCStatus = 'ISSUED' | 'ACKNOWLEDGED' | 'IN_RECOVERY' | 'RECOVERED'

export interface RRCCard {
  id: string
  project_id: string
  project_name: string
  developer: string
  amount_lakh: number
  issued_date: string
  status: RRCStatus
  progress_pct: number
  recovered_lakh: number
  alert?: string
  linked_notice: string
}

export const RRCS: RRCCard[] = [
  { id: 'RRC-2026-001', project_id: 'ozone-urbana',    project_name: 'Ozone Urbana',    developer: 'Ozone Group',           amount_lakh: 45.75, issued_date: '2026-04-11', status: 'ISSUED',       progress_pct: 0,   recovered_lakh: 0,    alert: 'Unacknowledged — 32 days', linked_notice: 'KRERA/SCN/2026/0047' },
  { id: 'RRC-2026-002', project_id: 'skylark-arcadia', project_name: 'Skylark Arcadia', developer: 'Skylark Constructions', amount_lakh: 2.25,  issued_date: '2026-04-22', status: 'ACKNOWLEDGED', progress_pct: 0,   recovered_lakh: 0,    linked_notice: 'KRERA/SCN/2026/0051' },
  { id: 'RRC-2024-003', project_id: 'ozone-urbana',    project_name: 'Ozone Urbana',    developer: 'Ozone Group',           amount_lakh: 0.20,  issued_date: '2024-11-08', status: 'RECOVERED',    progress_pct: 100, recovered_lakh: 0.20, linked_notice: 'KRERA/SCN/2024/0198' },
]

export const STATUS_CONFIG: Record<RRCStatus, { label: string; textColor: string; dotBg: string; bar: string }> = {
  ISSUED:       { label: 'Issued',       textColor: 'text-gray-light', dotBg: 'bg-gray',  bar: 'bg-gray'  },
  ACKNOWLEDGED: { label: 'Acknowledged', textColor: 'text-blue',       dotBg: 'bg-blue',  bar: 'bg-blue'  },
  IN_RECOVERY:  { label: 'In Recovery',  textColor: 'text-amber',      dotBg: 'bg-amber', bar: 'bg-amber' },
  RECOVERED:    { label: 'Recovered',    textColor: 'text-green',      dotBg: 'bg-green', bar: 'bg-green' },
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
