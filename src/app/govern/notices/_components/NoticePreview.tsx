import { FileText, Copy, Check, Printer, Shield } from 'lucide-react'

interface Props {
  noticeText: string | null
  loading: boolean
  copied: boolean
  onCopy: () => void
  onPrint: () => void
}

export default function NoticePreview({ noticeText, loading, copied, onCopy, onPrint }: Props) {
  if (!noticeText && !loading) {
    return (
      <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center bg-card border border-border rounded-sm">
        <div className="text-center px-6">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <div className="text-foreground text-sm mb-1">No notice generated</div>
          <div className="text-muted-foreground text-xs">Select a violation type and project, then click Generate Notice.</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center bg-card border border-border rounded-sm">
        <div className="text-center">
          <div className="flex items-center gap-1.5 mb-3 justify-center">
            <span className="typing-dot bg-primary" />
            <span className="typing-dot bg-primary" style={{ animationDelay: '200ms' }} />
            <span className="typing-dot bg-primary" style={{ animationDelay: '400ms' }} />
          </div>
          <div className="text-muted-foreground text-xs">Vantis Intelligence drafting notice…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-notice-paper border border-notice-border rounded-sm overflow-hidden print:shadow-none">
        <div className="px-6 py-5 border-b-2 border-notice-ink bg-notice-header text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Shield className="w-8 h-8 text-notice-ink" />
            <div>
              <div className="font-bold text-notice-ink text-base tracking-wide leading-tight">KARNATAKA REAL ESTATE REGULATORY AUTHORITY</div>
              <div className="text-notice-ink text-xs opacity-70">ಕರ್ನಾಟಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ</div>
            </div>
          </div>
          <div className="text-notice-ink text-[11px] opacity-70 mt-1">5th Floor, TTMC Building, BMTC Complex, Shivajinagar, Bengaluru – 560 001</div>
        </div>
        <div className="px-6 py-5">
          <pre className="font-sans text-notice-text text-xs leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>
            {noticeText}
          </pre>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCopy} className="flex items-center gap-2 flex-1 justify-center py-2.5 text-sm border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary rounded-sm transition-colors duration-150">
          {copied ? <Check className="w-4 h-4 text-status-compliant" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button onClick={onPrint} className="flex items-center gap-2 flex-1 justify-center py-2.5 text-sm bg-primary text-background font-bold rounded-sm hover:bg-primary/80 transition-colors duration-150">
          <Printer className="w-4 h-4" />
          Download as PDF
        </button>
      </div>
    </div>
  )
}
