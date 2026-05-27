export interface Complaint {
  id: string
  project_id?: string
  project_name?: string
  developer_name?: string
  complainant_name?: string
  category: string
  status: string
  filed_date: string
  hearing_date?: string | null
  resolution_date?: string | null
  resolution_summary?: string | null
  description?: string
  amount_at_risk_lakh?: number
  assigned_officer?: string
  ref?: string
  steps?: Array<{ key: string; label: string; date?: string }>
}
