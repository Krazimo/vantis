import ozoneData from '@/data/ozone-urbana.json'

export interface TimelinePoint {
  quarter: string
  score: number
  status: string
  default_probability: number
  signals: string[]
  action: string
}

export const TIMELINE = ozoneData.risk_timeline as TimelinePoint[]
export { ozoneData }
