export interface HomebuyerRow {
  project_id: string
  project_name: string
  developer: string
  status: string
  homebuyers: number
  capital_crore: number
  possession_status: string
  tier: 'CRITICAL' | 'WATCH' | 'CLEAR'
}

export const ROWS: HomebuyerRow[] = [
  { project_id: 'ozone-urbana',     project_name: 'Ozone Urbana',             developer: 'Ozone Group',            status: 'HIGH RISK',  homebuyers: 1847, capital_crore: 927,  possession_status: 'Overdue 4+ years — possession not given', tier: 'CRITICAL' },
  { project_id: 'skylark-arcadia',  project_name: 'Skylark Arcadia',           developer: 'Skylark Constructions',  status: 'CAUTION',    homebuyers: 98,   capital_crore: 18.4, possession_status: 'Due Sep 2026 — 4 months', tier: 'WATCH' },
  { project_id: 'prestige-lakeside',project_name: 'Prestige Lakeside Habitat', developer: 'Prestige Group',         status: 'COMPLIANT',  homebuyers: 312,  capital_crore: 189,  possession_status: 'Due Jun 2027 — on track', tier: 'CLEAR' },
  { project_id: 'divya-villas',     project_name: 'Divya Villas',              developer: 'Zion Estate Developers', status: 'COMPLIANT',  homebuyers: 18,   capital_crore: 2.4,  possession_status: 'Handover phase · 96% complete', tier: 'CLEAR' },
]

export function tierConfig(t: string) {
  if (t === 'CRITICAL') return { textColor: 'text-red',   dotBg: 'bg-red',   label: 'CRITICAL', row: 'bg-red/5' }
  if (t === 'WATCH')    return { textColor: 'text-amber', dotBg: 'bg-amber', label: 'WATCH',    row: 'bg-amber/5' }
  return                       { textColor: 'text-green', dotBg: 'bg-green', label: 'CLEAR',    row: '' }
}

export function statusColor(s: string): string {
  if (s === 'COMPLIANT') return 'text-green'
  if (s === 'CAUTION')   return 'text-amber'
  return 'text-red'
}

export function statusDot(s: string): string {
  if (s === 'COMPLIANT') return 'bg-green'
  if (s === 'CAUTION')   return 'bg-amber'
  return 'bg-red'
}
