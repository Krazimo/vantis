import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROWS, tierConfig, statusColor, statusDot } from '../_data/homebuyer.data'

const HEADERS = ['Project Name', 'Developer', 'Status', 'Homebuyers', 'Capital at Risk', 'Possession Status', 'Alert Tier', '']

export default function HomebuyerTable() {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-surface border border-border rounded-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface2">
              {HEADERS.map(h => <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => {
              const tc = tierConfig(row.tier)
              const tierClass = row.tier === 'CRITICAL' ? 'text-red' : row.tier === 'WATCH' ? 'text-amber' : 'text-off-white'
              return (
                <tr key={row.project_id} className={`border-b border-border last:border-0 group ${tc.row}`}>
                  <td className="px-4 py-4"><div className="text-off-white text-sm font-medium">{row.project_name}</div></td>
                  <td className="px-4 py-4 text-gray text-xs">{row.developer}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor(row.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(row.status)}`} />{row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4"><span className={`font-syne text-lg font-bold ${tierClass}`}>{row.homebuyers.toLocaleString('en-IN')}</span></td>
                  <td className="px-4 py-4"><span className={`font-mono text-sm font-bold ${tierClass}`}>₹{row.capital_crore} Cr</span></td>
                  <td className="px-4 py-4"><span className={`text-xs leading-snug ${tierClass}`}>{row.possession_status}</span></td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${tc.textColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dotBg}`} />{tc.label}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/govern/projects/${row.project_id}`} className="flex items-center gap-1 text-xs text-gray hover:text-gold transition-colors duration-150 whitespace-nowrap group/link">
                      View <ChevronRight className="w-3 h-3 group-hover/link:text-gold" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3 mb-6">
        {ROWS.map(row => {
          const tc = tierConfig(row.tier)
          const tierClass = row.tier === 'CRITICAL' ? 'text-red' : row.tier === 'WATCH' ? 'text-amber' : 'text-off-white'
          return (
            <div key={row.project_id} className={`border rounded-sm p-4 ${row.tier === 'CRITICAL' ? 'border-red/30 bg-red/5' : row.tier === 'WATCH' ? 'border-amber/30 bg-amber/5' : 'border-border bg-surface'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="text-off-white text-sm font-medium">{row.project_name}</div>
                  <div className="text-gray text-xs">{row.developer}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold shrink-0 ${tc.textColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dotBg}`} />{tc.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Homebuyers</div>
                  <div className={`font-syne text-xl font-bold ${tierClass}`}>{row.homebuyers.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray uppercase tracking-wide mb-0.5">Capital at Risk</div>
                  <div className={`font-mono text-sm font-bold ${tierClass}`}>₹{row.capital_crore} Cr</div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className={`text-xs ${tierClass}`}>{row.possession_status}</span>
                <Link href={`/govern/projects/${row.project_id}`} className="flex items-center gap-1 text-xs text-gray hover:text-gold transition-colors duration-150">
                  View Project <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
