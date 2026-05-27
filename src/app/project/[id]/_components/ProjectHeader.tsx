import { MapPin } from 'lucide-react'
import type { Project } from '../_data/project-profile.data'
import { statusColor, statusDot, statusSentence } from '../_data/project-profile.data'
import ScoreBar from './ScoreBar'

interface Props { project: Project }

export default function ProjectHeader({ project }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground leading-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground text-sm">{project.location}</span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${statusColor(project.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(project.status)}`} />{project.status}
        </span>
      </div>
      <div className="font-mono text-primary text-xs mb-4 tracking-wider">{project.rera}</div>
      <div className="bg-card border border-border rounded-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">Vantis Risk Score</span>
          <span className="text-xs text-muted-foreground">100 = lowest risk</span>
        </div>
        <ScoreBar score={project.risk_score} />
      </div>
      <div className="border-l-2 border-primary pl-4 bg-card rounded-r-sm p-4">
        <p className="text-foreground text-sm leading-relaxed">{statusSentence(project)}</p>
      </div>
    </div>
  )
}
