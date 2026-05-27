import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  type Project, getLastQPR,
  qprClasses, qprLabel, certClasses, riskScoreColor, riskBarColor,
} from '../_data/project-registry.data'
import { StatusBadge } from '@/features/govern/components/StatusBadge'

interface Props {
  filtered: Project[]
  totalCount: number
  lastQuarter: string
}

export default function ProjectTable({ filtered, totalCount, lastQuarter }: Props) {
  if (filtered.length === 0) {
    return (
      <>
        <div className="hidden md:block bg-card border border-border rounded-sm py-12 text-center text-muted-foreground text-sm">No projects match your search.</div>
        <div className="md:hidden text-center text-muted-foreground text-sm py-12 bg-card border border-border rounded-sm">No projects match your search.</div>
      </>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Project', 'Developer', 'Location', 'Type', 'Status', 'Risk Score', `QPR ${lastQuarter}`, 'Certificate', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const qpr = getLastQPR(p.id)
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-background transition-colors duration-150 cursor-pointer group"
                  onClick={() => window.location.href = `/govern/projects/${p.id}`}>
                  <td className="px-4 py-3.5">
                    <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150 leading-tight">{p.name}</div>
                    <div className="font-mono text-muted-foreground text-[10px] mt-0.5 truncate max-w-[180px]">{p.rera}</div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground text-sm">{p.developer_name}</td>
                  <td className="px-4 py-3.5 text-muted-foreground text-sm whitespace-nowrap">{p.location}</td>
                  <td className="px-4 py-3.5"><span className="text-xs text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-sm">{p.type}</span></td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={p.status} className="whitespace-nowrap" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${riskScoreColor(p.risk_score)}`}>{p.risk_score}</span>
                      <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${riskBarColor(p.risk_score)}`} style={{ width: `${p.risk_score}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className={`text-sm font-medium ${qprClasses(qpr)}`}>{qprLabel(qpr)}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-medium ${certClasses(p.certificate_status)}`}>
                      {p.certificate_status === 'NONE' ? 'None' : p.certificate_status.charAt(0) + p.certificate_status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5"><ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-150" /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(p => {
          const qpr = getLastQPR(p.id)
          return (
            <Link key={p.id} href={`/govern/projects/${p.id}`}
              className="block bg-card border border-border hover:border-primary rounded-sm p-4 transition-colors duration-150 group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150 leading-tight mb-0.5">{p.name}</div>
                  <div className="text-muted-foreground text-xs">{p.developer_name}</div>
                  <div className="text-muted-foreground text-xs">{p.location}</div>
                </div>
                <StatusBadge status={p.status} className="shrink-0 whitespace-nowrap" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
                <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Risk Score</div><div className={`text-sm font-bold ${riskScoreColor(p.risk_score)}`}>{p.risk_score}</div></div>
                <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">QPR</div><div className={`text-sm font-medium ${qprClasses(qpr)}`}>{qprLabel(qpr)}</div></div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Cert</div>
                  <div className={`text-sm font-medium ${certClasses(p.certificate_status)}`}>
                    {p.certificate_status === 'NONE' ? 'None' : p.certificate_status.charAt(0) + p.certificate_status.slice(1).toLowerCase()}
                  </div>
                </div>
              </div>
              {p.complaints_pending > 0 && <div className="mt-2 text-xs text-status-caution">{p.complaints_pending} complaint{p.complaints_pending > 1 ? 's' : ''} pending</div>}
            </Link>
          )
        })}
      </div>

      {filtered.length > 0 && (
        <div className="mt-3 text-muted-foreground text-xs text-right">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}{filtered.length < totalCount ? ' shown (filtered)' : ''}
        </div>
      )}
    </>
  )
}
