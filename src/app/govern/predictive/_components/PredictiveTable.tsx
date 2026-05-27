'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROWS, actionConfig, probColor, probBarColor, riskScoreColor, type PredictiveRow } from '../_data/predictive.data'
import { DataTable, type Column } from '@/features/govern/components/DataTable'

type Row = PredictiveRow & { id: string }
const rows: Row[] = ROWS.map(r => ({ ...r, id: r.project_id }))

const columns: Column<Row>[] = [
  {
    key: 'rank',
    header: '#',
    render: r => <span className={`text-xl font-bold ${r.rank === 1 ? 'text-status-risk' : 'text-muted-foreground'}`}>{r.rank}</span>,
  },
  {
    key: 'project',
    header: 'Project',
    render: r => <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">{r.project_name}</div>,
  },
  {
    key: 'developer',
    header: 'Developer',
    render: r => <span className="text-muted-foreground text-xs">{r.developer}</span>,
  },
  {
    key: 'risk',
    header: 'Risk Score',
    render: r => <span className={`text-lg font-bold ${riskScoreColor(r.risk_score)}`}>{r.risk_score}</span>,
  },
  {
    key: 'probability',
    header: 'Default Probability',
    render: r => (
      <div className="flex items-center gap-2">
        <span className={`text-base font-bold ${probColor(r.default_probability)}`}>{r.default_probability}%</span>
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden min-w-[60px]">
          <div className={`h-full rounded-full ${probBarColor(r.default_probability)}`} style={{ width: `${r.default_probability}%` }} />
        </div>
      </div>
    ),
  },
  {
    key: 'signals',
    header: 'Key Warning Signals',
    render: r => (
      <ul className="space-y-1">
        {r.signals.map((s, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
            <span className="shrink-0 mt-0.5">·</span>{s}
          </li>
        ))}
      </ul>
    ),
  },
  {
    key: 'action',
    header: 'Recommended Action',
    render: r => {
      const ac = actionConfig(r.action)
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${ac.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ac.dotBg}`} />{ac.label}
        </span>
      )
    },
  },
  {
    key: 'nav',
    header: '',
    render: () => <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-150" />,
  },
]

function mobileCard(r: Row) {
  const ac = actionConfig(r.action)
  return (
    <Link href={`/govern/projects/${r.project_id}?tab=timeline`}
      className={`block border rounded-sm p-4 transition-colors duration-150 group ${r.action === 'ENFORCE' ? 'bg-status-risk/5 border-status-risk/30 hover:border-status-risk/50' : 'bg-card border-border hover:border-primary/50'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${r.rank === 1 ? 'text-status-risk' : 'text-muted-foreground'}`}>{r.rank}</span>
          <div>
            <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">{r.project_name}</div>
            <div className="text-muted-foreground text-xs">{r.developer}</div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] shrink-0 font-semibold ${ac.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ac.dotBg}`} />{ac.label}
        </span>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Risk Score</div>
          <div className={`text-lg font-bold ${riskScoreColor(r.risk_score)}`}>{r.risk_score}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Default Probability</span>
            <span className={`text-sm font-bold ${probColor(r.default_probability)}`}>{r.default_probability}%</span>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${probBarColor(r.default_probability)}`} style={{ width: `${r.default_probability}%` }} />
          </div>
        </div>
      </div>
      <ul className="space-y-1 border-t border-border pt-3">
        {r.signals.map((s, i) => (
          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed">
            <span className="shrink-0 mt-0.5">·</span>{s}
          </li>
        ))}
      </ul>
    </Link>
  )
}

export default function PredictiveTable() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      mobileCard={mobileCard}
      rowClassName={r => r.action === 'ENFORCE' ? 'bg-status-risk/5 hover:bg-status-risk/10 cursor-pointer' : 'hover:bg-muted/40 cursor-pointer'}
    />
  )
}
