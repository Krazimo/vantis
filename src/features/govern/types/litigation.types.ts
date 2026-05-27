export interface LitigationItem {
  id: string
  project_id: string
  project_name: string
  developer_name: string
  type: string
  court: string
  case_number: string
  filed_date: string
  filed?: string
  plaintiff: string
  cause?: string
  relief_sought_crore?: number | null
  status: string
  next_hearing: string
  severity: string
  survey_numbers?: string[]
}
