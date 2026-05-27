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
      <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">
        Quarterly Progress Reports · {totalQuarters} quarters
      </div>

      <div className="hidden md:block border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface2">
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Quarter</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Due Date</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Filed Date</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Status</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Completion</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Days Late</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">Penalty</th>
            </tr>
          </thead>
          <tbody>
            {qprRows.map(({ quarter, entry }) => {
              const due = getDueDate(quarter)
              const late = (entry.status === 'LATE' || entry.status === 'MISSED') ? daysLate(quarter, entry) : null
              const penalty = entry.status === 'MISSED' ? (daysLate(quarter, entry) * 25_000) : null
              return (
                <tr key={quarter} className={`border-b border-border last:border-0 ${qprRowClass(entry.status)}`}>
                  <td className="px-4 py-3 font-mono text-xs text-gold">{quarter}</td>
                  <td className="px-4 py-3 text-gray text-xs">{fmtDate(due.toISOString().split('T')[0])}</td>
                  <td className="px-4 py-3 text-xs text-off-white">
                    {entry.filed_date ? fmtDate(entry.filed_date) : <span className="text-gray">—</span>}
                  </td>
                  <td className="px-4 py-3">{qprStatusEl(entry.status)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-off-white">
                    {entry.completion_pct !== null ? `${entry.completion_pct}%` : <span className="text-gray">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {late !== null ? <span className={late > 0 ? (entry.status === 'MISSED' ? 'text-red' : 'text-amber') : 'text-gray'}>{late > 0 ? `+${late}d` : '—'}</span> : <span className="text-gray">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {penalty !== null ? <span className="text-red">{fmtInr(penalty)}</span> : <span className="text-gray">—</span>}
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
                <span className="font-mono text-gold text-xs font-bold">{quarter}</span>
                {qprStatusEl(entry.status)}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-gray">Due: <span className="text-off-white">{fmtDate(due.toISOString().split('T')[0])}</span></div>
                <div className="text-gray">Filed: <span className="text-off-white">{entry.filed_date ? fmtDate(entry.filed_date) : '—'}</span></div>
                {entry.completion_pct !== null && (
                  <div className="text-gray">Completion: <span className="text-off-white">{entry.completion_pct}%</span></div>
                )}
                {late !== null && late > 0 && (
                  <div className="text-gray">Late: <span className={entry.status === 'MISSED' ? 'text-red' : 'text-amber'}>+{late} days</span></div>
                )}
                {penalty !== null && (
                  <div className="text-gray col-span-2">Penalty: <span className="text-red font-mono">{fmtInr(penalty)}</span></div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {project.status === 'HIGH RISK' && (
        <div className="mt-4 border-l-2 border-red pl-3 bg-red/5 rounded-sm p-3">
          <div className="text-red text-xs font-semibold mb-0.5">Total Penalty Accrued</div>
          <div className="font-mono text-red text-lg font-bold">
            {fmtInr(
              qprRows
                .filter(({ entry }) => entry.status === 'MISSED')
                .reduce((sum, { quarter, entry }) => sum + daysLate(quarter, entry) * 25_000, 0)
            )}
          </div>
          <div className="text-gray text-xs mt-0.5">@ Rs.25,000 per day per quarter</div>
        </div>
      )}
    </div>
  )
}
