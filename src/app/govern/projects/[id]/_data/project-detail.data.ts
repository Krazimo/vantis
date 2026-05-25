import { Building2, FileText, TrendingDown, Scale, AlertTriangle, Settings, FolderOpen } from 'lucide-react'
import type { EscrowData } from './project-detail.types'

export const ESCROW: Record<string, EscrowData> = {
  'ozone-urbana':      { balance_crore: 3.88,  collected_crore: 48.5,  pct: 8,  status: 'CRITICAL', last_withdrawal: '2022-09-14', note: 'Escrow nearly depleted. Last withdrawal Sep 2022. Construction halted.' },
  'prestige-lakeside': { balance_crore: 48.3,  collected_crore: 210.0, pct: 23, status: 'HEALTHY',  last_withdrawal: '2026-03-20', note: 'Balance healthy. Withdrawals aligned with construction milestones.' },
  'divya-villas':      { balance_crore: 0.98,  collected_crore: 2.4,   pct: 41, status: 'HEALTHY',  last_withdrawal: '2026-02-15', note: 'Balance healthy. Project near completion.' },
  'skylark-arcadia':   { balance_crore: 8.68,  collected_crore: 62.0,  pct: 14, status: 'CAUTION',  last_withdrawal: '2025-12-10', note: 'Below recommended 20% floor. Requires monitoring.' },
}

export const ESCROW_STATUS_CLASS: Record<string, string> = {
  HEALTHY:  'text-green bg-green/10 border-green/30',
  CAUTION:  'text-amber bg-amber/10 border-amber/30',
  CRITICAL: 'text-red bg-red/10 border-red/30',
}

export const TABS = [
  { id: 'overview',   label: 'Overview',      icon: Building2 },
  { id: 'qpr',        label: 'QPR History',   icon: FileText },
  { id: 'financial',  label: 'Financial',     icon: TrendingDown },
  { id: 'litigation', label: 'Litigation',    icon: Scale },
  { id: 'timeline',   label: 'Risk Timeline', icon: AlertTriangle },
  { id: 'actions',    label: 'Actions',       icon: Settings },
  { id: 'documents',  label: 'Documents',     icon: FolderOpen },
]
