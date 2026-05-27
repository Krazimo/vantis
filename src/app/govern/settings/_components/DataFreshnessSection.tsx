import { Database, CheckCircle2, Clock } from 'lucide-react'
import { DATA_SOURCES } from '../_data/settings.data'

export default function DataFreshnessSection() {
  return (
    <div className="bg-card border border-border rounded-sm p-5 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Data Freshness</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Data Source', 'Last Sync', 'Frequency', 'Status'].map(h => (
                <th key={h} className="text-left pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DATA_SOURCES.map((src, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2.5 text-xs text-foreground pr-4">{src.name}</td>
                <td className="py-2.5 text-xs text-muted-foreground pr-4 whitespace-nowrap">{src.last_sync}</td>
                <td className="py-2.5 text-xs text-muted-foreground pr-4 whitespace-nowrap">{src.frequency}</td>
                <td className="py-2.5">
                  {src.status === 'LIVE' ? (
                    <span className="flex items-center gap-1 text-[10px] text-status-compliant">
                      <span className="w-1.5 h-1.5 bg-status-compliant rounded-full animate-pulse" />Live
                    </span>
                  ) : src.status === 'SYNCED' ? (
                    <span className="flex items-center gap-1 text-[10px] text-status-compliant">
                      <CheckCircle2 className="w-3 h-3" />Synced
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="w-3 h-3" />Scheduled
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
