import Link from 'next/link'
import { Shield } from 'lucide-react'
import type { Language, Tx } from '../_data/file-complaint.data'

interface Props {
  lang: Language
  setLang: (l: Language) => void
  tx: Tx
}

export default function ComplaintHeader({ lang, setLang, tx }: Props) {
  return (
    <header className="flex items-center justify-between px-5 py-4 border-b border-border bg-background">
      <Link href="/" className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-gold" />
        <span className="font-syne text-base text-gold">Vantis</span>
      </Link>
      <div className="text-center">
        <div className="text-off-white text-sm font-medium">{tx.title}</div>
        <div className="text-gray text-xs">{tx.sub}</div>
      </div>
      <button
        onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
        className="text-xs text-gray-light border border-border rounded-sm px-3 py-1.5 hover:border-gold hover:text-gold transition-colors duration-150"
      >
        {tx.langToggle}
      </button>
    </header>
  )
}
