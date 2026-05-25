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
      <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center bg-surface border border-border rounded-sm">
        <div className="text-center px-6">
          <FileText className="w-8 h-8 text-gray mx-auto mb-3" />
          <div className="text-off-white text-sm mb-1">No notice generated</div>
          <div className="text-gray text-xs">Select a violation type and project, then click Generate Notice.</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-64 lg:h-full min-h-[300px] flex items-center justify-center bg-surface border border-border rounded-sm">
        <div className="text-center">
          <div className="flex items-center gap-1.5 mb-3 justify-center">
            <span className="typing-dot bg-gold" />
            <span className="typing-dot bg-gold" style={{ animationDelay: '200ms' }} />
            <span className="typing-dot bg-gold" style={{ animationDelay: '400ms' }} />
          </div>
          <div className="text-gray text-xs">Vantis Intelligence drafting notice…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[#FAFAF7] border border-[#D0CCB8] rounded-sm overflow-hidden print:shadow-none">
        <div className="px-6 py-5 border-b-2 border-[#0A3D62] bg-[#F0EEE6] text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <Shield className="w-8 h-8 text-[#0A3D62]" />
            <div>
              <div className="font-bold text-[#0A3D62] text-base tracking-wide leading-tight">KARNATAKA REAL ESTATE REGULATORY AUTHORITY</div>
              <div className="text-[#0A3D62] text-xs opacity-70">ಕರ್ನಾಟಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ</div>
            </div>
          </div>
          <div className="text-[#0A3D62] text-[11px] opacity-70 mt-1">5th Floor, TTMC Building, BMTC Complex, Shivajinagar, Bengaluru – 560 001</div>
        </div>
        <div className="px-6 py-5">
          <pre className="font-sans text-[#1A1A28] text-xs leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'inherit' }}>
            {noticeText}
          </pre>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onCopy} className="flex items-center gap-2 flex-1 justify-center py-2.5 text-sm border border-border bg-surface text-gray hover:text-gold hover:border-gold rounded-sm transition-colors duration-150">
          {copied ? <Check className="w-4 h-4 text-green" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        <button onClick={onPrint} className="flex items-center gap-2 flex-1 justify-center py-2.5 text-sm bg-gold text-background font-bold rounded-sm hover:bg-gold-light transition-colors duration-150">
          <Printer className="w-4 h-4" />
          Download as PDF
        </button>
      </div>
    </div>
  )
}
