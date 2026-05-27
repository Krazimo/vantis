import type { Complaint } from '../_data/complaints.data'
import { fmtDate } from '../_data/complaints.utils'

interface Props {
  c: Complaint
}

export default function ComplaintExpandedDetail({ c }: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Complaint Description</div>
        <p className="text-foreground text-xs leading-relaxed mb-4">{c.description}</p>
        {c.resolution_summary && (
          <div className="border-l-2 border-status-compliant pl-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Resolution</div>
            <p className="text-status-compliant text-xs leading-relaxed">{c.resolution_summary}</p>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Amount at Risk</div>
          <div className="font-mono text-sm font-bold text-status-caution">₹{c.amount_at_risk_lakh} Lakh</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Assigned Officer</div>
          <div className="text-xs text-foreground">{c.assigned_officer}</div>
        </div>
        {c.resolution_date && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Resolved On</div>
            <div className="text-xs text-status-compliant">{fmtDate(c.resolution_date)}</div>
          </div>
        )}
      </div>
    </div>
  )
}
