export type { Project } from '@/features/govern/types/project.types'
export type { Developer } from '@/features/govern/types/developer.types'
export type { LitigationItem } from '@/features/govern/types/litigation.types'
export type { QPREntry, QPRRow } from '@/features/govern/types/qpr.types'

export interface EscrowData {
  balance_crore: number
  collected_crore: number
  pct: number
  status: 'HEALTHY' | 'CAUTION' | 'CRITICAL'
  last_withdrawal: string
  note: string
}
