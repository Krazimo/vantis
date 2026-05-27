import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, icon, children }: PageShellProps) {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
        </div>
        {icon}
      </div>
      {children}
    </div>
  )
}
