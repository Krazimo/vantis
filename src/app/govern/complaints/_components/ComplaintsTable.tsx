'use client'

import Link from 'next/link'
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { Complaint } from '../_data/complaints.data'
import { ANON } from '../_data/complaints.data'
import { daysPending, fmtDate, statusBadgeColor, statusBadgeDot, statusLabel } from '../_data/complaints.utils'

interface Props {
  complaints: Complaint[]
  expandedId: string | null
  onToggle: (id: string) => void
  onSchedule: (id: string) => void
  onOrder: (id: string) => void
}

function ExpandedDetail({ c }: { c: Complaint }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="text-[10px] uppercase tracking-widest text-gray mb-1">Complaint Description</div>
        <p className="text-off-white text-xs leading-relaxed mb-4">{c.description}</p>
        {c.resolution_summary && (
          <div className="border-l-2 border-green pl-3">
            <div className="text-[10px] uppercase tracking-widest text-gray mb-1">Resolution</div>
            <p className="text-green text-xs leading-relaxed">{c.resolution_summary}</p>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray mb-1">Amount at Risk</div>
          <div className="font-mono text-sm font-bold text-amber">₹{c.amount_at_risk_lakh} Lakh</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-gray mb-1">Assigned Officer</div>
          <div className="text-xs text-off-white">{c.assigned_officer}</div>
        </div>
        {c.resolution_date && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray mb-1">Resolved On</div>
            <div className="text-xs text-green">{fmtDate(c.resolution_date)}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ComplaintsTable({ complaints, expandedId, onToggle, onSchedule, onOrder }: Props) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-surface border border-border rounded-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {['Ref Number', 'Complainant', 'Project', 'Nature', 'Date Filed', 'Days Pending', 'Status', 'Next Hearing', 'Actions', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {complaints.flatMap(c => {
              const days = daysPending(c.filed_date, c.resolution_date)
              const isExpanded = expandedId === c.id
              const mainRow = (
                <tr key={c.id} className={`border-b border-border cursor-pointer hover:bg-surface2/60 transition-colors duration-150 ${isExpanded ? 'bg-surface2/60' : ''}`} onClick={() => onToggle(c.id)}>
                  <td className="px-4 py-3"><span className="font-mono text-xs text-gold">{c.id}</span></td>
                  <td className="px-4 py-3 text-off-white text-xs">{ANON[c.id]}</td>
                  <td className="px-4 py-3">
                    <Link href={`/govern/projects/${c.project_id}`} onClick={e => e.stopPropagation()} className="text-xs text-off-white hover:text-gold transition-colors duration-150">{c.project_name}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray text-xs">{c.category}</td>
                  <td className="px-4 py-3 text-gray text-xs whitespace-nowrap">{fmtDate(c.filed_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono text-xs font-bold ${days > 60 && c.status === 'PENDING' ? 'text-red' : 'text-off-white'}`}>{days}d</span>
                      {days > 60 && c.status === 'PENDING' && <AlertCircle className="w-3.5 h-3.5 text-red shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${statusBadgeColor(c)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadgeDot(c)}`} />
                      {statusLabel(c)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray text-xs whitespace-nowrap">{fmtDate(c.hearing_date)}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {c.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => onSchedule(c.id)} className="text-[10px] px-2 py-1 bg-surface2 text-gold border border-gold/20 rounded-sm hover:bg-gold/10 transition-colors duration-150 whitespace-nowrap">Schedule</button>
                        <button onClick={() => onOrder(c.id)} className="text-[10px] px-2 py-1 bg-surface2 text-gray border border-border rounded-sm hover:text-off-white transition-colors duration-150 whitespace-nowrap">Record Order</button>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{isExpanded ? <ChevronUp className="w-4 h-4 text-gray" /> : <ChevronDown className="w-4 h-4 text-gray" />}</td>
                </tr>
              )
              if (!isExpanded) return [mainRow]
              return [mainRow, (
                <tr key={`${c.id}-detail`} className="border-b border-border bg-surface2/40">
                  <td colSpan={10} className="px-6 py-4"><ExpandedDetail c={c} /></td>
                </tr>
              )]
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3 mb-6">
        {complaints.map(c => {
          const days = daysPending(c.filed_date, c.resolution_date)
          const isExpanded = expandedId === c.id
          return (
            <div key={c.id} className="bg-surface border border-border rounded-sm overflow-hidden">
              <div className="p-4 cursor-pointer" onClick={() => onToggle(c.id)}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-mono text-xs text-gold mb-0.5">{c.id}</div>
                    <div className="text-off-white text-sm font-medium">{ANON[c.id]}</div>
                    <div className="text-gray text-xs">{c.project_name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium shrink-0 ${statusBadgeColor(c)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadgeDot(c)}`} />
                      {statusLabel(c)}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray" /> : <ChevronDown className="w-4 h-4 text-gray" />}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Nature</div><div className="text-xs text-off-white">{c.category}</div></div>
                  <div>
                    <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Days</div>
                    <div className="flex items-center gap-1">
                      <span className={`font-mono text-xs font-bold ${days > 60 && c.status === 'PENDING' ? 'text-red' : 'text-off-white'}`}>{days}d</span>
                      {days > 60 && c.status === 'PENDING' && <AlertCircle className="w-3 h-3 text-red" />}
                    </div>
                  </div>
                  <div><div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Next Hearing</div><div className="text-xs text-off-white">{fmtDate(c.hearing_date)}</div></div>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                  <p className="text-off-white text-xs leading-relaxed">{c.description}</p>
                  {c.resolution_summary && <div className="border-l-2 border-green pl-3"><p className="text-green text-xs leading-relaxed">{c.resolution_summary}</p></div>}
                  <div className="flex items-center justify-between text-xs text-gray">
                    <span>₹{c.amount_at_risk_lakh} Lakh at risk</span>
                    <span className="truncate ml-2">{c.assigned_officer}</span>
                  </div>
                  {c.status === 'PENDING' && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => onSchedule(c.id)} className="flex-1 text-xs py-1.5 bg-surface2 text-gold border border-gold/20 rounded-sm hover:bg-gold/10 transition-colors duration-150">Schedule Hearing</button>
                      <button onClick={() => onOrder(c.id)} className="flex-1 text-xs py-1.5 bg-surface2 text-gray border border-border rounded-sm hover:text-off-white transition-colors duration-150">Record Order</button>
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
