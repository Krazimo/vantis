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
      <h2 className="font-mono text-[10px] text-gray uppercase tracking-[0.15em] mb-4">Live Feeds</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-surface border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red" />
              <span className="font-syne text-sm text-off-white">Critical Alerts</span>
            </div>
            <span className="text-xs font-mono text-red bg-red/10 border border-red/20 px-2 py-0.5 rounded-sm">{criticalProjects.length}</span>
          </div>
          <div className="space-y-2.5">
            {criticalProjects.map(p => (
              <Link key={p.id} href={`/govern/projects/${p.id}`} className="block group">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-off-white group-hover:text-gold transition-colors duration-150 truncate">{p.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray shrink-0" />
                </div>
                <div className="text-gray text-xs mt-0.5">{p.complaints_pending} complaints pending</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber" />
              <span className="font-syne text-sm text-off-white">QPR Defaults</span>
            </div>
            <span className="text-xs font-mono text-amber bg-amber/10 border border-amber/20 px-2 py-0.5 rounded-sm">{qprDefaulters.length}</span>
          </div>
          <div className="space-y-2.5">
            {qprDefaulters.map(p => (
              <Link key={p.id} href={`/govern/projects/${p.id}`} className="block group">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-off-white group-hover:text-gold transition-colors duration-150 truncate">{p.name}</span>
                  <ChevronRight className="w-3 h-3 text-gray shrink-0" />
                </div>
                <div className="text-gray text-xs mt-0.5">Q1 2026 — Missed</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-red" />
              <span className="font-syne text-sm text-off-white">Active Litigation</span>
            </div>
            <span className="text-xs font-mono text-red bg-red/10 border border-red/20 px-2 py-0.5 rounded-sm">{activeLitigation.length}</span>
          </div>
          <div className="space-y-2.5">
            {activeLitigation.map(l => (
              <div key={l.id}>
                <div className="text-xs text-off-white truncate">{l.project_name}</div>
                <div className="text-gray text-xs mt-0.5">{l.type} · {l.court.split(' ').slice(0, 3).join(' ')}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
