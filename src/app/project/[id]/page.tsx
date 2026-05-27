import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CertificateCard from '@/features/public/components/CertificateCard'
import projects from '@/data/projects.json'
import qprData from '@/data/qpr.json'
import complaintsData from '@/data/complaints.json'
import { type Project, type Submission } from './_data/project-profile.data'
import QPRDots from './_components/QPRDots'
import ProjectLitigation from './_components/ProjectLitigation'
import ProjectFacts from './_components/ProjectFacts'
import ComplaintsSummary from './_components/ComplaintsSummary'
import ProjectHeader from './_components/ProjectHeader'

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
          <div className="text-xl text-foreground mb-2">Project Not Found</div>
          <div className="text-muted-foreground text-sm mb-6">No project with ID &quot;{id}&quot; found in our database.</div>
          <Link href="/" className="text-primary hover:text-primary/80 text-sm transition-colors duration-150">← Back to Search</Link>
        </div>
      </main>
    )
  }

  const submission = (qprData.submissions as Submission[]).find(s => s.project_id === project.id)
  const quarters = qprData.quarters
  const complaintsInData = (complaintsData as Array<{ project_id: string }>).filter(c => c.project_id === project.id)

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 border-b border-border px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-150 text-sm">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>
        <span className="text-xs text-muted-foreground tracking-wider">K-RERA PUBLIC REGISTRY</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        <ProjectHeader project={project} />
        <ProjectFacts project={project} />

        <div>
          <h2 className="text-base text-primary/50 uppercase tracking-widest mb-2">Quarterly Progress Reports</h2>
          <p className="text-muted-foreground text-xs mb-5">Last 8 quarters · Most recent on right</p>
          <QPRDots submission={submission} quarters={quarters} />
        </div>

        <ComplaintsSummary
          pending={project.complaints_pending}
          resolved={project.complaints_resolved}
          hasDataRecords={complaintsInData.length > 0}
        />

        <div>
          <h2 className="text-base text-primary/50 uppercase tracking-widest mb-4">Vantis Certificate</h2>
          <CertificateCard certificateId={project.certificate_id ?? null} certificateStatus={project.certificate_status} />
        </div>

        <div>
          <h2 className="text-base text-primary/50 uppercase tracking-widest mb-4">Court Cases</h2>
          <ProjectLitigation litigation={project.litigation} />
        </div>

        <div className="pb-6 flex flex-col sm:flex-row gap-3">
          <a href={`/complaint/file?project=${project.id}`} className="flex-1 text-center bg-primary hover:bg-primary/80 text-background font-semibold text-sm py-3 px-6 rounded-sm transition-colors duration-150">File a Complaint</a>
          <a href={`/alerts?project=${project.id}`} className="flex-1 text-center border border-border hover:border-primary text-foreground hover:text-primary text-sm py-3 px-6 rounded-sm transition-colors duration-150">Set Alert for This Project</a>
        </div>
      </div>
    </main>
  )
}
