import { Building2, Users, IndianRupee, Calendar, AlertTriangle } from 'lucide-react'
import type { Project } from '../_data/project-profile.data'
import { formatDate } from '../_data/project-profile.data'

interface Props { project: Project }

export default function ProjectFacts({ project }: Props) {
  const facts = [
    { icon: Building2,     label: 'Type',          value: project.type },
    { icon: Users,         label: 'Total Units',    value: project.total_units.toLocaleString('en-IN') },
    { icon: Users,         label: 'Units Sold',     value: `${project.units_sold} / ${project.total_units}` },
    { icon: IndianRupee,   label: 'Declared Cost',  value: `Rs.${project.declared_cost_crore} Cr` },
    { icon: Calendar,      label: 'Completion',     value: formatDate(project.completion_date) },
    { icon: Calendar,      label: 'Registered',     value: formatDate(project.registration_date) },
    { icon: Calendar,      label: 'Valid Until',    value: formatDate(project.registration_valid_until) },
    { icon: AlertTriangle, label: 'Extensions',     value: project.extensions === 0 ? 'None' : `${project.extensions} granted` },
  ]
  return (
    <div>
      <h2 className="text-base text-primary/50 uppercase tracking-widest mb-4">Project Details</h2>
      <div className="grid grid-cols-2 gap-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-card border border-border rounded-sm p-3 flex items-start gap-2.5">
            <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="text-muted-foreground text-xs">{label}</div>
              <div className="text-foreground text-sm font-medium mt-0.5">{value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 bg-card border border-border rounded-sm p-3">
        <div className="text-muted-foreground text-xs mb-1">Survey Numbers</div>
        <div className="font-mono text-foreground text-sm">{project.survey_numbers.join(', ')}</div>
      </div>
    </div>
  )
}
