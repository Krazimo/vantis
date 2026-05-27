import { CheckCircle, XCircle } from 'lucide-react'
import type { Application } from '../_data/scanner.data'
import { riskConfig } from '../_data/scanner.utils'

interface Props {
  app: Application
  approveModal: boolean
  rejectModal: boolean
  conditionsModal: boolean
  onConfirmApprove: () => void
  onConfirmReject: () => void
  onConfirmConditions: () => void
  onClose: () => void
}

export default function ScannerModals({ app, approveModal, rejectModal, conditionsModal, onConfirmApprove, onConfirmReject, onConfirmConditions, onClose }: Props) {
  const rc = riskConfig(app.risk)

  return (
    <>
      {approveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-lg font-bold mb-4">Approve Application</div>
            <div className="space-y-2 mb-4">
              {[
                { label: 'Project',         value: app.project_name },
                { label: 'Developer',        value: app.developer },
                { label: 'Application No.',  value: app.id },
                { label: 'Pre-Assessment',   value: `${rc.label} · Score ${app.risk_score}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3 py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground text-xs shrink-0">{label}</span>
                  <span className={`text-xs text-right font-medium ${label === 'Pre-Assessment' ? rc.textColor : 'text-foreground'}`}>{value}</span>
                </div>
              ))}
            </div>
            <div className="border-l-4 border-status-compliant bg-status-compliant/5 px-4 py-3 rounded-sm mb-5">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-status-compliant shrink-0 mt-0.5" />
                <span className="text-status-compliant text-xs leading-relaxed">All five database checks passed or resolved. This application is cleared for registration.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onConfirmApprove} className="flex-1 bg-primary text-background text-sm font-semibold py-2.5 rounded-sm hover:bg-primary/80 transition-colors duration-150">Confirm Approval</button>
              <button onClick={onClose} className="flex-1 border border-border text-muted-foreground text-sm py-2.5 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-base mb-2">Reject Application?</div>
            <div className="text-muted-foreground text-sm mb-1 leading-relaxed">
              <strong className="text-foreground">{app.project_name}</strong> will be rejected. The developer will receive a rejection notice with the following findings:
            </div>
            <div className="bg-status-risk/5 border border-status-risk/20 rounded-sm p-3 mb-4 space-y-1">
              {app.verifications.filter(v => v.result === 'FAIL').map((v, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <XCircle className="w-3.5 h-3.5 text-status-risk shrink-0 mt-0.5" />
                  <span className="text-status-risk/80">{v.finding}</span>
                </div>
              ))}
              {app.verifications.filter(v => v.result === 'FAIL').length === 0 && (
                <div className="text-muted-foreground text-xs">No critical failures — confirm reason for rejection.</div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={onConfirmReject} className="flex-1 bg-status-risk/10 border border-status-risk/40 text-status-risk text-sm py-2.5 rounded-sm hover:bg-status-risk/20 transition-colors duration-150 font-medium">Confirm Rejection</button>
              <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground text-sm py-2.5 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {conditionsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-base mb-2">Approve with Conditions</div>
            <div className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Provisional approval granted for <strong className="text-foreground">{app.project_name}</strong>. Developer must resolve all warnings within 60 days or registration will be suspended.
            </div>
            <div className="flex gap-3">
              <button onClick={onConfirmConditions} className="flex-1 bg-status-caution/10 border border-status-caution/40 text-status-caution text-sm py-2.5 rounded-sm hover:bg-status-caution/20 transition-colors duration-150 font-medium">Issue Conditional Approval</button>
              <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground text-sm py-2.5 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
