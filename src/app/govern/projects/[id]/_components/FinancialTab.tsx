import type { Project } from '../_data/project-detail.types'
import { ESCROW, ESCROW_STATUS_CLASS } from '../_data/project-detail.data'
import { fmtCrore, fmtDate } from '../_data/project-detail.utils'

interface Props { project: Project }

export default function FinancialTab({ project }: Props) {
  const escrow = ESCROW[project.id]
  const unitsPct = Math.round((project.units_sold / project.total_units) * 100)
  const statusTextColor = ESCROW_STATUS_CLASS[escrow.status].split(' ')[0]

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Escrow Account — Kaveri 2.0</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-muted border border-border rounded-sm p-4 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Balance</div>
            <div className={`text-2xl font-bold ${statusTextColor}`}>{fmtCrore(escrow.balance_crore)}</div>
          </div>
          <div className="bg-muted border border-border rounded-sm p-4 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Total Collected</div>
            <div className="text-2xl font-bold text-foreground">{fmtCrore(escrow.collected_crore)}</div>
          </div>
          <div className="bg-muted border border-border rounded-sm p-4 text-center">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Escrow %</div>
            <div className={`text-2xl font-bold ${statusTextColor}`}>{escrow.pct}%</div>
            <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] ${statusTextColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${escrow.status === 'HEALTHY' ? 'bg-status-compliant' : escrow.status === 'CAUTION' ? 'bg-status-caution' : 'bg-status-risk'}`} />
              {escrow.status}
            </span>
          </div>
        </div>

        <div className="bg-muted border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-xs">Escrow utilization</span>
            <span className="text-muted-foreground text-xs">Last withdrawal: {fmtDate(escrow.last_withdrawal)}</span>
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${escrow.status === 'HEALTHY' ? 'bg-status-compliant' : escrow.status === 'CAUTION' ? 'bg-status-caution' : 'bg-status-risk'}`}
              style={{ width: `${escrow.pct}%` }}
            />
          </div>
          <div className={`mt-2 text-xs border-l-2 pl-2 ${escrow.status === 'HEALTHY' ? 'border-status-compliant text-muted-foreground' : escrow.status === 'CAUTION' ? 'border-status-caution text-muted-foreground' : 'border-status-risk text-status-risk'}`}>
            {escrow.note}
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-3">Project Financials</div>
        <div className="space-y-2">
          {[
            { label: 'Declared Project Cost', value: fmtCrore(project.declared_cost_crore) },
            { label: 'Units Sold',             value: `${project.units_sold} / ${project.total_units} (${unitsPct}%)` },
            { label: 'Extensions Granted',     value: project.extensions > 0 ? `${project.extensions}` : 'None' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-border">
              <span className="text-muted-foreground text-sm">{label}</span>
              <span className="text-foreground text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
