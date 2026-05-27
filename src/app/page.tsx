'use client'

import { useState, useMemo } from 'react'
import { Shield, ArrowRight } from 'lucide-react'
import projects from '@/data/projects.json'
import { TRANSLATIONS, type FilterType, type Language, type Project } from './_data/portal.data'
import SearchDropdown from './_components/SearchDropdown'

export default function PublicPortalHome() {
  const [lang, setLang]     = useState<Language>('en')
  const [filter, setFilter] = useState<FilterType>('project')
  const [query, setQuery]   = useState('')
  const [open, setOpen]     = useState(false)
  const tx = TRANSLATIONS[lang]

  const results = useMemo(() => query.length < 2 ? [] : (projects as Project[]).filter(p => {
    const q = query.toLowerCase()
    if (filter === 'project')   return p.name.toLowerCase().includes(q)
    if (filter === 'developer') return p.developer_name.toLowerCase().includes(q)
    return p.rera.toLowerCase().includes(q)
  }), [query, filter])

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-5 sm:px-10 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-lg text-primary tracking-wide">{tx.brand}</span>
          <span className="hidden sm:inline text-muted-foreground text-[10px] font-mono uppercase tracking-[0.15em] ml-2 border-l border-border pl-3">by Orianode</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(l => (l === 'en' ? 'kn' : 'en'))}
            className="text-xs text-muted-foreground border border-border rounded-sm px-3 py-1.5 hover:border-primary hover:text-primary transition-colors duration-150">
            {tx.langToggle}
          </button>
          <a href="/govern" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-150">
            {tx.officerLogin}<ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-5 pt-16 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-mono text-[10px] text-primary/50 uppercase tracking-[0.2em]">{tx.tagline}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl text-foreground text-center leading-tight mb-4 whitespace-pre-line">{tx.heading}</h1>
        <p className="text-muted-foreground text-sm sm:text-base text-center max-w-md mb-10 leading-relaxed">{tx.sub}</p>

        <SearchDropdown
          tx={tx}
          filter={filter}
          query={query}
          open={open}
          results={results}
          onFilterChange={f => { setFilter(f); setQuery(''); setOpen(false) }}
          onQueryChange={setQuery}
          onOpen={setOpen}
        />

        <div className="grid grid-cols-3 gap-3 w-full max-w-xl mt-12">
          {tx.stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-sm p-4 sm:p-5 text-center">
              <div className="text-2xl sm:text-3xl text-primary font-bold">{s.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.12em] mt-1.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-8">
          <div className="h-px w-8 bg-border" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">K-RERA · Kaveri 2.0 · eCourts · Bhoomi</span>
          <div className="h-px w-8 bg-border" />
        </div>
      </section>

      <footer className="py-4 text-center border-t border-border px-4">
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.12em]">{tx.poweredBy}</span>
      </footer>
    </main>
  )
}
