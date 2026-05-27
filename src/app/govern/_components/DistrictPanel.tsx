import Link from 'next/link'
import type { Project } from '@/features/govern/types/project.types'

interface District {
  id: string
  label: string
  risk: string
  projects: string[]
}

function statusColor(s: string) {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}
function statusDot(s: string) {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}

interface Props {
  selectedDistrict: District | null
  projects: Project[]
  onClear: () => void
}

export default function DistrictPanel({ selectedDistrict, projects, onClear }: Props) {
  if (!selectedDistrict) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <div>
          <div className="text-muted-foreground text-sm mb-1">Select a district</div>
          <div className="text-muted-foreground text-xs">Click any district on the map to see registered projects and risk status.</div>
        </div>
      </div>
    )
  }

  const districtProjects = projects.filter(p => selectedDistrict.projects.includes(p.id))
  const riskClass = selectedDistrict.risk === 'high-risk' ? 'text-status-risk' : selectedDistrict.risk === 'caution' ? 'text-status-caution' : 'text-status-compliant'
  const dotClass  = selectedDistrict.risk === 'high-risk' ? 'bg-status-risk'  : selectedDistrict.risk === 'caution'  ? 'bg-status-caution'  : 'bg-status-compliant'
  const riskLabel = selectedDistrict.risk === 'high-risk' ? 'HIGH RISK' : selectedDistrict.risk.toUpperCase()

  return (
    <div className="flex-1">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-syne text-base text-foreground">{selectedDistrict.label}</div>
          <div className="text-muted-foreground text-xs mt-0.5">{districtProjects.length} project{districtProjects.length !== 1 ? 's' : ''} in database</div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs ${riskClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />{riskLabel}
        </span>
      </div>

      {districtProjects.length === 0 ? (
        <div className="text-muted-foreground text-sm text-center py-8">No projects in current database for this district.</div>
      ) : (
        <div className="space-y-3">
          {districtProjects.map(p => (
            <Link key={p.id} href={`/govern/projects/${p.id}`}
              className="block bg-background border border-border hover:border-primary rounded-sm p-3 transition-colors duration-150 group">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-foreground text-sm font-medium group-hover:text-primary transition-colors duration-150">{p.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{p.developer_name}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-xs shrink-0 ${statusColor(p.status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(p.status)}`} />
                  {p.status === 'HIGH RISK' ? 'HIGH RISK' : p.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-xs">Risk Score</span>
                  <span className={`font-mono text-xs font-bold ${p.risk_score >= 70 ? 'text-status-compliant' : p.risk_score >= 40 ? 'text-status-caution' : 'text-status-risk'}`}>{p.risk_score}</span>
                </div>
                {p.complaints_pending > 0 && (
                  <div className="text-xs text-status-caution">{p.complaints_pending} complaint{p.complaints_pending > 1 ? 's' : ''}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <button onClick={onClear} className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors duration-150">← Clear selection</button>
    </div>
  )
}
