import ProjectDetailContent from './ProjectDetailContent'

export function generateStaticParams() {
  return [
    { id: 'divya-villas' },
    { id: 'ozone-urbana' },
    { id: 'prestige-lakeside' },
    { id: 'skylark-arcadia' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <ProjectDetailContent params={resolvedParams} />
}
