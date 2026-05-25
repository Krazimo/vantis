import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { CERT_ID, CERT_VERIFICATIONS } from '../_data/scanner.data'
import { fmtTimestamp } from '../_data/scanner.utils'

interface Props {
  approvedAt: Date
  onReset: () => void
}

export default function ApprovalSuccess({ approvedAt, onReset }: Props) {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="bg-green/10 border border-green/20 rounded-sm p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green mx-auto mb-3" />
        <div className="font-syne text-2xl text-off-white font-bold mb-2">Application Approved</div>
        <div className="text-gray text-sm mb-3 leading-relaxed">Prestige Whitefield Phase 2 has been approved for K-RERA registration</div>
        <div className="font-mono text-[10px] text-gray uppercase tracking-widest">{fmtTimestamp(approvedAt)}</div>
      </div>

      <div className="bg-surface border border-border rounded-sm p-6 mt-4">
        <div className="font-syne text-off-white text-base font-semibold mb-1">Vantis Certificate Generated</div>
        <div className="text-gray text-xs mb-4">Tamper-proof compliance record issued by Orianode Technologies</div>
        <div className="font-mono text-gold text-lg font-bold mb-5 tracking-wide">{CERT_ID}</div>
        <div className="space-y-2 mb-5">
          {CERT_VERIFICATIONS.map((v, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border rounded-sm bg-green/5 border-green/20">
              <CheckCircle className="w-4 h-4 text-green shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-off-white text-sm font-semibold">{v.label}</span>
                  <span className="font-mono text-xs font-bold text-green shrink-0">PASS</span>
                </div>
                <div className="text-gray text-[10px] mt-0.5">Source: {v.source}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-gray text-sm text-center border-t border-border pt-4">Certificate is now publicly scannable</div>
      </div>

      <div className="bg-surface border border-border rounded-sm p-6 mt-4">
        <div className="font-mono text-[10px] text-gray uppercase tracking-[0.15em] mb-4">Next Steps</div>
        <div className="space-y-3 mb-6">
          {[
            'Project is now live in the K-RERA public registry',
            'Developer has been notified via email and portal',
            'Vantis certificate QR code is now active and publicly scannable',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
              <span className="text-gray-light text-sm leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/certificate/${CERT_ID}`} className="flex-1 bg-gold text-background text-sm font-semibold py-2.5 rounded-sm hover:bg-gold-light transition-colors duration-150 text-center">View Certificate</Link>
          <button onClick={onReset} className="flex-1 border border-border text-gray text-sm py-2.5 rounded-sm hover:text-off-white hover:border-gold/50 transition-colors duration-150">Return to Scanner Queue</button>
        </div>
      </div>
    </div>
  )
}
