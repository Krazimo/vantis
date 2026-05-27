import Link from 'next/link'
import { ArrowLeft, MapPin, Building2, Users, IndianRupee, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react'
import CertificateCard from '@/features/public/components/CertificateCard'
import projects from '@/data/projects.json'
import qprData from '@/data/qpr.json'
import complaintsData from '@/data/complaints.json'
import { type Project, type Submission, statusColor, statusDot, statusSentence, formatDate } from './_data/project-profile.data'
import ScoreBar from './_components/ScoreBar'
import QPRDots from './_components/QPRDots'
import ProjectLitigation from './_components/ProjectLitigation'

export function generateStaticParams() {
  return [
    { id: 'divya-villas' },
    { id: 'ozone-urbana' },
    { id: 'prestige-lakeside' },
    { id: 'skylark-arcadia' },
  ]
}

export default async function ProjectProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = (projects as Project[]).find(p => p.id === id)

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="font-syne text-xl text-off-white mb-2">Project Not Found</div>
          <div className="text-gray text-sm mb-6">No project with ID &quot;{id}&quot; found in our database.</div>
          <Link href="/" className="text-gold hover:text-gold-light text-sm transition-colors duration-150">← Back to Search</Link>
        </div>
      </main>
    )
  }

  const submission = (qprData.submissions as Submission[]).find(s => s.project_id === project.id)
  const quarters = qprData.quarters
  const totalComplaints = project.complaints_pending + project.complaints_resolved
  const complaintsInData = (complaintsData as Array<{ project_id: string }>).filter(c => c.project_id === project.id)

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-border px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-gray-light hover:text-gold transition-colors duration-150 text-sm">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>
        <span className="font-mono text-xs text-gray-light tracking-wider">K-RERA PUBLIC REGISTRY</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Status */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="font-syne text-2xl sm:text-3xl text-off-white leading-tight">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1"><MapPin className="w-3.5 h-3.5 text-gray shrink-0" /><span className="text-gray text-sm">{project.location}</span></div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium shrink-0 ${statusColor(project.status)}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(project.status)}`} />{project.status}
            </span>
          </div>
          <div className="font-mono text-gold text-xs mb-4 tracking-wider">{project.rera}</div>
          <div className="bg-surface border border-border rounded-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-light text-xs uppercase tracking-wider">Vantis Risk Score</span>
              <span className="text-xs text-gray">100 = lowest risk</span>
            </div>
            <ScoreBar score={project.risk_score} />
          </div>
          <div className="border-l-2 border-gold pl-4 bg-surface rounded-r-sm p-4">
            <p className="text-off-white text-sm leading-relaxed">{statusSentence(project)}</p>
          </div>
        </div>

        {/* Project Facts */}
        <div>
          <h2 className="font-syne text-base text-gold-dim uppercase tracking-widest mb-4">Project Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2,    label: 'Type',         value: project.type },
              { icon: Users,        label: 'Total Units',  value: project.total_units.toLocaleString('en-IN') },
              { icon: Users,        label: 'Units Sold',   value: `${project.units_sold} / ${project.total_units}` },
              { icon: IndianRupee,  label: 'Declared Cost', value: `Rs.${project.declared_cost_crore} Cr` },
              { icon: Calendar,     label: 'Completion',   value: formatDate(project.completion_date) },
              { icon: Calendar,     label: 'Registered',   value: formatDate(project.registration_date) },
              { icon: Calendar,     label: 'Valid Until',  value: formatDate(project.registration_valid_until) },
              { icon: AlertTriangle, label: 'Extensions',  value: project.extensions === 0 ? 'None' : `${project.extensions} granted` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-surface border border-border rounded-sm p-3 flex items-start gap-2.5">
                <Icon className="w-4 h-4 text-gray shrink-0 mt-0.5" />
                <div><div className="text-gray text-xs">{label}</div><div className="text-off-white text-sm font-medium mt-0.5">{value}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-surface border border-border rounded-sm p-3">
            <div className="text-gray text-xs mb-1">Survey Numbers</div>
            <div className="font-mono text-off-white text-sm">{project.survey_numbers.join(', ')}</div>
          </div>
        </div>

        {/* QPR */}
        <div>
          <h2 className="font-syne text-base text-gold-dim uppercase tracking-widest mb-2">Quarterly Progress Reports</h2>
          <p className="text-gray text-xs mb-5">Last 8 quarters · Most recent on right</p>
          <QPRDots submission={submission} quarters={quarters} />
        </div>

        {/* Complaints */}
        <div>
          <h2 className="font-syne text-base text-gold-dim uppercase tracking-widest mb-4">Complaints</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: project.complaints_pending, label: 'Pending', color: project.complaints_pending > 0 ? 'text-red' : 'text-green' },
              { value: project.complaints_resolved, label: 'Resolved', color: 'text-green' },
              { value: totalComplaints, label: 'Total Filed', color: 'text-off-white' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-surface border border-border rounded-sm p-4 text-center">
                <div className={`font-syne text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-gray text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
          {complaintsInData.length > 0 && <div className="mt-3 bg-surface border border-border rounded-sm p-3"><div className="text-gray text-xs">Recent complaints on file for this project in the K-RERA database.</div></div>}
          {project.complaints_pending === 0 && project.complaints_resolved === 0 && (
            <div className="mt-3 flex items-center gap-2 text-green text-sm"><CheckCircle2 className="w-4 h-4" /><span>No complaints have been filed against this project.</span></div>
          )}
        </div>

        {/* Certificate */}
        <div>
          <h2 className="font-syne text-base text-gold-dim uppercase tracking-widest mb-4">Vantis Certificate</h2>
          <CertificateCard certificateId={project.certificate_id ?? null} certificateStatus={project.certificate_status} />
        </div>

        {/* Litigation */}
        <div>
          <h2 className="font-syne text-base text-gold-dim uppercase tracking-widest mb-4">Court Cases</h2>
          <ProjectLitigation litigation={project.litigation} />
        </div>

        {/* CTA */}
        <div className="pb-6 flex flex-col sm:flex-row gap-3">
          <a href={`/complaint/file?project=${project.id}`} className="flex-1 text-center bg-gold hover:bg-gold-light text-background font-semibold text-sm py-3 px-6 rounded-sm transition-colors duration-150">File a Complaint</a>
          <a href={`/alerts?project=${project.id}`} className="flex-1 text-center border border-border hover:border-gold text-off-white hover:text-gold text-sm py-3 px-6 rounded-sm transition-colors duration-150">Set Alert for This Project</a>
        </div>
      </div>
    </main>
  )
}
