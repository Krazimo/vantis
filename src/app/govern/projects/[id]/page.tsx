import { PageShell } from '@/features/govern/components/PageShell'
import ProjectDetailContent from './ProjectDetailContent'
import projectsData from '@/data/projects.json'
import type { Project } from '@/features/govern/types/project.types'

export function generateStaticParams() {
  return [
    { id: 'divya-villas' },
    { id: 'ozone-urbana' },
    { id: 'prestige-lakeside' },
    { id: 'skylark-arcadia' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = (projectsData as Project[]).find(p => p.id === id)
  if (!project) return <ProjectDetailContent params={{ id }} />
  return (
    <PageShell title={project.name}>
      <ProjectDetailContent params={{ id }} />
    </PageShell>
  )
}
