export interface QPREntry {
  status: string
  filed_date: string | null
  completion_pct: number | null
}

export interface QPRRow {
  quarter: string
  entry: QPREntry
}
