import type { Project, Developer } from '../_data/project-detail.types'
import {
  fmtCrore, fmtDate, statusColor, statusDot, riskColor, riskBarColor,
} from '../_data/project-detail.utils'

interface Props {
  project: Project
  developer: Developer | undefined
  qprRows: Array<{ quarter: string; entry: { status: string; filed_date: string | null; completion_pct: number | null } }>
}

export default function OverviewTab({ project, developer, qprRows }: Props) {
  const unitsPct = Math.round((project.units_sold / project.total_units) * 100)
  const latestQPR = qprRows.length ? qprRows[qprRows.length - 1].entry : null
  const completionPct = latestQPR?.completion_pct ??
    (qprRows.slice().reverse().find(r => r.entry.completion_pct !== null)?.entry.completion_pct ?? null)

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">Project Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {[
            { label: 'RERA Number',       value: project.rera,                     mono: true, gold: true },
            { label: 'Project Type',      value: project.type },
            { label: 'Location',          value: project.location },
            { label: 'Survey Numbers',    value: project.survey_numbers.join(', ') },
            { label: 'Declared Cost',     value: fmtCrore(project.declared_cost_crore) },
            { label: 'Registration Date', value: fmtDate(project.registration_date) },
            { label: 'Valid Until',       value: fmtDate(project.registration_valid_until) },
            { label: 'Extensions',        value: project.extensions > 0 ? `${project.extensions} extension${project.extensions > 1 ? 's' : ''}` : 'None' },
            { label: 'Completion Date',   value: fmtDate(project.completion_date) },
            { label: 'Certificate',       value: project.certificate_status === 'NONE' ? 'Not issued' : project.certificate_status },
          ].map(({ label, value, mono, gold }) => (
            <div key={label} className="flex items-start justify-between gap-3 py-2 border-b border-border/60">
              <span className="text-gray text-xs shrink-0">{label}</span>
              <span className={`text-xs text-right leading-relaxed ${mono ? 'font-mono' : ''} ${gold ? 'text-gold' : 'text-off-white'}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface2 border border-border rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray text-xs font-semibold uppercase tracking-wide">Units Sold</span>
          <span className="font-mono text-gold text-sm font-bold">{project.units_sold} / {project.total_units}</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${unitsPct}%` }} />
        </div>
        <div className="text-gray text-xs mt-1 text-right">{unitsPct}% sold</div>
      </div>

      <div className="bg-surface2 border border-border rounded-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray text-xs font-semibold uppercase tracking-wide">Construction Completion</span>
          <span className={`font-mono text-sm font-bold ${completionPct !== null ? 'text-gold' : 'text-red'}`}>
            {completionPct !== null ? `${completionPct}%` : 'Unknown'}
          </span>
        </div>
        {completionPct !== null ? (
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${riskBarColor(completionPct)}`} style={{ width: `${completionPct}%` }} />
          </div>
        ) : (
          <div className="text-red text-xs mt-1">Construction halted — no QPR data available</div>
        )}
      </div>

      {developer && (
        <div>
          <div className="text-[10px] text-gray uppercase tracking-widest font-semibold mb-3">Developer</div>
          <div className="bg-surface2 border border-border rounded-sm p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-off-white font-medium text-sm">{developer.name}</div>
                <div className="text-gray text-xs mt-0.5">{developer.city}, {developer.state} · {developer.years_active} years active</div>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs shrink-0 ${statusColor(developer.status)}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(developer.status)}`} />
                {developer.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center border-t border-border pt-3">
              <div>
                <div className="font-mono text-gold text-base font-bold">{developer.total_projects}</div>
                <div className="text-gray text-[10px] mt-0.5">Total projects</div>
              </div>
              <div>
                <div className="font-mono text-off-white text-base font-bold">{developer.active_projects}</div>
                <div className="text-gray text-[10px] mt-0.5">Active</div>
              </div>
              <div>
                <div className={`font-mono text-base font-bold ${riskColor(developer.trust_score)}`}>{developer.trust_score}</div>
                <div className="text-gray text-[10px] mt-0.5">Trust score</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div className="text-gray text-xs">{developer.contact_email}</div>
              <div className="text-gray text-xs">{developer.contact_phone}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending',  value: project.complaints_pending,  color: project.complaints_pending > 0 ? 'text-amber' : 'text-green' },
          { label: 'Resolved', value: project.complaints_resolved, color: 'text-green' },
          { label: 'Total',    value: project.complaints_pending + project.complaints_resolved, color: 'text-off-white' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-surface2 border border-border rounded-sm p-3 text-center">
            <div className={`font-syne text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-gray text-xs mt-1">Complaints {label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
