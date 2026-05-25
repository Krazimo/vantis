'use client'

import { useState } from 'react'
import { AlertTriangle, BarChart2, Building2, Clock, Scale, Users } from 'lucide-react'
import KarnatakaMap from '@/components/shared/KarnatakaMap'
import projectsData from '@/data/projects.json'
import litigationData from '@/data/litigation.json'
import qprData from '@/data/qpr.json'
import DistrictPanel from './_components/DistrictPanel'
import LiveFeeds from './_components/LiveFeeds'

interface Project { id: string; name: string; developer_name: string; location: string; status: string; risk_score: number; complaints_pending: number }
interface LitigationItem { id: string; project_name: string; developer_name: string; type: string; court: string; filed_date: string; severity: string }
interface District { id: string; label: string; risk: string; projects: string[] }

const KPIs = [
  { label: 'Total Projects',      value: '8,357', icon: Building2,     color: 'text-gold',  sub: 'K-RERA registered' },
  { label: 'Distressed Projects', value: '234',   icon: AlertTriangle, color: 'text-red',   sub: 'High risk flagged' },
  { label: 'QPR Defaulters',      value: '891',   icon: BarChart2,     color: 'text-amber', sub: 'Missed this quarter' },
  { label: 'Litigation Alerts',   value: '47',    icon: Scale,         color: 'text-red',   sub: 'Active court cases' },
  { label: 'Pending Complaints',  value: '1,243', icon: Users,         color: 'text-amber', sub: 'Awaiting resolution' },
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
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Command Centre</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3 h-3 text-gray" />
            <span className="text-gray text-xs">Data as of 12 May 2026 · Updated daily from K-RERA</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="text-green text-xs">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {KPIs.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-surface border border-border rounded-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray text-xs leading-tight">{label}</span>
              <Icon className={`w-4 h-4 ${color} shrink-0`} />
            </div>
            <div className={`font-syne text-2xl sm:text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-gray text-xs mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[10px] text-gray uppercase tracking-[0.15em]">Karnataka District Map</h2>
          <span className="text-gray text-xs">Click a district to view projects</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 bg-surface border border-border rounded-sm p-4">
            <KarnatakaMap selectedDistrict={selectedDistrict?.id ?? null} onDistrictClick={d => setSelectedDistrict(d as District)} />
          </div>
          <div className="lg:col-span-2 bg-surface border border-border rounded-sm p-4 flex flex-col">
            <DistrictPanel selectedDistrict={selectedDistrict} projects={projects} onClear={() => setSelectedDistrict(null)} />
          </div>
        </div>
      </div>

      <LiveFeeds criticalProjects={criticalProjects} qprDefaulters={qprDefaulters} activeLitigation={activeLitigation} />
    </div>
  )
}
