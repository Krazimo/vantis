'use client'

import { useState } from 'react'
import { AlertTriangle, BarChart2, Building2, Scale, Users } from 'lucide-react'
import KarnatakaMap from '@/features/shared/components/KarnatakaMap'
import projectsData from '@/data/projects.json'
import litigationData from '@/data/litigation.json'
import qprData from '@/data/qpr.json'
import DistrictPanel from './_components/DistrictPanel'
import LiveFeeds from './_components/LiveFeeds'
import { StatCard } from '@/features/govern/components/StatCard'
import { PageShell } from '@/features/govern/components/PageShell'
import type { Project } from '@/features/govern/types/project.types'
import type { LitigationItem } from '@/features/govern/types/litigation.types'

interface District { id: string; label: string; risk: string; projects: string[] }

const KPIs = [
  { label: 'Total Projects',      value: '8,357', icon: Building2,     color: 'text-primary',        sub: 'K-RERA registered' },
  { label: 'Distressed Projects', value: '234',   icon: AlertTriangle, color: 'text-status-risk',    sub: 'High risk flagged' },
  { label: 'QPR Defaulters',      value: '891',   icon: BarChart2,     color: 'text-status-caution', sub: 'Missed this quarter' },
  { label: 'Litigation Alerts',   value: '47',    icon: Scale,         color: 'text-status-risk',    sub: 'Active court cases' },
  { label: 'Pending Complaints',  value: '1,243', icon: Users,         color: 'text-status-caution', sub: 'Awaiting resolution' },
]

export default function GovernCommandCentre() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

  const projects = projectsData as Project[]
  const criticalProjects = projects.filter(p => p.status === 'HIGH RISK')

  const qprDefaulters = qprData.submissions
    .filter(s => {
      const lastKey = qprData.quarters[qprData.quarters.length - 1].toLowerCase().replace(' ', '_')
      const entry = s[lastKey as keyof typeof s] as { status: string } | undefined
      return entry?.status === 'MISSED'
    })
    .map(s => projects.find(p => p.id === s.project_id))
    .filter(Boolean) as Project[]

  const activeLitigation = (litigationData as LitigationItem[]).filter(l => l.severity === 'CRITICAL' || l.severity === 'HIGH')

  return (
    <PageShell
      title="Command Centre"
      subtitle="Data as of 12 May 2026 · Updated daily from K-RERA"
      icon={
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-status-compliant animate-pulse" />
          <span className="text-status-compliant text-xs">Live</span>
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {KPIs.map(({ label, value, icon, color, sub }) => (
          <StatCard key={label} label={label} value={value} sub={sub} icon={icon} valueColor={color} />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">Karnataka District Map</h2>
          <span className="text-muted-foreground text-xs">Click a district to view projects</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-card border border-border rounded-sm p-4">
            <KarnatakaMap selectedDistrict={selectedDistrict?.id ?? null} onDistrictClick={d => setSelectedDistrict(d as District)} />
          </div>
          <div className="lg:col-span-2 bg-card border border-border rounded-sm p-4 flex flex-col">
            <DistrictPanel selectedDistrict={selectedDistrict} projects={projects} onClear={() => setSelectedDistrict(null)} />
          </div>
        </div>
      </div>

      <LiveFeeds criticalProjects={criticalProjects} qprDefaulters={qprDefaulters} activeLitigation={activeLitigation} />
    </PageShell>
  )
}
