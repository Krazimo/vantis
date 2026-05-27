export interface Developer {
  id: string
  name: string
  city: string
  state: string
  trust_score: number
  total_projects: number
  active_projects: number
  completed_projects: number
  total_units?: number
  years_active: number
  contact_email: string
  contact_phone: string
  status: string
  qpr_compliance?: number
  complaint_density?: number
  completion_rate?: number
  projects?: Array<{ id: string; name: string; status: string; risk_score: number }>
}
