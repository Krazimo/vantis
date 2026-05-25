import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { type Verification, resultColor, resultBg } from '../_data/certificate.data'

function ResultIcon({ result }: { result: string }) {
  if (result === 'PASS')    return <CheckCircle className="w-5 h-5 text-green shrink-0 mt-0.5" />
  if (result === 'FLAGGED') return <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
  return <XCircle className="w-5 h-5 text-red shrink-0 mt-0.5" />
}

interface Props {
  verifications: Record<string, Verification>
}

export default function VerificationList({ verifications }: Props) {
  const entries = Object.values(verifications)
  return (
    <div className="space-y-2.5">
      {entries.map((v, i) => (
        <div key={i} className={`flex items-start gap-3 p-3 border rounded-sm ${resultBg(v.result)}`}>
          <ResultIcon result={v.result} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[#1A1A28] text-sm font-semibold">{v.label}</span>
              <span className={`font-mono text-xs font-bold shrink-0 ${resultColor(v.result)}`}>{v.result}</span>
            </div>
            <div className="text-[#6B6B88] text-xs mb-1">Source: {v.source}</div>
            <div className="text-[#6B6B88] text-xs leading-relaxed">{v.detail}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
