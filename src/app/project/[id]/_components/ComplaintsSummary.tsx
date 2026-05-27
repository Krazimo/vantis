import { CheckCircle2 } from 'lucide-react'

interface Props {
  pending: number
  resolved: number
  hasDataRecords: boolean
}

export default function ComplaintsSummary({ pending, resolved, hasDataRecords }: Props) {
  const total = pending + resolved
  const stats = [
    { value: pending,  label: 'Pending',    color: pending > 0 ? 'text-status-risk' : 'text-status-compliant' },
    { value: resolved, label: 'Resolved',   color: 'text-status-compliant' },
    { value: total,    label: 'Total Filed', color: 'text-foreground' },
  ]
  return (
    <div>
      <h2 className="text-base text-primary/50 uppercase tracking-widest mb-4">Complaints</h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ value, label, color }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-4 text-center">
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <div className="text-muted-foreground text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
      {hasDataRecords && (
        <div className="mt-3 bg-card border border-border rounded-sm p-3">
          <div className="text-muted-foreground text-xs">Recent complaints on file for this project in the K-RERA database.</div>
        </div>
      )}
      {pending === 0 && resolved === 0 && (
        <div className="mt-3 flex items-center gap-2 text-status-compliant text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>No complaints have been filed against this project.</span>
        </div>
      )}
    </div>
  )
}
