import { FileText } from 'lucide-react'
import type { QPRRow } from '../_data/qpr-tracker.data'
import { ALL_ROWS } from '../_data/qpr-tracker.data'
import { penalty, fmtInr } from '../_data/qpr-tracker.utils'

interface Props {
  selected: Set<string>
  displayRows: QPRRow[]
  open: boolean
  onClose: () => void
  onClear: () => void
  onConfirm: () => void
  onOpenModal: () => void
}

export default function BatchNoticeModal({ selected, displayRows, open, onClose, onClear, onConfirm, onOpenModal }: Props) {
  const selectedRows = displayRows.filter(r => selected.has(r.id))
  const hasMissedSelected = selectedRows.some(r => r.entry.status === 'MISSED')
  const totalSelectedPenalty = Array.from(selected).reduce((s, id) => {
    const row = ALL_ROWS.find(r => r.id === id)
    return s + (row ? penalty(row.quarter, row.entry) : 0)
  }, 0)

  return (
    <>
      {/* Bulk action bar */}
      {selected.size > 0 && hasMissedSelected && (
        <div className="fixed bottom-20 sm:bottom-6 left-0 right-0 flex justify-center px-4 z-30 pointer-events-none">
          <div className="bg-card border border-primary rounded-sm px-4 py-3 flex items-center gap-4 shadow-lg pointer-events-auto max-w-lg w-full">
            <div className="flex-1">
              <span className="text-primary text-sm font-medium">{selected.size} project{selected.size > 1 ? 's' : ''} selected</span>
              <div className="text-muted-foreground text-xs mt-0.5">Total penalty: {fmtInr(totalSelectedPenalty)}</div>
            </div>
            <button onClick={onOpenModal} className="flex items-center gap-2 bg-primary text-background text-xs font-bold px-4 py-2 rounded-sm hover:bg-primary/80 transition-colors duration-150">
              <FileText className="w-3.5 h-3.5" />
              Generate Batch Notices
            </button>
            <button onClick={onClear} className="text-muted-foreground hover:text-foreground text-xs transition-colors duration-150">Clear</button>
          </div>
        </div>
      )}

      {/* Batch modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={onClose}>
          <div className="bg-card border border-border rounded-sm p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="font-syne text-foreground text-base mb-1">Generate Batch Show Cause Notices</div>
            <div className="text-muted-foreground text-xs mb-4">{selected.size} notice{selected.size > 1 ? 's' : ''} will be generated and queued for officer review.</div>
            <div className="space-y-2 mb-5">
              {Array.from(selected).map(id => {
                const row = ALL_ROWS.find(r => r.id === id)
                if (!row) return null
                return (
                  <div key={id} className="flex items-center justify-between bg-muted border border-border rounded-sm px-3 py-2">
                    <div>
                      <div className="text-foreground text-xs font-medium">{row.project_name}</div>
                      <div className="text-muted-foreground text-[10px]">{row.quarter} · {fmtInr(penalty(row.quarter, row.entry))} penalty</div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-status-risk text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-risk shrink-0" />MISSED
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={onConfirm} className="flex-1 bg-primary text-background text-sm font-bold py-2.5 rounded-sm hover:bg-primary/80 transition-colors duration-150">Confirm & Generate</button>
              <button onClick={onClose} className="flex-1 bg-muted border border-border text-muted-foreground text-sm py-2.5 rounded-sm hover:text-foreground transition-colors duration-150">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
