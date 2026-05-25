'use client'

import { useState, useMemo } from 'react'
import { Search, Building2, Filter } from 'lucide-react'
import { PROJECTS, UNIQUE_DEVELOPERS, LAST_QUARTER, type StatusFilter } from './_data/project-registry.data'
import ProjectTable from './_components/ProjectTable'

export default function GovernProjectRegistry() {
  const [search, setSearch]           = useState('')
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
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-syne text-2xl sm:text-3xl text-off-white">Project Registry</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Building2 className="w-3 h-3 text-gray" />
            <span className="text-gray text-xs">All K-RERA registered projects · Vantis database</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 bg-surface border border-border rounded-sm px-3 py-1.5">
          <span className="font-mono text-gold text-sm font-bold">{filtered.length}</span>
          <span className="text-gray text-xs">/ {PROJECTS.length} projects</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray pointer-events-none" />
          <input type="text" placeholder="Search by project name, developer, location, RERA number…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-off-white placeholder:text-gray focus:outline-none focus:border-gold transition-colors duration-150"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray pointer-events-none" />
          <select value={devFilter} onChange={e => setDevFilter(e.target.value)}
            className="bg-surface border border-border rounded-sm pl-8 pr-8 py-2.5 text-sm text-off-white focus:outline-none focus:border-gold transition-colors duration-150 appearance-none cursor-pointer">
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
                ? s === 'ALL' ? 'bg-gold/20 border-gold text-gold' : s === 'COMPLIANT' ? 'bg-green/20 border-green/50 text-green' : s === 'CAUTION' ? 'bg-amber/20 border-amber/50 text-amber' : 'bg-red/20 border-red/50 text-red'
                : 'bg-surface border-border text-gray hover:border-gold hover:text-gold-light'
            }`}>
            {s === 'ALL' ? 'All Status' : s}
            {s !== 'ALL' && <span className="ml-1.5 font-mono text-[10px]">{PROJECTS.filter(p => p.status === s).length}</span>}
          </button>
        ))}
      </div>

      <div className="sm:hidden text-gray text-xs mb-3">Showing {filtered.length} of {PROJECTS.length} projects</div>

      <ProjectTable filtered={filtered} totalCount={PROJECTS.length} lastQuarter={LAST_QUARTER} />
    </div>
  )
}
