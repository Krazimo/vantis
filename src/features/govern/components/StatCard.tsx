import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon?: LucideIcon
  valueColor?: string
  className?: string
}

export function StatCard({ label, value, sub, icon: Icon, valueColor = 'text-primary', className }: StatCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-sm p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-xs leading-tight">{label}</span>
        {Icon && <Icon className={cn('w-4 h-4 shrink-0', valueColor)} />}
      </div>
      <div className={cn('text-2xl sm:text-3xl font-bold', valueColor)}>{value}</div>
      {sub && <div className="text-muted-foreground text-xs mt-1">{sub}</div>}
    </div>
  )
}
