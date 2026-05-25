import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export function riskConfig(risk: string) {
  if (risk === 'HIGH')   return { textColor: 'text-red',   dotBg: 'bg-red',   label: 'High Risk' }
  if (risk === 'MEDIUM') return { textColor: 'text-amber', dotBg: 'bg-amber', label: 'Medium Risk' }
  return                        { textColor: 'text-green', dotBg: 'bg-green', label: 'Low Risk' }
}

export function resultIcon(result: string) {
  if (result === 'PASS')    return <CheckCircle className="w-4 h-4 text-green shrink-0" />
  if (result === 'WARNING') return <AlertTriangle className="w-4 h-4 text-amber shrink-0" />
  return                           <XCircle className="w-4 h-4 text-red shrink-0" />
}

export function resultColor(result: string): string {
  if (result === 'PASS')    return 'text-green'
  if (result === 'WARNING') return 'text-amber'
  return 'text-red'
}

export function resultBg(result: string): string {
  if (result === 'PASS')    return 'bg-green/5 border-green/20'
  if (result === 'WARNING') return 'bg-amber/5 border-amber/20'
  return 'bg-red/5 border-red/20'
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtTimestamp(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function riskScoreColor(s: number): string {
  if (s >= 70) return 'text-green'
  if (s >= 40) return 'text-amber'
  return 'text-red'
}

export function riskBarColor(s: number): string {
  if (s >= 70) return 'bg-green'
  if (s >= 40) return 'bg-amber'
  return 'bg-red'
}
