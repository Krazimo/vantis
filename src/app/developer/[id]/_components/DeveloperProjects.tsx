import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { type Project, type Tx, scoreColor, barColor, statusColor, statusDot, fmtDate } from '../_data/developer.data'

interface Props {
  projects: Project[]
  tx: Tx
}

export default function DeveloperProjects({ projects, tx }: Props) {
  return (
    <div className="space-y-3">
      {projects.map(p => {
        const pct = Math.round((p.units_sold / p.total_units) * 100)
        return (
          <Link
            key={p.id}
            href={`/project/${p.id}`}
            className="block bg-card border border-border rounded-sm p-4 hover:border-primary/50 transition-colors duration-150 group"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">
                  {p.name}
                </div>
                <div className="text-muted-foreground text-xs">{p.location}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />
                  {p.status}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-150" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide mb-0.5">{tx.riskScore}</div>
                <span className={`font-bold ${scoreColor(p.risk_score)}`}>{p.risk_score}</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide mb-0.5">{tx.units}</div>
                <span className="text-foreground">{p.units_sold} / {p.total_units}</span>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide mb-0.5">{tx.due}</div>
                <span className="text-foreground">{fmtDate(p.completion_date)}</span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${barColor(p.risk_score)}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{pct}% sold</div>
          </Link>
        )
      })}
    </div>
  )
}
