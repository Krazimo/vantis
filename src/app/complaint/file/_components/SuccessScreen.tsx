import Link from 'next/link'
import { CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react'
import { NATURES, type Language, type Tx, type Project } from '../_data/file-complaint.data'

interface Props {
  lang: Language
  tx: Tx
  ref: string
  selectedProject: Project | null
  nature: string
}

export default function SuccessScreen({ lang, tx, ref, selectedProject, nature }: Props) {
  const whatsappText = `K-RERA Complaint Registered\nRef: ${ref}\nProject: ${selectedProject?.name ?? ''}\nIssue: ${NATURES.find(n => n.key === nature)?.[lang] ?? ''}\n\nTrack at krera.karnataka.gov.in`

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green/10 border border-green/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green" />
        </div>
        <h1 className="font-syne text-2xl text-off-white mb-2">{tx.successTitle}</h1>
        <p className="text-gray text-sm mb-6">{tx.successSub}</p>

        <div className="bg-surface border border-gold/30 rounded-sm p-4 mb-4 text-center">
          <div className="text-gray text-xs uppercase tracking-widest mb-1">{tx.refLabel}</div>
          <div className="font-syne text-3xl font-bold text-gold">{ref}</div>
        </div>

        <div className="bg-surface border border-border rounded-sm p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-green" />
            <span className="text-green text-xs font-semibold">{tx.whatsapp}</span>
          </div>
          <pre className="text-off-white text-xs whitespace-pre-wrap font-sans leading-relaxed bg-surface2 rounded-sm px-3 py-2 border border-border">
            {whatsappText}
          </pre>
        </div>

        <Link href={`/complaint/track?ref=${ref}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-background font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors duration-150 mb-3">
          {tx.trackBtn} <ChevronRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="text-xs text-gray hover:text-gold transition-colors duration-150">
          ← {lang === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂದಿರುಗಿ'}
        </Link>
      </div>
    </div>
  )
}
