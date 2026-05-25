import DeveloperContent from './DeveloperContent'

export function generateStaticParams() {
  return [
    { id: 'zion-estate' },
    { id: 'ozone-group' },
    { id: 'prestige-group' },
    { id: 'skylark-constructions' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <DeveloperContent params={resolvedParams} />
}
