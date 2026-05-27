import Link from 'next/link'
import { AlertTriangle, BarChart2, Scale, ChevronRight } from 'lucide-react'
import type { Project } from '@/features/govern/types/project.types'
import type { LitigationItem } from '@/features/govern/types/litigation.types'

interface Props {
  criticalProjects: Project[]
  qprDefaulters: Project[]
  activeLitigation: LitigationItem[]
}

export default function LiveFeeds({ criticalProjects, qprDefaulters, activeLitigation }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-4">Live Feeds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-status-risk" />
              <span className="text-sm text-foreground">Critical Alerts</span>
            </div>
            <span className="text-xs text-status-risk bg-status-risk/10 border border-status-risk/20 px-2 py-0.5 rounded-sm">{criticalProjects.length}</span>
          </div>
          <div className="space-y-2.5">
            {criticalProjects.map(p => (
              <Link key={p.id} href={`/govern/projects/${p.id}`} className="block group">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors duration-150 truncate">{p.name}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{p.complaints_pending} complaints pending</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-status-caution" />
              <span className="text-sm text-foreground">QPR Defaults</span>
            </div>
            <span className="text-xs text-status-caution bg-status-caution/10 border border-status-caution/20 px-2 py-0.5 rounded-sm">{qprDefaulters.length}</span>
          </div>
          <div className="space-y-2.5">
            {qprDefaulters.map(p => (
              <Link key={p.id} href={`/govern/projects/${p.id}`} className="block group">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground group-hover:text-primary transition-colors duration-150 truncate">{p.name}</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">Q1 2026 — Missed</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-status-risk" />
              <span className="text-sm text-foreground">Active Litigation</span>
            </div>
            <span className="text-xs text-status-risk bg-status-risk/10 border border-status-risk/20 px-2 py-0.5 rounded-sm">{activeLitigation.length}</span>
          </div>
          <div className="space-y-2.5">
            {activeLitigation.map(l => (
              <div key={l.id}>
                <div className="text-xs text-foreground truncate">{l.project_name}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{l.type} · {l.court.split(' ').slice(0, 3).join(' ')}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
