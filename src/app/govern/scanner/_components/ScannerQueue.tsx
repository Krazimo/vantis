import type { Application } from '../_data/scanner.data'
import { riskConfig, fmtDate } from '../_data/scanner.utils'

interface Props {
  apps: Application[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function ScannerQueue({ apps, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      {apps.map(a => {
        const r = riskConfig(a.risk)
        const isSelected = a.id === selectedId
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={`w-full text-left bg-surface border rounded-sm p-4 transition-colors duration-150 ${
              isSelected ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium leading-tight truncate ${isSelected ? 'text-gold' : 'text-off-white'}`}>
                  {a.project_name}
                </div>
                <div className="text-gray text-xs mt-0.5 truncate">{a.developer}</div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-[10px] shrink-0 ${r.textColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.dotBg}`} />
                {r.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-mono text-gray-light">{a.id}</span>
              <span className="text-gray">Submitted {fmtDate(a.submitted_date)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
