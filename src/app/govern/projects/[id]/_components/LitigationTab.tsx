import { CheckCircle } from 'lucide-react'
import type { LitigationItem } from '../_data/project-detail.types'
import { fmtDate, fmtCrore, severityTextColor, severityDotBg } from '../_data/project-detail.utils'

interface Props {
  litigation: LitigationItem[]
}

export default function LitigationTab({ litigation }: Props) {
  return (
    <div>
      <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">
        Active Court Cases · {litigation.length} record{litigation.length !== 1 ? 's' : ''}
      </div>

      {litigation.length === 0 ? (
        <div className="bg-surface2 border border-border rounded-sm p-8 text-center">
          <CheckCircle className="w-8 h-8 text-green mx-auto mb-3" />
          <div className="text-off-white text-sm font-medium mb-1">No Active Litigation</div>
          <div className="text-gray text-xs">No court cases on record for this project.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {litigation.map(l => (
            <div key={l.id} className="bg-surface2 border border-border rounded-sm p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-mono text-gold text-xs mb-0.5">{l.case_number}</div>
                  <div className="text-off-white text-sm font-medium">{l.cause}</div>
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] shrink-0 ${severityTextColor(l.severity)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${severityDotBg(l.severity)}`} />
                  {l.severity}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  { label: 'Court',         value: l.court },
                  { label: 'Type',          value: l.type },
                  { label: 'Plaintiff',     value: l.plaintiff },
                  { label: 'Filed',         value: fmtDate(l.filed_date) },
                  { label: 'Next Hearing',  value: fmtDate(l.next_hearing) },
                  { label: 'Relief Sought', value: l.relief_sought_crore ? fmtCrore(l.relief_sought_crore) : 'Not specified' },
                ].map(({ label, value }) => (
                  <div key={label} className="text-xs">
                    <span className="text-gray">{label}: </span>
                    <span className="text-off-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
