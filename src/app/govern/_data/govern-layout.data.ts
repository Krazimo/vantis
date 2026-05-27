import {
  LayoutDashboard, Building2, BarChart2, Scale, ScanLine,
  AlertTriangle, TrendingDown, Users, MessageCircle, Gavel,
  FileText, Sparkles, Settings,
} from 'lucide-react'

export interface Officer {
  email: string
  name: string
  role: string
}

export const OFFICERS: Record<string, { password: string; name: string; role: string }> = {
  'chairman@krera.gov.in':  { password: 'demo', name: 'K-RERA Chairman',  role: 'Chairman' },
  'technical@krera.gov.in': { password: 'demo', name: 'Member Technical', role: 'Member Technical' },
  'legal@krera.gov.in':     { password: 'demo', name: 'Member Legal',     role: 'Member Legal' },
  'secretary@krera.gov.in': { password: 'demo', name: 'Secretary',        role: 'Secretary' },
}

export const NAV = [
  { href: '/govern',              label: 'Command Centre',       icon: LayoutDashboard, exact: true },
  { href: '/govern/projects',     label: 'Project Registry',     icon: Building2 },
  { href: '/govern/qpr',          label: 'QPR Tracker',          icon: BarChart2 },
  { href: '/govern/litigation',   label: 'Litigation Watchlist', icon: Scale },
  { href: '/govern/scanner',      label: 'Submission Scanner',   icon: ScanLine },
  { href: '/govern/risk',         label: 'Developer Risk',       icon: AlertTriangle },
  { href: '/govern/predictive',   label: 'Predictive Default',   icon: TrendingDown },
  { href: '/govern/homebuyer',    label: 'Homebuyer Warning',    icon: Users },
  { href: '/govern/complaints',   label: 'Complaints',           icon: MessageCircle },
  { href: '/govern/rrc',          label: 'RRC Tracker',          icon: Gavel },
  { href: '/govern/notices',      label: 'Notice Generator',     icon: FileText },
  { href: '/govern/intelligence', label: 'Vantis Intelligence',  icon: Sparkles },
  { href: '/govern/settings',     label: 'Settings',             icon: Settings },
]

export function roleTextColor(role: string): string {
  if (role === 'Chairman')         return 'text-primary'
  if (role === 'Member Technical') return 'text-blue'
  if (role === 'Member Legal')     return 'text-status-risk'
  return 'text-muted-foreground'
}

export function roleDotBg(role: string): string {
  if (role === 'Chairman')         return 'bg-primary'
  if (role === 'Member Technical') return 'bg-blue'
  if (role === 'Member Legal')     return 'bg-status-risk'
  return 'bg-muted-light'
}
