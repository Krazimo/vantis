'use client'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ROWS, tierConfig, type HomebuyerRow } from '../_data/homebuyer.data'
import { DataTable, type Column } from '@/features/govern/components/DataTable'
import { StatusBadge } from '@/features/govern/components/StatusBadge'

type Row = HomebuyerRow & { id: string }

const rows: Row[] = ROWS.map(r => ({ ...r, id: r.project_id }))

const columns: Column<Row>[] = [
  {
    key: 'project',
    header: 'Project Name',
    render: r => <div className="text-foreground text-sm font-medium">{r.project_name}</div>,
  },
  {
    key: 'developer',
    header: 'Developer',
    render: r => <span className="text-muted-foreground text-xs">{r.developer}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: r => <StatusBadge status={r.status} />,
  },
  {
    key: 'homebuyers',
    header: 'Homebuyers',
    render: r => {
      const tc = tierConfig(r.tier)
      return <span className={`text-lg font-bold ${tc.textColor}`}>{r.homebuyers.toLocaleString('en-IN')}</span>
    },
  },
  {
    key: 'capital',
    header: 'Capital at Risk',
    render: r => {
      const tc = tierConfig(r.tier)
      return <span className={`font-mono text-sm font-bold ${tc.textColor}`}>₹{r.capital_crore} Cr</span>
    },
  },
  {
    key: 'possession',
    header: 'Possession Status',
    render: r => {
      const tc = tierConfig(r.tier)
      return <span className={`text-xs leading-snug ${tc.textColor}`}>{r.possession_status}</span>
    },
  },
  {
    key: 'tier',
    header: 'Alert Tier',
    render: r => {
      const tc = tierConfig(r.tier)
      return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${tc.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dotBg}`} />{tc.label}
        </span>
      )
    },
  },
  {
    key: 'action',
    header: '',
    render: r => (
      <Link href={`/govern/projects/${r.project_id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150 whitespace-nowrap">
        View <ChevronRight className="w-3 h-3" />
      </Link>
    ),
  },
]

function mobileCard(r: Row) {
  const tc = tierConfig(r.tier)
  return (
    <div className={`border rounded-sm p-4 ${r.tier === 'CRITICAL' ? 'border-red/30 bg-red/5' : r.tier === 'WATCH' ? 'border-amber/30 bg-amber/5' : 'border-border bg-card'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-foreground text-sm font-medium">{r.project_name}</div>
          <div className="text-muted-foreground text-xs">{r.developer}</div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold shrink-0 ${tc.textColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tc.dotBg}`} />{tc.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Homebuyers</div>
          <div className={`text-xl font-bold ${tc.textColor}`}>{r.homebuyers.toLocaleString('en-IN')}</div>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Capital at Risk</div>
          <div className={`font-mono text-sm font-bold ${tc.textColor}`}>₹{r.capital_crore} Cr</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className={`text-xs ${tc.textColor}`}>{r.possession_status}</span>
        <Link href={`/govern/projects/${r.project_id}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors duration-150">
          View Project <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default function HomebuyerTable() {
  return (
    <DataTable
      columns={columns}
      rows={rows}
      mobileCard={mobileCard}
      rowClassName={r => tierConfig(r.tier).row}
    />
  )
}
