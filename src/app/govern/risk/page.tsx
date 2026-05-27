'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { DEVELOPERS } from './_data/risk.data'
import DeveloperCard from './_components/DeveloperCard'
import { PageShell } from '@/features/govern/components/PageShell'

export default function DeveloperRiskIntelligence() {
  const [search,     setSearch]     = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => DEVELOPERS.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  return (
    <PageShell
      title="Developer Risk Intelligence"
      subtitle="Trust scores across K-RERA registered developers"
    >
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search developer..."
          className="w-full bg-card border border-border rounded-sm pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(dev => (
          <DeveloperCard
            key={dev.id}
            dev={dev}
            expanded={expandedId === dev.id}
            onToggle={() => setExpandedId(prev => (prev === dev.id ? null : dev.id))}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-muted-foreground text-sm">No developers match &ldquo;{search}&rdquo;</div>
        )}
      </div>
    </PageShell>
  )
}
