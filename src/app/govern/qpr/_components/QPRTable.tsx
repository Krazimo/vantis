import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import type { QPRRow } from '../_data/qpr-tracker.data'
import { getDueDate, daysOverdue, penalty, fmtDate, fmtInr } from '../_data/qpr-tracker.utils'

function StatusBadge({ status }: { status: string }) {
  if (status === 'ON_TIME') return (
    <span className="flex items-center gap-1 text-green text-xs font-medium">
      <CheckCircle className="w-3.5 h-3.5" /> On Time
    </span>
  )
  if (status === 'LATE') return (
    <span className="flex items-center gap-1 text-amber text-xs font-medium">
      <AlertTriangle className="w-3.5 h-3.5" /> Late
    </span>
  )
  if (status === 'MISSED') return (
    <span className="flex items-center gap-1 text-red text-xs font-medium">
      <XCircle className="w-3.5 h-3.5" /> Missed
    </span>
  )
  return <span className="text-gray text-xs">N/A</span>
}

interface Props {
  rows: QPRRow[]
  selected: Set<string>
  onToggleRow: (id: string) => void
  onToggleAll: () => void
}

const HEADERS = ['Project Name', 'Developer', 'Quarter', 'Due Date', 'Filed Date', 'Status', 'Days Overdue', 'Penalty Accrued']

export default function QPRTable({ rows, selected, onToggleRow, onToggleAll }: Props) {
  const visible = rows.filter(r => r.entry.status !== 'NA')
  const missedInView = visible.filter(r => r.entry.status === 'MISSED')

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-surface border border-border rounded-sm overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface2">
              <th className="px-4 py-3 w-8">
                <input type="checkbox" className="accent-gold w-3.5 h-3.5" onChange={onToggleAll}
                  checked={missedInView.length > 0 && missedInView.every(r => selected.has(r.id))} />
              </th>
              {HEADERS.map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(row => {
              const due = getDueDate(row.quarter)
              const overdue = daysOverdue(row.quarter, row.entry)
              const pen = penalty(row.quarter, row.entry)
              const isMissed = row.entry.status === 'MISSED'
              return (
                <tr key={row.id} className={`border-b border-border last:border-0 transition-colors duration-150 ${isMissed ? 'bg-red/5 hover:bg-red/10' : ''} ${selected.has(row.id) ? 'bg-gold/5' : ''}`}>
                  <td className="px-4 py-3">{isMissed && <input type="checkbox" className="accent-gold w-3.5 h-3.5" checked={selected.has(row.id)} onChange={() => onToggleRow(row.id)} />}</td>
                  <td className="px-4 py-3"><div className="text-off-white text-sm font-medium leading-tight">{row.project_name}</div></td>
                  <td className="px-4 py-3 text-gray text-xs">{row.developer_name}</td>
                  <td className="px-4 py-3 font-mono text-gold text-xs">{row.quarter}</td>
                  <td className="px-4 py-3 text-gray text-xs whitespace-nowrap">{fmtDate(due.toISOString().split('T')[0])}</td>
                  <td className="px-4 py-3 text-xs">{row.entry.filed_date ? <span className="text-off-white">{fmtDate(row.entry.filed_date)}</span> : <span className="text-gray">—</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={row.entry.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs">{overdue > 0 ? <span className={isMissed ? 'text-red' : 'text-amber'}>+{overdue}d</span> : <span className="text-gray">—</span>}</td>
                  <td className="px-4 py-3 font-mono text-xs">{pen > 0 ? <span className="flex items-center gap-1.5 text-red"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red" /></span>{fmtInr(pen)}</span> : <span className="text-gray">—</span>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2 mb-4">
        {visible.map(row => {
          const due = getDueDate(row.quarter)
          const overdue = daysOverdue(row.quarter, row.entry)
          const pen = penalty(row.quarter, row.entry)
          const isMissed = row.entry.status === 'MISSED'
          return (
            <div key={row.id} className={`border rounded-sm p-3 ${isMissed ? 'border-red/30 bg-red/5' : 'border-border bg-surface'} ${selected.has(row.id) ? 'border-gold bg-gold/5' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2">
                  {isMissed && <input type="checkbox" className="accent-gold w-3.5 h-3.5 mt-0.5" checked={selected.has(row.id)} onChange={() => onToggleRow(row.id)} />}
                  <div>
                    <div className="text-off-white text-sm font-medium leading-tight">{row.project_name}</div>
                    <div className="text-gray text-xs mt-0.5">{row.developer_name}</div>
                  </div>
                </div>
                <div className="shrink-0"><StatusBadge status={row.entry.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-gray">Quarter: <span className="font-mono text-gold">{row.quarter}</span></div>
                <div className="text-gray">Due: <span className="text-off-white">{fmtDate(due.toISOString().split('T')[0])}</span></div>
                {row.entry.filed_date && <div className="text-gray">Filed: <span className="text-off-white">{fmtDate(row.entry.filed_date)}</span></div>}
                {overdue > 0 && <div className="text-gray">Overdue: <span className={isMissed ? 'text-red' : 'text-amber'}>+{overdue}d</span></div>}
                {pen > 0 && <div className="col-span-2 flex items-center gap-1.5"><span className="text-gray">Penalty:</span><span className="relative flex h-1.5 w-1.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red" /></span><span className="font-mono text-red">{fmtInr(pen)}</span></div>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
