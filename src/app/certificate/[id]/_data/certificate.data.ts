export interface Verification {
  label: string
  source: string
  result: string
  detail: string
}

export interface Certificate {
  id: string
  project_name: string
  rera: string
  developer_name: string
  location: string
  status: string
  issued_date: string
  last_verified: string
  valid_until: string
  verifications: Record<string, Verification>
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function fmtDateTime(d: string) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function resultColor(r: string) {
  if (r === 'PASS')    return 'text-green'
  if (r === 'FLAGGED') return 'text-amber'
  return 'text-red'
}

export function resultBg(r: string) {
  if (r === 'PASS')    return 'bg-green/5 border-green/20'
  if (r === 'FLAGGED') return 'bg-amber/5 border-amber/20'
  return 'bg-red/5 border-red/20'
}

export function statusConfig(s: string) {
  if (s === 'FULL')        return { banner: 'bg-[#F0FBF5] border-b-2 border-b-green', text: 'text-green',  label: '✓  FULL CERTIFICATE' }
  if (s === 'PROVISIONAL') return { banner: 'bg-[#FFFBF0] border-b-2 border-b-amber', text: 'text-amber', label: '⚠  PROVISIONAL CERTIFICATE' }
  return                          { banner: 'bg-[#FFF5F5] border-b-2 border-b-red',   text: 'text-red',   label: '✗  FLAGGED' }
}
