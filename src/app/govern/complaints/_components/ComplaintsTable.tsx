'use client'

import Link from 'next/link'
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { Complaint } from '../_data/complaints.data'
import { ANON } from '../_data/complaints.data'
import { daysPending, fmtDate, statusBadgeColor, statusBadgeDot, statusLabel } from '../_data/complaints.utils'
import ComplaintExpandedDetail from './ComplaintExpandedDetail'

interface Props {
  complaints: Complaint[]
  expandedId: string | null
  onToggle: (id: string) => void
  onSchedule: (id: string) => void
  onOrder: (id: string) => void
}

export default function ComplaintsTable({ complaints, expandedId, onToggle, onSchedule, onOrder }: Props) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-card border border-border rounded-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              {['Ref Number', 'Complainant', 'Project', 'Nature', 'Date Filed', 'Days Pending', 'Status', 'Next Hearing', 'Actions', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.flatMap(c => {
              const days = daysPending(c.filed_date, c.resolution_date ?? undefined)
              const isExpanded = expandedId === c.id
              const mainRow = (
                <tr key={c.id} className={`border-b border-border cursor-pointer hover:bg-muted/60 transition-colors duration-150 ${isExpanded ? 'bg-muted/60' : ''}`} onClick={() => onToggle(c.id)}>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-primary">{c.id}</span></td>
                  <td className="px-4 py-3 text-foreground text-xs">{ANON[c.id]}</td>
                  <td className="px-4 py-3">
                    <Link href={`/govern/projects/${c.project_id}`} onClick={e => e.stopPropagation()} className="text-xs text-foreground hover:text-primary transition-colors duration-150">{c.project_name}</Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{c.category}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(c.filed_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-xs font-bold ${days > 60 && c.status === 'PENDING' ? 'text-status-risk' : 'text-foreground'}`}>{days}d</span>
                      {days > 60 && c.status === 'PENDING' && <AlertCircle className="w-3.5 h-3.5 text-status-risk shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${statusBadgeColor(c)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadgeDot(c)}`} />
                      {statusLabel(c)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{fmtDate(c.hearing_date)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {c.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => onSchedule(c.id)} className="text-[10px] px-2 py-1 bg-muted text-primary border border-primary/20 rounded-sm hover:bg-primary/10 transition-colors duration-150 whitespace-nowrap">Schedule</button>
                        <button onClick={() => onOrder(c.id)} className="text-[10px] px-2 py-1 bg-muted text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors duration-150 whitespace-nowrap">Record Order</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}</td>
                </tr>
              )
              if (!isExpanded) return [mainRow]
              return [mainRow, (
                <tr key={`${c.id}-detail`} className="border-b border-border bg-muted/40">
                  <td colSpan={10} className="px-6 py-4"><ComplaintExpandedDetail c={c} /></td>
                </tr>
              )]
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3 mb-6">
        {complaints.map(c => {
          const days = daysPending(c.filed_date, c.resolution_date ?? undefined)
          const isExpanded = expandedId === c.id
          return (
            <div key={c.id} className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="p-4 cursor-pointer" onClick={() => onToggle(c.id)}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-mono text-xs text-primary mb-0.5">{c.id}</div>
                    <div className="text-foreground text-sm font-medium">{ANON[c.id]}</div>
                    <div className="text-muted-foreground text-xs">{c.project_name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium shrink-0 ${statusBadgeColor(c)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadgeDot(c)}`} />
                      {statusLabel(c)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Nature</div><div className="text-xs text-foreground">{c.category}</div></div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Days</div>
                    <div className="flex items-center gap-1">
                      <span className={`font-mono text-xs font-bold ${days > 60 && c.status === 'PENDING' ? 'text-status-risk' : 'text-foreground'}`}>{days}d</span>
                      {days > 60 && c.status === 'PENDING' && <AlertCircle className="w-3 h-3 text-status-risk" />}
                    </div>
                  </div>
                  <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Next Hearing</div><div className="text-xs text-foreground">{fmtDate(c.hearing_date)}</div></div>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <p className="text-foreground text-xs leading-relaxed">{c.description}</p>
                  {c.resolution_summary && <div className="border-l-2 border-status-compliant pl-3"><p className="text-status-compliant text-xs leading-relaxed">{c.resolution_summary}</p></div>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>₹{c.amount_at_risk_lakh} Lakh at risk</span>
                    <span className="truncate ml-2">{c.assigned_officer}</span>
                  </div>
                  {c.status === 'PENDING' && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => onSchedule(c.id)} className="flex-1 text-xs py-1.5 bg-muted text-primary border border-primary/20 rounded-sm hover:bg-primary/10 transition-colors duration-150">Schedule Hearing</button>
                      <button onClick={() => onOrder(c.id)} className="flex-1 text-xs py-1.5 bg-muted text-muted-foreground border border-border rounded-sm hover:text-foreground transition-colors duration-150">Record Order</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
