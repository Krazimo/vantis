'use client'
import { cn } from '@/lib/utils'

type Status = string

interface StatusBadgeProps {
  status: Status
  className?: string
}

function dotClass(s: Status) {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}
function textClass(s: Status) {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', textClass(status), className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass(status))} />
      {status}
    </span>
  )
}
