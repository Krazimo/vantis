import Link from 'next/link'
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { scoreColor, scoreBorder, barColor, statusColor, statusDot, type Developer } from '../_data/risk.data'

interface Props {
  dev: Developer
  expanded: boolean
  onToggle: () => void
}

export default function DeveloperCard({ dev, expanded, onToggle }: Props) {
  return (
    <div className={`bg-card border rounded-sm overflow-hidden ${scoreBorder(dev.score)}`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-syne text-base font-semibold text-foreground mb-0.5">{dev.name}</h2>
            <div className="flex flex-wrap gap-1.5">
              {dev.projects.map(p => (
                <span key={p.id} className={`inline-flex items-center gap-1.5 text-[10px] ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`font-syne text-5xl font-bold leading-none ${scoreColor(dev.score)}`}>{dev.score}</div>
            <div className="text-muted-foreground text-[10px] mt-1 uppercase tracking-widest">Trust Score</div>
          </div>
        </div>

        {dev.enforcement && (
          <div className="flex items-start gap-2 bg-status-risk/5 border border-status-risk/20 rounded-sm px-3 py-2 mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-status-risk shrink-0 mt-0.5" />
            <p className="text-status-risk text-xs leading-snug">{dev.enforcement}</p>
          </div>
        )}

        <div className="space-y-2">
          {dev.components.map(c => (
            <div key={c.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">{c.label}</span>
                <span className={`font-mono text-[10px] font-bold ${barColor(c.value).replace('bg-', 'text-')}`}>{c.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${barColor(c.value)}`} style={{ width: `${c.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 border-t border-border bg-muted/40 hover:bg-muted transition-colors duration-150 text-xs text-muted-foreground hover:text-foreground">
        <span>{expanded ? 'Hide projects' : 'View projects'}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-2">
          {dev.projects.map(p => (
            <Link key={p.id} href={`/govern/projects/${p.id}`} className="flex items-center justify-between group py-1.5">
              <span className="text-xs text-foreground group-hover:text-primary transition-colors duration-150">{p.name}</span>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-[10px] ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />{p.status}
                </span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors duration-150" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
