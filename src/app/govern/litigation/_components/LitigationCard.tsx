import Link from 'next/link'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { daysSince, daysUntil, fmtDate, getSurveyNumbers, leftBorder, caseTypeColor, caseTypeDot, severityTextColor, severityDot, type LitigationItem } from '../_data/litigation-watchlist.data'

interface Props {
  item: LitigationItem
}

export default function LitigationCard({ item: l }: Props) {
  const since  = daysSince(l.filed_date)
  const until  = daysUntil(l.next_hearing)
  const survey = getSurveyNumbers(l.project_id)

  return (
    <div className={`bg-card border border-border rounded-sm overflow-hidden ${leftBorder(l)}`}>
      <div className="px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${caseTypeColor(l.type)}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${caseTypeDot(l.type)}`} />
                {l.type.toUpperCase()}
              </span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${severityTextColor(l.severity)}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDot(l.severity)}`} />
                {l.severity}
              </span>
              <span className="font-mono text-primary text-[10px]">{l.case_number}</span>
            </div>
            <div className="text-foreground text-sm font-medium leading-snug mb-0.5">{l.cause}</div>
            <div className="text-muted-foreground text-xs">{l.plaintiff}</div>
          </div>
          <Link href={`/govern/projects/${l.project_id}`}
            className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground border border-border hover:border-primary hover:text-primary px-3 py-1.5 rounded-sm transition-colors duration-150 group">
            View Project <ChevronRight className="w-3 h-3 group-hover:text-primary" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Court</div><div className="text-foreground text-xs leading-snug">{l.court}</div></div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Project</div>
            <div className="text-foreground text-xs leading-snug">{l.project_name}</div>
            <div className="text-muted-foreground text-[10px]">{l.developer_name}</div>
          </div>
          <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Survey Nos.</div><div className="font-mono text-foreground text-xs">{survey}</div></div>
          {l.relief_sought_crore && (
            <div><div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Relief Sought</div><div className="font-mono text-status-risk text-xs font-bold">₹{l.relief_sought_crore} Cr</div></div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 shrink-0" />
            Filed {fmtDate(l.filed_date)} <span className="text-muted-foreground">({since} days ago)</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className={`w-3 h-3 shrink-0 ${until <= 14 ? 'text-status-caution' : 'text-muted-foreground'}`} />
            <span className={until <= 14 ? 'text-status-caution' : 'text-muted-foreground'}>
              Next hearing: {fmtDate(l.next_hearing)}{until >= 0 ? ` (in ${until}d)` : ' (overdue)'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
