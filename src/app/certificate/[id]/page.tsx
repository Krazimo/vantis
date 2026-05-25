import CertificateContent from './CertificateContent'

export function generateStaticParams() {
  return [
    { id: 'VG-2026-007034-0001' },
    { id: 'VG-2026-007821-0002' },
    { id: 'VG-2026-009134-0003' },
    { id: 'VG-2026-007934-0004' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CertificateContent params={resolvedParams} />
}
