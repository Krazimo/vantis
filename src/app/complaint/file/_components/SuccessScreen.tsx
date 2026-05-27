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
        <div className="w-16 h-16 bg-status-compliant/10 border border-status-compliant/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-status-compliant" />
        </div>
        <h1 className="text-2xl text-foreground mb-2">{tx.successTitle}</h1>
        <p className="text-muted-foreground text-sm mb-6">{tx.successSub}</p>

        <div className="bg-card border border-primary/30 rounded-sm p-4 mb-4 text-center">
          <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1">{tx.refLabel}</div>
          <div className="text-3xl font-bold text-primary">{ref}</div>
        </div>

        <div className="bg-card border border-border rounded-sm p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-3.5 h-3.5 text-status-compliant" />
            <span className="text-status-compliant text-xs font-semibold">{tx.whatsapp}</span>
          </div>
          <pre className="text-foreground text-xs whitespace-pre-wrap font-sans leading-relaxed bg-muted rounded-sm px-3 py-2 border border-border">
            {whatsappText}
          </pre>
        </div>

        <Link href={`/complaint/track?ref=${ref}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-background font-semibold text-sm rounded-sm hover:bg-primary/80 transition-colors duration-150 mb-3">
          {tx.trackBtn} <ChevronRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150">
          ← {lang === 'en' ? 'Back to Home' : 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂದಿರುಗಿ'}
        </Link>
      </div>
    </div>
  )
}
