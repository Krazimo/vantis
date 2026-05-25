'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Building2, TrendingUp } from 'lucide-react'
import {
  DEVELOPERS, PROJECTS, COMPONENT_SCORES, TX,
  type Language,
  scoreColor, scoreBorder, barColor, statusColor, statusDot,
} from './_data/developer.data'
import DeveloperProjects from './_components/DeveloperProjects'

export default function DeveloperContent({ params }: { params: { id: string } }) {
  const [lang, setLang] = useState<Language>('en')
  const tx = TX[lang]

  const dev = DEVELOPERS.find(d => d.id === params.id)

  if (!dev) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center">
          <div className="text-gray text-sm mb-3">{tx.notFound}</div>
          <Link href="/" className="text-xs text-gold hover:underline">← Home</Link>
        </div>
      </main>
    )
  }

  const devProjects = PROJECTS.filter(p => dev.projects.includes(p.id))
  const components = COMPONENT_SCORES[dev.id] ?? [50, 50, 50]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold" />
          <span className="font-syne text-base text-gold">Vantis</span>
        </Link>
        <button
          onClick={() => setLang(l => l === 'en' ? 'kn' : 'en')}
          className="text-xs text-gray-light border border-border rounded-sm px-3 py-1.5 hover:border-gold hover:text-gold transition-colors duration-150"
        >
          {tx.langToggle}
        </button>
      </header>

      <div className="flex-1 px-5 sm:px-8 py-6 max-w-3xl mx-auto w-full">
        <Link href="/" className="text-xs text-gray hover:text-gold transition-colors duration-150 mb-4 inline-block">{tx.back}</Link>

        <div className={`bg-surface border rounded-sm p-5 mb-5 ${scoreBorder(dev.trust_score)}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <Building2 className="w-4 h-4 text-gold" />
                <h1 className="font-syne text-xl sm:text-2xl text-off-white">{dev.name}</h1>
              </div>
              <div className="text-gray text-xs mb-3">{dev.city}, {dev.state}</div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor(dev.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(dev.status)}`} />
                  {dev.status}
                </span>
                <span className="text-xs text-gray-light">{dev.years_active} {tx.yearsActive}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className={`font-syne text-5xl sm:text-6xl font-bold leading-none ${scoreColor(dev.trust_score)}`}>{dev.trust_score}</div>
              <div className="text-gray text-[10px] mt-1 uppercase tracking-widest">{tx.trustScore}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {[dev.total_projects, dev.active_projects, dev.completed_projects, dev.total_units.toLocaleString('en-IN')].map((v, i) => (
            <div key={i} className="bg-surface border border-border rounded-sm p-3 text-center">
              <div className="font-syne text-xl font-bold text-off-white">{v}</div>
              <div className="text-gray text-[10px] mt-0.5 leading-tight">{tx.stats[i]}</div>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-sm p-5 mb-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray mb-4">{tx.compliance}</div>
          <div className="space-y-3">
            {tx.labels.map((label, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray">{label}</span>
                  <span className={`font-mono text-xs font-bold ${barColor(components[i]).replace('bg-', 'text-')}`}>{components[i]}%</span>
                </div>
                <div className="w-full h-2 bg-surface2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(components[i])}`} style={{ width: `${components[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-mono text-[10px] text-gray uppercase tracking-[0.15em] mb-3">{tx.projects}</h2>
          <DeveloperProjects projects={devProjects} tx={tx} />
        </div>

        <div className="bg-surface border border-gold/20 rounded-sm p-5 text-center">
          <TrendingUp className="w-5 h-5 text-gold mx-auto mb-2" />
          <div className="font-syne text-base text-off-white mb-1">{tx.cta}</div>
          <div className="text-gray text-xs mb-4">{tx.ctaSub}</div>
          <button className="px-6 py-2.5 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors duration-150">
            {lang === 'en' ? 'Get Report — ₹499' : 'ವರದಿ ಪಡೆಯಿರಿ — ₹499'}
          </button>
        </div>
      </div>
    </main>
  )
}
