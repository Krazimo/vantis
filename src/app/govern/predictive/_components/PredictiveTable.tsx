import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROWS, actionConfig, probColor, probBarColor, riskScoreColor } from '../_data/predictive.data'

const HEADERS = ['#', 'Project', 'Developer', 'Risk Score', 'Default Probability', 'Key Warning Signals', 'Recommended Action']

export default function PredictiveTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block bg-surface border border-border rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {HEADERS.map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">{h}</th>
              ))}
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => {
              const ac = actionConfig(row.action)
              return (
                <tr key={row.project_id}
                  className={`border-b border-border last:border-0 transition-colors duration-150 group cursor-pointer ${row.action === 'ENFORCE' ? 'bg-red/5 hover:bg-red/10' : 'hover:bg-surface2'}`}
                  onClick={() => window.location.href = `/govern/projects/${row.project_id}?tab=timeline`}>
                  <td className="px-4 py-4"><span className={`font-syne text-xl font-bold ${row.rank === 1 ? 'text-red' : 'text-gray'}`}>{row.rank}</span></td>
                  <td className="px-4 py-4"><div className="text-off-white text-sm font-medium group-hover:text-gold transition-colors duration-150">{row.project_name}</div></td>
                  <td className="px-4 py-4 text-gray text-xs">{row.developer}</td>
                  <td className="px-4 py-4"><span className={`font-mono text-lg font-bold ${riskScoreColor(row.risk_score)}`}>{row.risk_score}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-base font-bold ${probColor(row.default_probability)}`}>{row.default_probability}%</span>
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden min-w-[60px]">
                        <div className={`h-full rounded-full ${probBarColor(row.default_probability)}`} style={{ width: `${row.default_probability}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1">
                      {row.signals.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray leading-relaxed"><span className="shrink-0 mt-0.5 text-gray-light">·</span>{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ac.textColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ac.dotBg}`} />{ac.label}
                    </span>
                  </td>
                  <td className="px-4 py-4"><ChevronRight className="w-4 h-4 text-gray group-hover:text-gold transition-colors duration-150" /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {ROWS.map(row => {
          const ac = actionConfig(row.action)
          return (
            <Link key={row.project_id} href={`/govern/projects/${row.project_id}?tab=timeline`}
              className={`block border rounded-sm p-4 transition-colors duration-150 group ${row.action === 'ENFORCE' ? 'bg-red/5 border-red/30 hover:border-red/50' : 'bg-surface border-border hover:border-gold/50'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`font-syne text-2xl font-bold ${row.rank === 1 ? 'text-red' : 'text-gray'}`}>{row.rank}</span>
                  <div>
                    <div className="text-off-white text-sm font-medium group-hover:text-gold transition-colors duration-150">{row.project_name}</div>
                    <div className="text-gray text-xs">{row.developer}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] shrink-0 font-semibold ${ac.textColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ac.dotBg}`} />{ac.label}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Risk Score</div>
                  <div className={`font-mono text-lg font-bold ${riskScoreColor(row.risk_score)}`}>{row.risk_score}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray uppercase tracking-wide">Default Probability</span>
                    <span className={`font-mono text-sm font-bold ${probColor(row.default_probability)}`}>{row.default_probability}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${probBarColor(row.default_probability)}`} style={{ width: `${row.default_probability}%` }} />
                  </div>
                </div>
              </div>
              <ul className="space-y-1 border-t border-border pt-3">
                {row.signals.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray leading-relaxed"><span className="shrink-0 mt-0.5 text-gray-light">·</span>{s}</li>
                ))}
              </ul>
            </Link>
          )
        })}
      </div>
    </>
  )
}
