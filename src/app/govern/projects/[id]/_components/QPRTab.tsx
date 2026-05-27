import type { Project, QPREntry, QPRRow } from '../_data/project-detail.types'
import {
  getDueDate, daysLate, fmtDate, fmtInr, qprRowClass, qprStatusEl,
} from '../_data/project-detail.utils'

interface Props {
  project: Project
  qprRows: QPRRow[]
  totalQuarters: number
}

export default function QPRTab({ project, qprRows, totalQuarters }: Props) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">
        Quarterly Progress Reports · {totalQuarters} quarters
      </div>

      <div className="hidden md:block border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Quarter</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Due Date</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Filed Date</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Completion</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Days Late</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Penalty</th>
            </tr>
          </thead>
          <tbody>
            {qprRows.map(({ quarter, entry }) => {
              const due = getDueDate(quarter)
              const late = (entry.status === 'LATE' || entry.status === 'MISSED') ? daysLate(quarter, entry) : null
              const penalty = entry.status === 'MISSED' ? (daysLate(quarter, entry) * 25_000) : null
              return (
                <tr key={quarter} className={`border-b border-border last:border-0 ${qprRowClass(entry.status)}`}>
                  <td className="px-4 py-3 font-mono text-xs text-primary">{quarter}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{fmtDate(due.toISOString().split('T')[0])}</td>
                  <td className="px-4 py-3 text-xs text-foreground">
                    {entry.filed_date ? fmtDate(entry.filed_date) : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">{qprStatusEl(entry.status)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {entry.completion_pct !== null ? `${entry.completion_pct}%` : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {late !== null ? <span className={late > 0 ? (entry.status === 'MISSED' ? 'text-status-risk' : 'text-status-caution') : 'text-muted-foreground'}>{late > 0 ? `+${late}d` : '—'}</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {penalty !== null ? <span className="text-status-risk">{fmtInr(penalty)}</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-2">
        {qprRows.map(({ quarter, entry }) => {
          const due = getDueDate(quarter)
          const late = (entry.status === 'LATE' || entry.status === 'MISSED') ? daysLate(quarter, entry) : null
          const penalty = entry.status === 'MISSED' ? (daysLate(quarter, entry) * 25_000) : null
          return (
            <div key={quarter} className={`border border-border rounded-sm p-3 ${qprRowClass(entry.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-primary text-xs font-bold">{quarter}</span>
                {qprStatusEl(entry.status)}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-muted-foreground">Due: <span className="text-foreground">{fmtDate(due.toISOString().split('T')[0])}</span></div>
                <div className="text-muted-foreground">Filed: <span className="text-foreground">{entry.filed_date ? fmtDate(entry.filed_date) : '—'}</span></div>
                {entry.completion_pct !== null && (
                  <div className="text-muted-foreground">Completion: <span className="text-foreground">{entry.completion_pct}%</span></div>
                )}
                {late !== null && late > 0 && (
                  <div className="text-muted-foreground">Late: <span className={entry.status === 'MISSED' ? 'text-status-risk' : 'text-status-caution'}>+{late} days</span></div>
                )}
                {penalty !== null && (
                  <div className="text-muted-foreground col-span-2">Penalty: <span className="text-status-risk font-mono">{fmtInr(penalty)}</span></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {project.status === 'HIGH RISK' && (
        <div className="mt-4 border-l-2 border-status-risk pl-3 bg-status-risk/5 rounded-sm p-3">
          <div className="text-status-risk text-xs font-semibold mb-0.5">Total Penalty Accrued</div>
          <div className="font-mono text-status-risk text-lg font-bold">
            {fmtInr(
              qprRows
                .filter(({ entry }) => entry.status === 'MISSED')
                .reduce((sum, { quarter, entry }) => sum + daysLate(quarter, entry) * 25_000, 0)
            )}
          </div>
          <div className="text-muted-foreground text-xs mt-0.5">@ Rs.25,000 per day per quarter</div>
        </div>
      )}
    </div>
  )
}
