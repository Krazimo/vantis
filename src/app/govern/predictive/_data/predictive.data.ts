export interface PredictiveRow {
  rank: number
  project_id: string
  project_name: string
  developer: string
  risk_score: number
  default_probability: number
  signals: string[]
  action: 'ENFORCE' | 'MONITOR' | 'NO_ACTION'
}

export const ROWS: PredictiveRow[] = [
  {
    rank: 1, project_id: 'ozone-urbana', project_name: 'Ozone Urbana', developer: 'Ozone Group',
    risk_score: 9, default_probability: 97, action: 'ENFORCE',
    signals: [
      'Complete QPR default — 8 consecutive quarters missed',
      '1,847 homebuyers affected · ₹927 Cr capital at risk',
      'FIR filed Q3 2023 · High Court writ pending',
    ],
  },
  {
    rank: 2, project_id: 'skylark-arcadia', project_name: 'Skylark Arcadia', developer: 'Skylark Constructions',
    risk_score: 54, default_probability: 34, action: 'MONITOR',
    signals: [
      'Q1 2026 QPR missed · Q4 2025 filed 30 days late',
      'Escrow balance 14% — below recommended 20% floor',
      '1 civil case OS 3891/2024 — structural defect claim',
    ],
  },
  {
    rank: 3, project_id: 'prestige-lakeside', project_name: 'Prestige Lakeside Habitat', developer: 'Prestige Group',
    risk_score: 91, default_probability: 3, action: 'NO_ACTION',
    signals: [
      'All 8 QPRs filed on time — no defaults',
      'Escrow balance healthy at 23%',
      'No active litigation · Full certificate issued',
    ],
  },
  {
    rank: 4, project_id: 'divya-villas', project_name: 'Divya Villas', developer: 'Zion Estate Developers',
    risk_score: 78, default_probability: 2, action: 'NO_ACTION',
    signals: [
      'All QPRs filed on time · 96% construction complete',
      'No complaints or litigation on record',
      'Project on track for March 2026 handover',
    ],
  },
]

export function actionConfig(a: string) {
  if (a === 'ENFORCE') return { label: 'Enforce',   textColor: 'text-red',   dotBg: 'bg-red' }
  if (a === 'MONITOR') return { label: 'Monitor',   textColor: 'text-amber', dotBg: 'bg-amber' }
  return                      { label: 'No Action', textColor: 'text-green', dotBg: 'bg-green' }
}

export function probColor(p: number): string {
  if (p >= 70) return 'text-red'
  if (p >= 30) return 'text-amber'
  return 'text-green'
}

export function probBarColor(p: number): string {
  if (p >= 70) return 'bg-red'
  if (p >= 30) return 'bg-amber'
  return 'bg-green'
}

export function riskScoreColor(s: number): string {
  if (s >= 70) return 'text-green'
  if (s >= 40) return 'text-amber'
  return 'text-red'
}
