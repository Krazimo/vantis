import { Scale, CheckCircle2 } from 'lucide-react'
import { formatDate } from '../_data/project-profile.data'

type EmbeddedLit = { type: string; court: string; filed: string; status: string }

interface Props {
  litigation: EmbeddedLit[]
}

export default function ProjectLitigation({ litigation }: Props) {
  if (litigation.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green text-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>No active court cases against this project.</span>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {litigation.map((lit, i) => (
        <div key={i} className="bg-surface border border-red/30 rounded-sm p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-red shrink-0 mt-0.5" />
              <div>
                <div className="text-off-white text-sm font-medium">{lit.type} Case</div>
                <div className="text-gray text-xs mt-0.5">{lit.court}</div>
                <div className="font-mono text-gray-light text-xs mt-1">Filed: {formatDate(lit.filed)}</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-red shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
              {lit.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
