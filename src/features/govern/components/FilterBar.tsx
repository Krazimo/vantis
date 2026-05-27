import { cn } from '@/lib/utils'

interface FilterBarProps {
  tabs: Array<{ key: string; label: string; count?: number }>
  active: string
  onChange: (key: string) => void
  className?: string
}

export function FilterBar({ tabs, active, onChange, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150',
            active === tab.key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/60'
          )}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 opacity-60">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}
