export interface Project {
  id: string; name: string; rera: string; developer_id: string; developer_name: string
  location: string; survey_numbers: string[]; type: string; total_units: number
  units_sold: number; declared_cost_crore: number; completion_date: string
  registration_date: string; registration_valid_until: string; extensions: number
  status: string; risk_score: number; certificate_id: string | null
  certificate_status: string; complaints_pending: number; complaints_resolved: number
  litigation: Array<{ type: string; court: string; filed: string; status: string }>
}

export interface Developer {
  id: string; name: string; city: string; state: string; trust_score: number
  total_projects: number; active_projects: number; completed_projects: number
  years_active: number; contact_email: string; contact_phone: string; status: string
}

export interface LitigationItem {
  id: string; project_id: string; type: string; court: string; case_number: string
  filed_date: string; plaintiff: string; cause: string; relief_sought_crore: number | null
  status: string; next_hearing: string; severity: string
}

export interface QPREntry {
  status: string
  filed_date: string | null
  completion_pct: number | null
}

export interface QPRRow {
  quarter: string
  entry: QPREntry
}

export interface EscrowData {
  balance_crore: number
  collected_crore: number
  pct: number
  status: 'HEALTHY' | 'CAUTION' | 'CRITICAL'
  last_withdrawal: string
  note: string
}
