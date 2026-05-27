'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { type FilterType, type Tx, type Project, filterKeys, statusColor, statusDot } from '../_data/portal.data'

interface Props {
  tx: Tx
  filter: FilterType
  query: string
  open: boolean
  results: Project[]
  onFilterChange: (f: FilterType) => void
  onQueryChange: (q: string) => void
  onOpen: (v: boolean) => void
}

export default function SearchDropdown({ tx, filter, query, open, results, onFilterChange, onQueryChange, onOpen }: Props) {
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) onOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOpen])

  return (
    <div ref={searchRef} className="w-full max-w-xl relative">
      <div className="flex gap-2 mb-3">
        {filterKeys.map((f, i) => (
          <button key={f} onClick={() => { onFilterChange(f); onQueryChange(''); onOpen(false) }}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors duration-150 ${
              filter === f ? 'bg-primary/15 border-primary text-primary font-medium' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary/80'
            }`}>
            {tx.filterLabels[i]}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { onQueryChange(e.target.value); onOpen(true) }}
          onFocus={() => { if (query.length >= 2) onOpen(true) }}
          placeholder={tx.placeholder[filter]}
          className="w-full bg-card border border-border rounded-sm pl-11 pr-11 py-3.5 text-foreground placeholder-gray text-sm focus:outline-none focus:border-primary/60 transition-colors duration-150"
        />
        {query && (
          <button onClick={() => { onQueryChange(''); onOpen(false) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-150">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-sm z-50 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-muted-foreground text-sm">{tx.noResults}</div>
          ) : (
            results.map(p => (
              <button key={p.id}
                onClick={() => { onOpen(false); onQueryChange(''); router.push(`/project/${p.id}`) }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors duration-150 text-left border-b border-border last:border-0 group">
                <div>
                  <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">{p.name}</div>
                  <div className="font-mono text-muted-foreground text-xs mt-0.5">{p.developer_name} · {p.location}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs shrink-0 ml-3 ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />
                  {p.status}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
