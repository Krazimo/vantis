import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import {
  type Project, getLastQPR,
  statusColor, statusDot, qprClasses, qprLabel, certClasses, riskScoreColor, riskBarColor,
} from '../_data/project-registry.data'

interface Props {
  filtered: Project[]
  totalCount: number
  lastQuarter: string
}

export default function ProjectTable({ filtered, totalCount, lastQuarter }: Props) {
  if (filtered.length === 0) {
    return (
      <>
        <div className="hidden md:block bg-surface border border-border rounded-sm py-12 text-center text-gray text-sm">No projects match your search.</div>
        <div className="md:hidden text-center text-gray text-sm py-12 bg-surface border border-border rounded-sm">No projects match your search.</div>
      </>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-surface border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Project', 'Developer', 'Location', 'Type', 'Status', 'Risk Score', `QPR ${lastQuarter}`, 'Certificate', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray">{h}</th>
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
                    <div className="text-off-white text-sm font-medium group-hover:text-gold transition-colors duration-150 leading-tight">{p.name}</div>
                    <div className="font-mono text-gray text-[10px] mt-0.5 truncate max-w-[180px]">{p.rera}</div>
                  </td>
                  <td className="px-4 py-3.5 text-gray text-sm">{p.developer_name}</td>
                  <td className="px-4 py-3.5 text-gray text-sm whitespace-nowrap">{p.location}</td>
                  <td className="px-4 py-3.5"><span className="text-xs text-gray-light bg-surface2 border border-border px-2 py-0.5 rounded-sm">{p.type}</span></td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs whitespace-nowrap ${statusColor(p.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />{p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${riskScoreColor(p.risk_score)}`}>{p.risk_score}</span>
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
                  <td className="px-4 py-3.5"><ChevronRight className="w-4 h-4 text-gray group-hover:text-gold transition-colors duration-150" /></td>
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
              className="block bg-surface border border-border hover:border-gold rounded-sm p-4 transition-colors duration-150 group">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-off-white text-sm font-medium group-hover:text-gold transition-colors duration-150 leading-tight mb-0.5">{p.name}</div>
                  <div className="text-gray text-xs">{p.developer_name}</div>
                  <div className="text-gray text-xs">{p.location}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs shrink-0 whitespace-nowrap ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />{p.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
                <div><div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Risk Score</div><div className={`font-mono text-sm font-bold ${riskScoreColor(p.risk_score)}`}>{p.risk_score}</div></div>
                <div><div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">QPR</div><div className={`text-sm font-medium ${qprClasses(qpr)}`}>{qprLabel(qpr)}</div></div>
                <div>
                  <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Cert</div>
                  <div className={`text-sm font-medium ${certClasses(p.certificate_status)}`}>
                    {p.certificate_status === 'NONE' ? 'None' : p.certificate_status.charAt(0) + p.certificate_status.slice(1).toLowerCase()}
                  </div>
                </div>
              </div>
              {p.complaints_pending > 0 && <div className="mt-2 text-xs text-amber">{p.complaints_pending} complaint{p.complaints_pending > 1 ? 's' : ''} pending</div>}
            </Link>
          )
        })}
      </div>

      {filtered.length > 0 && (
        <div className="mt-3 text-gray text-xs text-right">
          {filtered.length} project{filtered.length !== 1 ? 's' : ''}{filtered.length < totalCount ? ' shown (filtered)' : ''}
        </div>
      )}
    </>
  )
}
