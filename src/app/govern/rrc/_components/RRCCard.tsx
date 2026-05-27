import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { type RRCCard as RRCCardType, STATUS_CONFIG, fmtDate } from '../_data/rrc.data'

interface Props {
  rrc: RRCCardType
}

export default function RRCCard({ rrc }: Props) {
  const cfg = STATUS_CONFIG[rrc.status]

  return (
    <div className={`bg-card border rounded-sm p-5 ${
      rrc.status === 'ISSUED' && rrc.alert ? 'border-status-risk/30' :
      rrc.status === 'RECOVERED' ? 'border-status-compliant/20' :
      'border-border'
    }`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-primary">{rrc.id}</span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${cfg.textColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotBg}`} />
              {cfg.label}
            </span>
            {rrc.alert && (
              <span className="flex items-center gap-1 text-[10px] text-status-risk">
                <AlertTriangle className="w-3 h-3" />
                {rrc.alert}
              </span>
            )}
          </div>
          <div className="text-foreground text-sm font-medium">{rrc.project_name}</div>
          <div className="text-muted-foreground text-xs">{rrc.developer}</div>
        </div>
        <div className="text-right shrink-0">
          <div className={`font-syne text-2xl font-bold ${rrc.status === 'RECOVERED' ? 'text-status-compliant' : 'text-status-risk'}`}>
            ₹{rrc.amount_lakh.toFixed(2)} L
          </div>
          <div className="text-muted-foreground text-[10px]">Total Amount</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Recovery Progress</span>
          <span className={`font-mono text-xs font-bold ${rrc.status === 'RECOVERED' ? 'text-status-compliant' : 'text-muted-foreground'}`}>
            {rrc.progress_pct}%
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`} style={{ width: `${rrc.progress_pct}%` }} />
        </div>
        {rrc.status === 'RECOVERED' && (
          <div className="text-status-compliant text-[10px] mt-1">₹{rrc.recovered_lakh.toFixed(2)} Lakh recovered</div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Issued Date</div>
          <div className="text-xs text-foreground">{fmtDate(rrc.issued_date)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">Linked Notice</div>
          <div className="font-mono text-xs text-primary/50">{rrc.linked_notice}</div>
        </div>
        <div className="sm:text-right">
          <Link href={`/govern/projects/${rrc.project_id}`} className="text-xs text-muted-foreground hover:text-primary transition-colors duration-150">
            View Project →
          </Link>
        </div>
      </div>
    </div>
  )
}
