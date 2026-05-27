export interface Project {
  id: string
  name: string
  rera: string
  developer_id?: string
  developer_name: string
  location: string
  survey_numbers: string[]
  type: string
  total_units: number
  units_sold: number
  declared_cost_crore: number
  completion_date: string
  registration_date: string
  registration_valid_until: string
  extensions: number
  status: string
  risk_score: number
  certificate_id?: string | null
  certificate_status: string
  complaints_pending: number
  complaints_resolved: number
  qpr?: Record<string, { status: string; filed_date: string | null; completion_pct: number | null }>
  litigation: Array<{ type: string; court: string; filed: string; status: string }>
  escrow_pct?: number
}
