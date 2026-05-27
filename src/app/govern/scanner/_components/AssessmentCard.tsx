import type { Application } from '../_data/scanner.data'
import { resultIcon, resultColor, resultBg, riskScoreColor, riskBarColor } from '../_data/scanner.utils'

interface Props {
  app: Application
  failCount: number
  warningCount: number
  onApprove: () => void
  onReject: () => void
  onConditions: () => void
}

export default function AssessmentCard({ app, failCount, warningCount, onApprove, onReject, onConditions }: Props) {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden">
      <div className={`px-5 py-4 border-b border-border ${app.risk === 'HIGH' ? 'bg-status-risk/5' : app.risk === 'MEDIUM' ? 'bg-status-caution/5' : 'bg-status-compliant/5'}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-foreground text-lg font-bold leading-tight">{app.project_name}</div>
            <div className="text-muted-foreground text-xs mt-0.5">{app.developer} · {app.rera_type} · {app.units} units</div>
            <div className="font-mono text-muted-foreground text-[10px] mt-1">Survey: {app.survey_numbers.join(', ')}</div>
          </div>
          <div className="text-center shrink-0">
            <div className={`text-4xl font-bold ${riskScoreColor(app.risk_score)}`}>{app.risk_score}</div>
            <div className="text-muted-foreground text-[10px] mt-0.5">Risk score</div>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${riskBarColor(app.risk_score)}`} style={{ width: `${app.risk_score}%` }} />
        </div>
        {(failCount > 0 || warningCount > 0) && (
          <div className="flex gap-3 mt-2">
            {failCount > 0 && <span className="text-status-risk text-xs">{failCount} fail{failCount > 1 ? 's' : ''}</span>}
            {warningCount > 0 && <span className="text-status-caution text-xs">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>}
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">5-Point Database Verification</div>
        {app.verifications.map((v, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 border rounded-sm ${resultBg(v.result)}`}>
            {resultIcon(v.result)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-foreground text-sm font-semibold">{v.label}</span>
                <span className={`text-xs font-bold shrink-0 ${resultColor(v.result)}`}>{v.result}</span>
              </div>
              <div className="text-muted-foreground text-[10px] mb-1">Source: {v.source} · Checked: {v.checked}</div>
              <div className="text-muted-foreground text-xs leading-relaxed">{v.finding}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-border">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Officer Actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onApprove}     className="bg-status-compliant/15 border border-status-compliant/30 text-status-compliant text-sm py-2.5 rounded-sm hover:bg-status-compliant/25 transition-colors duration-150 font-medium">Approve</button>
          <button onClick={onConditions}  className="bg-status-caution/10 border border-status-caution/30 text-status-caution text-sm py-2.5 rounded-sm hover:bg-status-caution/20 transition-colors duration-150 font-medium">Approve with Conditions</button>
          <button onClick={onReject}      className="bg-status-risk/10 border border-status-risk/30 text-status-risk text-sm py-2.5 rounded-sm hover:bg-status-risk/20 transition-colors duration-150 font-medium">Reject Application</button>
          <button className="bg-muted border border-border text-muted-foreground text-sm py-2.5 rounded-sm hover:text-foreground hover:border-primary/50 transition-colors duration-150">Request Documents</button>
        </div>
      </div>
    </div>
  )
}
