'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Shield, Search, Clock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { COMPLAINTS, TX, type Language, type Complaint } from './_data/track-complaint.data'
import ComplaintResult from './_components/ComplaintResult'

function TrackContent() {
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<Language>('en')
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [result, setResult] = useState<Complaint | null | undefined>(undefined)
  const tx = TX[lang]

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setQuery(ref)
      setSearched(true)
      setResult(COMPLAINTS.find(c => c.id.toLowerCase() === ref.toLowerCase()) ?? null)
    }
  }, [searchParams])

  function doSearch() {
    const val = query.trim()
    if (!val) return
    setSearched(true)
    setResult(COMPLAINTS.find(c => c.id.toLowerCase() === val.toLowerCase()) ?? null)
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-gold" />
          <span className="font-syne text-base text-gold">Vantis</span>
        </Link>
        <div className="text-off-white text-sm font-medium">{tx.title}</div>
        <button onClick={() => setLang(l => l === 'en' ? 'kn' : 'en')}
          className="text-xs text-gray-light border border-border rounded-sm px-3 py-1.5 hover:border-gold hover:text-gold transition-colors duration-150">
          {tx.langToggle}
        </button>
      </header>

      <div className="flex-1 px-5 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="font-syne text-2xl text-off-white mb-1">{tx.title}</h1>
          <p className="text-gray text-sm mb-4">{tx.sub}</p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder={tx.placeholder}
                className="w-full bg-surface border border-border rounded-sm pl-9 pr-4 py-3 text-off-white placeholder-gray text-sm focus:outline-none focus:border-gold transition-colors duration-150"
              />
            </div>
            <button onClick={doSearch} className="px-5 py-3 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors duration-150">
              {tx.search}
            </button>
          </div>
        </div>

        {!searched && (
          <div className="text-center py-10">
            <Clock className="w-8 h-8 text-gray mx-auto mb-3" />
            <div className="text-gray-light text-sm mb-1">{tx.enterRef}</div>
            <div className="text-gray text-xs">{tx.example}</div>
          </div>
        )}

        {searched && result === null && (
          <div className="bg-surface border border-border rounded-sm p-6 text-center">
            <div className="text-off-white text-sm font-medium mb-2">{tx.notFound}</div>
            <pre className="text-gray text-xs whitespace-pre-wrap font-sans leading-relaxed">{tx.notFoundSub}</pre>
          </div>
        )}

        {result && <ComplaintResult result={result} lang={lang} tx={tx} />}
      </div>
    </main>
  )
}

export default function TrackComplaint() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TrackContent />
    </Suspense>
  )
}
