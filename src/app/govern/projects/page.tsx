'use client'

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { PROJECTS, UNIQUE_DEVELOPERS, LAST_QUARTER, type StatusFilter } from './_data/project-registry.data'
import ProjectTable from './_components/ProjectTable'
import { PageShell } from '@/features/govern/components/PageShell'

export default function GovernProjectRegistry() {
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [devFilter, setDevFilter]       = useState('ALL')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return PROJECTS.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.developer_name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.rera.toLowerCase().includes(q)
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
      const matchDev    = devFilter === 'ALL' || p.developer_name === devFilter
      return matchSearch && matchStatus && matchDev
    })
  }, [search, statusFilter, devFilter])

  return (
    <PageShell
      title="Project Registry"
      subtitle="All K-RERA registered projects · Vantis database"
      icon={
        <div className="hidden sm:flex items-center gap-1.5 bg-card border border-border rounded-sm px-3 py-1.5">
          <span className="text-primary text-sm font-bold">{filtered.length}</span>
          <span className="text-muted-foreground text-xs">/ {PROJECTS.length} projects</span>
        </div>
      }
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input type="text" placeholder="Search by project name, developer, location, RERA number…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-150"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select value={devFilter} onChange={e => setDevFilter(e.target.value)}
            className="bg-card border border-border rounded-sm pl-8 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary transition-colors duration-150 appearance-none cursor-pointer">
            <option value="ALL">All Developers</option>
            {UNIQUE_DEVELOPERS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(['ALL', 'COMPLIANT', 'CAUTION', 'HIGH RISK'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
              statusFilter === s
                ? s === 'ALL' ? 'bg-primary/20 border-primary text-primary' : s === 'COMPLIANT' ? 'bg-status-compliant/20 border-status-compliant/50 text-status-compliant' : s === 'CAUTION' ? 'bg-status-caution/20 border-status-caution/50 text-status-caution' : 'bg-status-risk/20 border-status-risk/50 text-status-risk'
                : 'bg-card border-border text-muted-foreground hover:border-primary hover:text-primary/80'
            }`}>
            {s === 'ALL' ? 'All Status' : s}
            {s !== 'ALL' && <span className="ml-1.5 text-[10px]">{PROJECTS.filter(p => p.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="sm:hidden text-muted-foreground text-xs mb-3">Showing {filtered.length} of {PROJECTS.length} projects</div>

      <ProjectTable filtered={filtered} totalCount={PROJECTS.length} lastQuarter={LAST_QUARTER} />
    </PageShell>
  )
}
