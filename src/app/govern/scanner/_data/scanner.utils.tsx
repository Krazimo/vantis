import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export function riskConfig(risk: string) {
  if (risk === 'HIGH')   return { textColor: 'text-status-risk',   dotBg: 'bg-status-risk',   label: 'High Risk' }
  if (risk === 'MEDIUM') return { textColor: 'text-status-caution', dotBg: 'bg-status-caution', label: 'Medium Risk' }
  return                        { textColor: 'text-status-compliant', dotBg: 'bg-status-compliant', label: 'Low Risk' }
}

export function resultIcon(result: string) {
  if (result === 'PASS')    return <CheckCircle className="w-4 h-4 text-status-compliant shrink-0" />
  if (result === 'WARNING') return <AlertTriangle className="w-4 h-4 text-status-caution shrink-0" />
  return                           <XCircle className="w-4 h-4 text-status-risk shrink-0" />
}

export function resultColor(result: string): string {
  if (result === 'PASS')    return 'text-status-compliant'
  if (result === 'WARNING') return 'text-status-caution'
  return 'text-status-risk'
}

export function resultBg(result: string): string {
  if (result === 'PASS')    return 'bg-status-compliant/5 border-status-compliant/20'
  if (result === 'WARNING') return 'bg-status-caution/5 border-status-caution/20'
  return 'bg-status-risk/5 border-status-risk/20'
}

export function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function fmtTimestamp(d: Date): string {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function riskScoreColor(s: number): string {
  if (s >= 70) return 'text-status-compliant'
  if (s >= 40) return 'text-status-caution'
  return 'text-status-risk'
}

export function riskBarColor(s: number): string {
  if (s >= 70) return 'bg-status-compliant'
  if (s >= 40) return 'bg-status-caution'
  return 'bg-status-risk'
}
