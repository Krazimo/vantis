export interface Component {
  label: string
  value: number
}

export type Developer = {
  id: string
  name: string
  score: number
  components: Component[]
  projects: { id: string; name: string; status: string }[]
  enforcement?: string
}

export const DEVELOPERS: Developer[] = [
  {
    id: 'prestige', name: 'Prestige Group', score: 91,
    components: [
      { label: 'QPR Compliance',        value: 95 },
      { label: 'Escrow Health',         value: 92 },
      { label: 'Litigation Density',    value: 85 },
      { label: 'Completion Rate',       value: 98 },
      { label: 'Complaint Volume',      value: 90 },
      { label: 'Financial Consistency', value: 88 },
    ],
    projects: [{ id: 'prestige-lakeside', name: 'Prestige Lakeside Habitat', status: 'COMPLIANT' }],
  },
  {
    id: 'zion', name: 'Zion Estate Developers', score: 78,
    components: [
      { label: 'QPR Compliance',        value: 88 },
      { label: 'Escrow Health',         value: 75 },
      { label: 'Litigation Density',    value: 78 },
      { label: 'Completion Rate',       value: 85 },
      { label: 'Complaint Volume',      value: 72 },
      { label: 'Financial Consistency', value: 68 },
    ],
    projects: [{ id: 'divya-villas', name: 'Divya Villas', status: 'COMPLIANT' }],
  },
  {
    id: 'skylark', name: 'Skylark Constructions', score: 54,
    components: [
      { label: 'QPR Compliance',        value: 62 },
      { label: 'Escrow Health',         value: 58 },
      { label: 'Litigation Density',    value: 52 },
      { label: 'Completion Rate',       value: 45 },
      { label: 'Complaint Volume',      value: 48 },
      { label: 'Financial Consistency', value: 60 },
    ],
    projects: [{ id: 'skylark-arcadia', name: 'Skylark Arcadia', status: 'CAUTION' }],
  },
  {
    id: 'ozone', name: 'Ozone Group', score: 9,
    enforcement: 'Flagged for enforcement review — penalty notices issued, RRC initiated',
    components: [
      { label: 'QPR Compliance',        value: 8  },
      { label: 'Escrow Health',         value: 5  },
      { label: 'Litigation Density',    value: 3  },
      { label: 'Completion Rate',       value: 12 },
      { label: 'Complaint Volume',      value: 10 },
      { label: 'Financial Consistency', value: 18 },
    ],
    projects: [{ id: 'ozone-urbana', name: 'Ozone Urbana', status: 'HIGH RISK' }],
  },
]

export function scoreColor(s: number): string {
  if (s >= 70) return 'text-status-compliant'
  if (s >= 45) return 'text-status-caution'
  return 'text-status-risk'
}

export function scoreBorder(s: number): string {
  if (s >= 70) return 'border-status-compliant/20'
  if (s >= 45) return 'border-status-caution/20'
  return 'border-status-risk/30'
}

export function barColor(v: number): string {
  if (v >= 70) return 'bg-status-compliant'
  if (v >= 45) return 'bg-status-caution'
  return 'bg-status-risk'
}

export function statusColor(s: string): string {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}

export function statusDot(s: string): string {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}
