# Implementation Plan: file-size-audit-and-splits

## Overview

22 application files exceed the 150-line ceiling. All are in `src/app/**` or
`src/components/**` (excluding `src/components/ui/**`). This plan decomposes
each file using the extraction patterns from the contract without any behavior
changes.

**CI gates that must stay green after every commit batch:**
```bash
bunx tsc --noEmit && bun lint && bun run build && bun test
```

---

## Commit 1 — ProjectDetailContent: types, utils, data

**Target:** `src/app/govern/projects/[id]/ProjectDetailContent.tsx` (892 → ~115 lines after all 3 commits)

### Files to create

#### `src/app/govern/projects/[id]/_data/project-detail.types.ts` (~55 lines)
```ts
export interface LitigationItem { type: string; court: string; filed: string; status: string }
export interface QPREntry { status: string; filed_date: string | null; completion_pct: number | null }
export interface Submission { project_id: string; [key: string]: QPREntry | string }
export interface Developer { id: string; name: string; trust_score: number; ... }
export interface Project { id: string; name: string; rera: string; developer_id: string; ... }
```
Export all interfaces used by the tabs and the parent component.

#### `src/app/govern/projects/[id]/_data/project-detail.utils.ts` (~65 lines)
```ts
export function getDueDate(quarter: string): string { ... }
export function daysLate(dueDate: string, filedDate: string | null): number { ... }
export function fmtDate(d: string): string { ... }
export function fmtCrore(n: number): string { ... }
export function fmtInr(n: number): string { ... }
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
export function riskColor(score: number): string { ... }
export function riskBarColor(score: number): string { ... }
export function qprRowClass(status: string): string { ... }
export function qprStatusEl(status: string): React.ReactNode { ... }  // returns JSX span
export function severityTextColor(s: string): string { ... }
export function severityDotBg(s: string): string { ... }
```

#### `src/app/govern/projects/[id]/_data/project-detail.data.ts` (~25 lines)
```ts
export const ESCROW: Record<string, { balance: number; pct: number; label: string; status: string }> = { ... }
export const TABS = ['Overview', 'QPR History', 'Financial', 'Litigation', 'Risk Timeline', 'Actions', 'Documents'] as const
export type TabName = typeof TABS[number]
```

### Changes to ProjectDetailContent.tsx
- Remove all extracted interfaces, helpers, and constants
- Add imports from `_data/project-detail.types`, `_data/project-detail.utils`, `_data/project-detail.data`
- File will still be ~550 lines — further reduced in commits 2a/2b

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 2 — ProjectDetailContent: extract all 7 tab components

**Target:** ProjectDetailContent.tsx → ~115 lines

### Files to create

#### `src/app/govern/projects/[id]/_components/OverviewTab.tsx` (~110 lines)
```tsx
'use client'
import type { Project, Developer } from '../_data/project-detail.types'
import { fmtDate, fmtCrore, statusColor, statusDot, riskColor, riskBarColor } from '../_data/project-detail.utils'

interface Props { project: Project; developer: Developer }
export default function OverviewTab({ project, developer }: Props) { ... }
```
Contains: project facts grid, units sold progress bar, construction completion bar,
developer card with trust score, complaints summary section.

#### `src/app/govern/projects/[id]/_components/QPRTab.tsx` (~100 lines)
```tsx
'use client'
import type { Project, Submission } from '../_data/project-detail.types'
import { getDueDate, daysLate, fmtDate, fmtInr, qprRowClass, qprStatusEl } from '../_data/project-detail.utils'

interface Props { project: Project; submission: Submission | undefined; quarters: string[] }
export default function QPRTab({ project, submission, quarters }: Props) { ... }
```
Contains: 8-quarter table with due dates, filed dates, status, days late, penalties.

#### `src/app/govern/projects/[id]/_components/FinancialTab.tsx` (~70 lines)
```tsx
'use client'
import type { Project } from '../_data/project-detail.types'
import { ESCROW } from '../_data/project-detail.data'
import { fmtInr } from '../_data/project-detail.utils'

interface Props { project: Project }
export default function FinancialTab({ project }: Props) { ... }
```
Contains: escrow balance card, collected, escrow%, last withdrawal, note.

#### `src/app/govern/projects/[id]/_components/LitigationTab.tsx` (~70 lines)
```tsx
'use client'
import type { Project } from '../_data/project-detail.types'
import { fmtDate, severityTextColor, severityDotBg } from '../_data/project-detail.utils'

interface Props { project: Project }
export default function LitigationTab({ project }: Props) { ... }
```
Contains: cases from project.litigation + empty state.

#### `src/app/govern/projects/[id]/_components/TimelineTab.tsx` (~40 lines)
```tsx
'use client'
import dynamic from 'next/dynamic'
import type { Project } from '../_data/project-detail.types'
const RiskTimeline = dynamic(() => import('@/components/govern/RiskTimeline'), { ssr: false })

interface Props { project: Project }
export default function TimelineTab({ project }: Props) { ... }
```
Contains: RiskTimeline for ozone-urbana; "insufficient data" state with link for others.

#### `src/app/govern/projects/[id]/_components/ActionsTab.tsx` (~100 lines)
```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '../_data/project-detail.types'

interface Props { project: Project }
export default function ActionsTab({ project }: Props) {
  const [watchlisted, setWatchlisted] = useState(false)
  const [watchConfirm, setWatchConfirm] = useState(false)
  const [inspectionModal, setInspectionModal] = useState(false)
  const [rrcModal, setRrcModal] = useState(false)
  ...
}
```
Contains: 4 action buttons, watchlist confirm modal, inspection modal, RRC modal.
State moves INTO this component (was in parent).

#### `src/app/govern/projects/[id]/_components/DocumentsTab.tsx` (~130 lines)
```tsx
'use client'
import { useState, useEffect } from 'react'
import type { Project } from '../_data/project-detail.types'

interface DocModules { ... }
interface Props { project: Project }
export default function DocumentsTab({ project }: Props) {
  const [docModules, setDocModules] = useState<DocModules | null>(null)
  useEffect(() => {
    if (project.id !== 'divya-villas') return
    Promise.all([
      import('@/lib/divya-villas-pdfs'),
      import('@/lib/divya-villas-images'),
    ]).then(([pdfs, images]) => setDocModules({ ...pdfs, ...images }))
  }, [project.id])
  ...
}
```
Contains: document grid for divya-villas; empty state for others.
State + dynamic import move INTO this component (were in parent).

### Changes to ProjectDetailContent.tsx
- Remove all 7 `render*` inline functions
- Remove `watchlisted`, `watchConfirm`, `inspectionModal`, `rrcModal`, `docModules` state
- Remove `useEffect` for docModules
- Import and render `<OverviewTab>`, `<QPRTab>`, etc. inside the tab switcher
- Result: ~115 lines (imports + state for `activeTab` only + the outer shell)

**Verify:** `bun run build` passes

---

## Commit 3 — govern/complaints: extract data, utils, table, modals

**Target:** `src/app/govern/complaints/page.tsx` (542 → ~100 lines)

### Files to create

#### `src/app/govern/complaints/_data/complaints.data.ts` (~80 lines)
```ts
export type ComplaintStatus = 'Filed' | 'Hearing Scheduled' | 'Order Passed' | 'Resolved'
export interface Complaint { id: string; project: string; ... }
export const COMPLAINTS: Complaint[] = [ ... ]  // 7 items
export const ANON: Record<string, string> = { ... }
export const TABS = ['All', 'Filed', 'Hearing Scheduled', 'Order Passed', 'Resolved'] as const
export type FilterTab = typeof TABS[number]
```

#### `src/app/govern/complaints/_data/complaints.utils.ts` (~35 lines)
```ts
export function daysPending(filed: string): number { ... }
export function tabOf(status: ComplaintStatus): FilterTab { ... }
export function fmtDate(d: string): string { ... }
export function statusBadgeColor(s: string): string { ... }
export function statusBadgeDot(s: string): string { ... }
export function statusLabel(s: string): string { ... }
```

#### `src/app/govern/complaints/_components/ComplaintsTable.tsx` (~120 lines)
```tsx
'use client'
import type { Complaint } from '../_data/complaints.data'
// Desktop table + mobile cards + expandable rows

interface Props {
  complaints: Complaint[]
  expandedId: string | null
  onToggle: (id: string) => void
  onSchedule: (c: Complaint) => void
  onOrder: (c: Complaint) => void
}
export default function ComplaintsTable({ ... }: Props) { ... }
```

#### `src/app/govern/complaints/_components/ComplaintsModals.tsx` (~80 lines)
```tsx
'use client'
import type { Complaint } from '../_data/complaints.data'

interface Props {
  scheduleModal: Complaint | null
  orderModal: Complaint | null
  onCloseSchedule: () => void
  onCloseOrder: () => void
}
export default function ComplaintsModals({ ... }: Props) { ... }
```
Contains: Schedule Hearing modal + Record Order modal.

### Changes to complaints/page.tsx
- Remove all inline data, helpers, table JSX, modal JSX
- Import from `_data/` and `_components/`
- Keep state: `activeTab`, `expandedId`, `scheduleModal`, `orderModal`
- Result: ~100 lines

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 4 — govern/scanner: extract data, utils, components

**Target:** `src/app/govern/scanner/page.tsx` (468 → ~110 lines)

### Files to create

#### `src/app/govern/scanner/_data/scanner.data.ts` (~85 lines)
```ts
export interface Verification { label: string; source: string; result: string; detail: string }
export interface Application { id: string; project: string; risk: string; score: number; verifications: Verification[]; ... }
export const APPLICATIONS: Application[] = [ ... ]  // 3 items
export const CERT_ID = 'VG-2026-007934-0004'
export const CERT_VERIFICATIONS: Verification[] = [ ... ]
```

#### `src/app/govern/scanner/_data/scanner.utils.ts` (~50 lines)
```ts
export function riskConfig(risk: string): { color: string; bg: string; border: string } { ... }
export function resultIcon(result: string): React.ReactNode { ... }
export function resultColor(r: string): string { ... }
export function resultBg(r: string): string { ... }
export function fmtDate(d: string): string { ... }
export function fmtTimestamp(d: string): string { ... }
export function riskScoreColor(score: number): string { ... }
export function riskBarColor(score: number): string { ... }
```

#### `src/app/govern/scanner/_components/ScannerQueue.tsx` (~60 lines)
```tsx
'use client'
import type { Application } from '../_data/scanner.data'
import { riskConfig } from '../_data/scanner.utils'

interface Props { apps: Application[]; selectedId: string; onSelect: (id: string) => void }
export default function ScannerQueue({ ... }: Props) { ... }
```
Contains: left queue panel (3 application rows with risk badges).

#### `src/app/govern/scanner/_components/AssessmentCard.tsx` (~100 lines)
```tsx
'use client'
import type { Application } from '../_data/scanner.data'
import { resultIcon, resultColor, resultBg, riskScoreColor, riskBarColor, fmtTimestamp } from '../_data/scanner.utils'

interface Props {
  app: Application
  onApprove: () => void
  onReject: () => void
  onConditions: () => void
  onDocuments: () => void
}
export default function AssessmentCard({ ... }: Props) { ... }
```
Contains: 5-point verification list, risk score bar, 4 action buttons.

#### `src/app/govern/scanner/_components/ScannerModals.tsx` (~80 lines)
```tsx
'use client'
import type { Application } from '../_data/scanner.data'

interface Props {
  approveModal: boolean; rejectModal: boolean; conditionsModal: boolean
  app: Application
  onConfirmApprove: () => void
  onConfirmReject: () => void
  onConfirmConditions: () => void
  onClose: () => void
}
export default function ScannerModals({ ... }: Props) { ... }
```

#### `src/app/govern/scanner/_components/ApprovalSuccess.tsx` (~60 lines)
```tsx
'use client'
import Link from 'next/link'
import { CERT_ID } from '../_data/scanner.data'

interface Props { project: string; onReset: () => void }
export default function ApprovalSuccess({ project, onReset }: Props) { ... }
```
Contains: full-page success state after approval.

### Changes to scanner/page.tsx
- Remove all inline data, helpers, JSX sections
- Import from `_data/` and `_components/`
- Keep state: `selectedId`, `approved`, `approveModal`, `rejectModal`, `conditionsModal`
- Result: ~110 lines

**Verify:** `bun run build` passes

---

## Commit 5 — govern/notices: extract templates, utils, form/preview

**Target:** `src/app/govern/notices/page.tsx` (428 → ~105 lines)

### Files to create

#### `src/app/govern/notices/_data/notices.data.ts` (~30 lines)
```ts
export const VIOLATION_TYPES = [
  { value: 'qpr_default', label: 'QPR Default (S.63)', section: '63' },
  { value: 'registration', label: 'Registration Non-Compliance (S.59)', section: '59' },
  { value: 'false_info', label: 'False Information (S.60)', section: '60' },
  { value: 'unregistered', label: 'Unregistered Sale (S.59)', section: '59' },
  { value: 'other', label: 'Other (S.64)', section: '64' },
] as const
export type ViolationType = typeof VIOLATION_TYPES[number]['value']
```

#### `src/app/govern/notices/_data/notice-templates.ts` (~148 lines)
```ts
interface NoticeContext { project: string; developer: string; rera: string; date: string; officer: string; details?: string }

export function qprDefaultNotice(ctx: NoticeContext, lang: 'en' | 'kn'): string { ... }  // ~40 lines
export function registrationNotice(ctx: NoticeContext, lang: 'en' | 'kn'): string { ... }  // ~25 lines
export function falseInfoNotice(ctx: NoticeContext, lang: 'en' | 'kn'): string { ... }     // ~25 lines
export function unregisteredNotice(ctx: NoticeContext, lang: 'en' | 'kn'): string { ... }  // ~25 lines
export function otherNotice(ctx: NoticeContext, lang: 'en' | 'kn'): string { ... }         // ~20 lines
```

#### `src/app/govern/notices/_data/notices.utils.ts` (~35 lines)
```ts
import { qprDefaultNotice, registrationNotice, falseInfoNotice, unregisteredNotice, otherNotice } from './notice-templates'
import type { ViolationType } from './notices.data'

export interface NoticeContext { project: string; developer: string; rera: string; date: string; officer: string; details?: string }
export function generateNoticeText(type: ViolationType, ctx: NoticeContext, lang: 'en' | 'kn'): string {
  // dispatch to correct template function
}
export function noticeMeta(type: ViolationType): { title: string; section: string } { ... }
```

#### `src/app/govern/notices/_components/NoticeForm.tsx` (~90 lines)
```tsx
'use client'
import { VIOLATION_TYPES } from '../_data/notices.data'

interface Props {
  violationType: string; project: string; details: string; lang: 'en' | 'kn'
  onChange: (field: string, value: string) => void
  onGenerate: () => void
  isGenerating: boolean
}
export default function NoticeForm({ ... }: Props) { ... }
```
Contains: form with violation type selector, project selector, details textarea, language toggle.

#### `src/app/govern/notices/_components/NoticePreview.tsx` (~80 lines)
```tsx
'use client'
interface Props { text: string; isGenerating: boolean; onCopy: () => void; onPrint: () => void }
export default function NoticePreview({ ... }: Props) { ... }
```
Contains: letterhead document display, typing animation state, copy/print buttons.

### Changes to notices/page.tsx
- Remove all inline data, templates, JSX
- Import from `_data/` and `_components/`
- Keep state: `violationType`, `project`, `details`, `lang`, `noticeText`, `isGenerating`
- Result: ~105 lines

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 6 — govern/qpr: extract data, utils, table, modal

**Target:** `src/app/govern/qpr/page.tsx` (413 → ~100 lines)

### Files to create

#### `src/app/govern/qpr/_data/qpr-tracker.utils.ts` (~60 lines)
```ts
export function getDueDate(quarter: string): string { ... }
export function daysOverdue(dueDate: string, filedDate: string | null): number { ... }
export function penalty(daysLate: number): number { ... }  // Rs.25,000/day
export function fmtDate(d: string): string { ... }
export function fmtInr(n: number): string { ... }
export function qprKey(q: string): string { ... }
```

#### `src/app/govern/qpr/_data/qpr-tracker.data.ts` (~30 lines)
```ts
import qprData from '@/data/qpr.json'
import projects from '@/data/projects.json'
import { getDueDate, daysOverdue, penalty, qprKey } from './qpr-tracker.utils'

export interface QPRRow { projectId: string; project: string; developer: string; quarter: string; dueDate: string; filedDate: string | null; status: string; overdueDays: number; penaltyAmt: number }
export const ALL_ROWS: QPRRow[] = /* computed from qprData + projects */ [...]
export const TABS = ['All', 'On Time', 'Late', 'Missed'] as const
export type FilterTab = typeof TABS[number]
```
Note: The ALL_ROWS computation is currently inline in the component; move it here as a module-level constant.

#### `src/app/govern/qpr/_components/QPRTable.tsx` (~120 lines)
```tsx
'use client'
import type { QPRRow } from '../_data/qpr-tracker.data'

interface Props { rows: QPRRow[]; selected: Set<string>; onToggle: (id: string) => void; onToggleAll: () => void }
export default function QPRTable({ ... }: Props) { ... }
```
Contains: desktop table with checkboxes + mobile cards. Inline `StatusBadge` moved to module level or into this file as a named export helper component.

#### `src/app/govern/qpr/_components/BatchNoticeModal.tsx` (~50 lines)
```tsx
'use client'
import type { QPRRow } from '../_data/qpr-tracker.data'

interface Props { rows: QPRRow[]; onClose: () => void }
export default function BatchNoticeModal({ rows, onClose }: Props) { ... }
```

### Changes to qpr/page.tsx
- Remove all inline computation, helpers, JSX
- Import from `_data/` and `_components/`
- Keep state: `activeTab`, `selected`, `batchModal`
- Result: ~100 lines

**Verify:** `bun run build` passes

---

## Commit 7 — complaint/file: extract data and step components

**Target:** `src/app/complaint/file/page.tsx` (392 → ~90 lines)

### Files to create

#### `src/app/complaint/file/_data/file-complaint.data.ts` (~60 lines)
```ts
export const NATURES = [
  { id: 'delay', label: 'Project Delay', icon: '⏱' },
  { id: 'quality', label: 'Construction Quality', icon: '🏗' },
  ...
] as const

export const TX = {
  en: { title: 'File a Complaint', step1: 'Your Details', ... },
  kn: { title: 'ದೂರು ಸಲ್ಲಿಸಿ', step1: 'ನಿಮ್ಮ ವಿವರಗಳು', ... },
} as const
export type Lang = keyof typeof TX
```

#### `src/app/complaint/file/_components/Header.tsx` (~30 lines)
```tsx
'use client'
// The inline Header function component at the bottom of the current file
interface Props { lang: 'en' | 'kn'; onToggleLang: () => void }
export default function FileComplaintHeader({ lang, onToggleLang }: Props) { ... }
```

#### `src/app/complaint/file/_components/Step1.tsx` (~60 lines)
```tsx
'use client'
interface Props { name: string; phone: string; email: string; onChange: (f: string, v: string) => void; t: Record<string, string>; onNext: () => void }
export default function Step1({ ... }: Props) { ... }
```
Contains: name/phone/email fields with validation.

#### `src/app/complaint/file/_components/Step2.tsx` (~70 lines)
```tsx
'use client'
import { NATURES } from '../_data/file-complaint.data'
interface Props { projectQuery: string; selectedProject: string; selectedNature: string; onChange: (f: string, v: string) => void; t: Record<string, string>; onNext: () => void; onBack: () => void }
export default function Step2({ ... }: Props) { ... }
```
Contains: project search + nature tiles.

#### `src/app/complaint/file/_components/Step3.tsx` (~60 lines)
```tsx
'use client'
interface Props { description: string; onChange: (v: string) => void; t: Record<string, string>; onSubmit: () => void; onBack: () => void }
export default function Step3({ ... }: Props) { ... }
```
Contains: description textarea + photo upload placeholder.

#### `src/app/complaint/file/_components/SuccessScreen.tsx` (~50 lines)
```tsx
'use client'
interface Props { refNumber: string; t: Record<string, string> }
export default function SuccessScreen({ refNumber, t }: Props) { ... }
```

### Changes to complaint/file/page.tsx
- Remove all inline data, components, JSX
- Import from `_data/` and `_components/`
- Keep state: `step`, `lang`, `name`, `phone`, `email`, `projectQuery`, `selectedProject`, `selectedNature`, `description`, `submitted`, `refNumber`
- Result: ~90 lines

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 8 — complaint/track + govern/layout

**Targets:**
- `src/app/complaint/track/page.tsx` (337 → ~95 lines)
- `src/app/govern/layout.tsx` (295 → ~105 lines)

### complaint/track — Files to create

#### `src/app/complaint/track/_data/track-complaint.data.ts` (~65 lines)
```ts
export const ALL_STEPS = ['Filed', 'Acknowledged', 'Notice Issued', 'Hearing Scheduled', 'Order Passed', 'Resolved'] as const
export type TrackStep = typeof ALL_STEPS[number]
export const NEXT_STEPS: Record<TrackStep, string> = { ... }
export const TX = { en: { ... }, kn: { ... } } as const
```

#### `src/app/complaint/track/_data/track-complaint.utils.ts` (~35 lines)
```ts
export function getActiveStep(status: string): TrackStep { ... }
export function getStepIndex(step: TrackStep): number { ... }
export function fmtDate(d: string): string { ... }
export function buildTimeline(complaint: Complaint): TimelineEvent[] { ... }
```

#### `src/app/complaint/track/_components/ProgressBar.tsx` (~50 lines)
```tsx
'use client'
import { ALL_STEPS, type TrackStep } from '../_data/track-complaint.data'
interface Props { activeStep: TrackStep }
export default function ProgressBar({ activeStep }: Props) { ... }
```

#### `src/app/complaint/track/_components/TrackContent.tsx` (~100 lines)
```tsx
'use client'
import { useSearchParams } from 'next/navigation'
// This becomes the inner content component (currently contains the useSearchParams hook)
// It composes ProgressBar + timeline + details grid + not-found state
export default function TrackContent() { ... }
```

### govern/layout — Files to create

#### `src/app/govern/_components/LoginScreen.tsx` (~80 lines)
```tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { OFFICERS } from '../_data/govern-layout.data'

interface Officer { email: string; name: string; role: string }
interface Props { onLogin: (o: Officer) => void }
export default function LoginScreen({ onLogin }: Props) { ... }
```

#### `src/app/govern/_components/SidebarNav.tsx` (~60 lines)
```tsx
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { NAV } from '../_data/govern-layout.data'
import { roleTextColor, roleDotBg } from '../_data/govern-layout.utils'

interface Officer { email: string; name: string; role: string }
interface Props { officer: Officer; onLogout: () => void; onClose: () => void }
export default function SidebarNav({ officer, onLogout, onClose }: Props) { ... }
```

#### `src/app/govern/_data/govern-layout.data.ts` (~30 lines)
```ts
export const OFFICERS: Record<string, { password: string; name: string; role: string }> = { ... }
export const NAV = [
  { href: '/govern', label: 'Command Centre', icon: LayoutDashboard, exact: true },
  ...
] as const
```
Note: icon imports (lucide-react) stay in this file — they are data, not JSX.

#### `src/app/govern/_data/govern-layout.utils.ts` (~20 lines)
```ts
export function roleTextColor(role: string): string { ... }
export function roleDotBg(role: string): string { ... }
```

### Changes to govern/layout.tsx
- Remove `OFFICERS`, `NAV`, `roleTextColor`, `roleDotBg`, `SidebarNav`, `LoginScreen`
- Import `LoginScreen`, `SidebarNav` from `_components/`
- Import `OFFICERS` from `_data/` (only needed for the localStorage check)
- Keep state: `mounted`, `officer`, `sidebarOpen`, `demoMode`
- Keep: the main `GovernLayout` shell with mobile/desktop top bars and sidebar slots
- Result: ~105 lines

**Verify:** `bun run build` passes

---

## Commit 9 — govern/page + govern/predictive + govern/risk

### govern/page (285 → ~110 lines)

#### `src/app/govern/_data/command-centre.data.ts` (~40 lines)
```ts
export const KPIs = [
  { label: 'Registered Projects', value: '4', icon: 'Building2', delta: '+2 this quarter' },
  ...
] as const
```

#### `src/app/govern/_data/command-centre.utils.ts` (~30 lines)
```ts
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
export function qprKey(q: string): string { ... }
```

#### `src/app/govern/_components/KarnatakaMapSection.tsx` (~90 lines)
```tsx
'use client'
// Extracts the SVG map + district click handler + DistrictPanel
// Uses dynamic import internally for the SVG to avoid SSR issues
```

#### `src/app/govern/_components/LiveFeedCards.tsx` (~70 lines)
```tsx
'use client'
// Critical Alerts / QPR Defaults / Active Litigation cards
```

Changes to govern/page.tsx: Remove KPIs, helpers, map JSX, live feed JSX. Result: ~110 lines.

### govern/predictive (265 → ~100 lines)

#### `src/app/govern/predictive/_data/predictive.data.ts` (~55 lines)
```ts
export interface PredictiveRow { rank: number; project: string; developer: string; riskScore: number; defaultPct: number; signals: string[]; action: string }
export const ROWS: PredictiveRow[] = [ ... ]  // 4 items
```

#### `src/app/govern/predictive/_data/predictive.utils.ts` (~30 lines)
```ts
export function actionConfig(action: string): { label: string; color: string } { ... }
export function probColor(pct: number): string { ... }
export function probBarColor(pct: number): string { ... }
export function riskScoreColor(score: number): string { ... }
```

#### `src/app/govern/predictive/_components/PredictiveTable.tsx` (~110 lines)
```tsx
'use client'
import type { PredictiveRow } from '../_data/predictive.data'
import { actionConfig, probColor, probBarColor, riskScoreColor } from '../_data/predictive.utils'
// Desktop table + mobile cards
```

Changes to predictive/page.tsx: Import `ROWS`, `PredictiveTable`. Result: ~100 lines.

### govern/risk (262 → ~100 lines)

#### `src/app/govern/risk/_data/risk.data.ts` (~70 lines)
```ts
export interface DeveloperRisk { id: string; name: string; trustScore: number; status: string; components: Record<string, number>; projects: Array<{ id: string; name: string; status: string; risk: number }> }
export const DEVELOPERS: DeveloperRisk[] = [ ... ]  // 4 items
```

#### `src/app/govern/risk/_data/risk.utils.ts` (~35 lines)
```ts
export function scoreColor(n: number): string { ... }
export function scoreBorder(n: number): string { ... }
export function barColor(n: number): string { ... }
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
```

#### `src/app/govern/risk/_components/DeveloperRiskCard.tsx` (~100 lines)
```tsx
'use client'
import { useState } from 'react'
import type { DeveloperRisk } from '../_data/risk.data'
import { scoreColor, scoreBorder, barColor, statusColor, statusDot } from '../_data/risk.utils'

interface Props { dev: DeveloperRisk }
export default function DeveloperRiskCard({ dev }: Props) {
  const [expanded, setExpanded] = useState(false)
  ...
}
```
State for `expanded` moves INTO the card (it was per-card in the parent with a map anyway).

Changes to risk/page.tsx: Remove DEVELOPERS, helpers, card JSX. Import `DEVELOPERS`, `DeveloperRiskCard`. Result: ~100 lines.

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 10 — govern/homebuyer + govern/settings + govern/litigation + govern/rrc

### govern/homebuyer (243 → ~90 lines)

#### `src/app/govern/homebuyer/_data/homebuyer.data.ts` (~50 lines)
```ts
export interface HomebuyerRow { project: string; developer: string; status: string; buyers: number; capitalCr: number; possession: string; tier: 'CRITICAL' | 'WATCH' | 'CLEAR' }
export const ROWS: HomebuyerRow[] = [ ... ]  // 4 items
```

#### `src/app/govern/homebuyer/_data/homebuyer.utils.ts` (~25 lines)
```ts
export function tierConfig(t: 'CRITICAL' | 'WATCH' | 'CLEAR'): { color: string; bg: string; border: string } { ... }
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
```

#### `src/app/govern/homebuyer/_components/HomebuyerTable.tsx` (~100 lines)
```tsx
'use client'
// Desktop table + mobile cards
```

Changes to homebuyer/page.tsx: Remove data, helpers, table. Result: ~90 lines.

### govern/settings (240 → ~100 lines)

#### `src/app/govern/settings/_data/settings.data.ts` (~40 lines)
```ts
export const ROLE_DISPLAY: Record<string, string> = { ... }
export const NAME_MAP: Record<string, string> = { ... }
export const DATA_SOURCES = [
  { name: 'K-RERA Portal', frequency: 'Every 6 hours', lastSynced: '2026-05-25 08:00' },
  ...
]
```

#### `src/app/govern/settings/_components/NotificationToggles.tsx` (~60 lines)
```tsx
'use client'
import { useState } from 'react'
// 4 notification preference toggles with state
export default function NotificationToggles() { ... }
```
State for toggles moves INTO this component.

#### `src/app/govern/settings/_components/DataFreshnessTable.tsx` (~50 lines)
```tsx
// Pure presentational, no 'use client' needed
import { DATA_SOURCES } from '../_data/settings.data'
export default function DataFreshnessTable() { ... }
```

Changes to settings/page.tsx: Remove data, inline components. Import sections. Keep state: `demoMode`, `officer` from localStorage. Result: ~100 lines.

### govern/litigation (237 → ~100 lines)

#### `src/app/govern/litigation/_data/litigation.utils.ts` (~70 lines)
```ts
export function daysSince(d: string): number { ... }
export function daysUntil(d: string): number { ... }
export function fmtDate(d: string): string { ... }
export function severityOrder(s: string): number { ... }
export function leftBorder(s: string): string { ... }
export function caseTypeColor(t: string): string { ... }
export function caseTypeDot(t: string): string { ... }
export function severityTextColor(s: string): string { ... }
export function severityDot(s: string): string { ... }
export function courtCategory(court: string): string { ... }
export function getSurveyNumbers(projectId: string): string { ... }
```

#### `src/app/govern/litigation/_components/LitigationCard.tsx` (~80 lines)
```tsx
// Each case card — extract from the map() inside the filter results
```

Changes to litigation/page.tsx: Remove helpers, card JSX. Import utils and LitigationCard. Result: ~100 lines.

### govern/rrc (205 → ~100 lines)

#### `src/app/govern/rrc/_data/rrc.data.ts` (~60 lines)
```ts
export const STATUS_CONFIG = { ... }
export interface RRCItem { id: string; project: string; developer: string; ... }
export const RRCS: RRCItem[] = [ ... ]  // 3 items
export function fmtDate(d: string): string { ... }
```

#### `src/app/govern/rrc/_components/RRCCard.tsx` (~80 lines)
```tsx
'use client'
import type { RRCItem } from '../_data/rrc.data'
// Individual RRC card with progress bar
```

Changes to rrc/page.tsx: Remove data, cards. Import `RRCS`, `RRCCard`. Result: ~100 lines.

**Verify:** `bun run build` passes

---

## Commit 11 — certificate/CertificateContent + developer/DeveloperContent

### CertificateContent (199 → ~120 lines)

The file is 199 lines — only 49 over the limit. Two targeted extractions suffice.

#### `src/app/certificate/[id]/_data/certificate.utils.ts` (~35 lines)
```ts
export function fmtDate(d: string): string { ... }
export function fmtDateTime(d: string): string { ... }
export function resultColor(r: string): string { ... }
export function resultBg(r: string): string { ... }
export function statusConfig(s: string): { banner: string; text: string; label: string } { ... }
```

#### `src/app/certificate/[id]/_components/ResultIcon.tsx` (~15 lines)
```tsx
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
interface Props { result: string }
export default function ResultIcon({ result }: Props) { ... }
```

Changes to CertificateContent.tsx: Remove helpers and `ResultIcon`. Import from `_data/` and `_components/`. Result: ~120 lines.

### DeveloperContent (283 → ~115 lines)

#### `src/app/developer/[id]/_data/developer.data.ts` (~40 lines)
```ts
export const TX = { en: { ... }, kn: { ... } } as const
export const COMPONENT_SCORES: Record<string, string> = {
  qpr_compliance: 'QPR Compliance',
  complaint_density: 'Complaint Density',
  completion_rate: 'Completion Rate',
}
```

#### `src/app/developer/[id]/_data/developer.utils.ts` (~25 lines)
```ts
export function scoreColor(n: number): string { ... }
export function fmtDate(d: string): string { ... }
export function riskColor(n: number): string { ... }
export function riskBarColor(n: number): string { ... }
```

#### `src/app/developer/[id]/_components/DeveloperHero.tsx` (~60 lines)
```tsx
// Trust score + status badge + years active + 4 stat cards
```

#### `src/app/developer/[id]/_components/ProjectCards.tsx` (~60 lines)
```tsx
// Project cards grid with units sold bar, risk score, completion date, CTA
```

Changes to DeveloperContent.tsx: Remove TX, COMPONENT_SCORES, helpers, hero JSX, project cards. Result: ~115 lines.

**Verify:** `bunx tsc --noEmit` passes

---

## Commit 12 — RiskTimeline + VantisIntelligence

### RiskTimeline (251 → ~130 lines)

#### `src/components/govern/_components/TimelineTooltip.tsx` (~30 lines)
```tsx
// CustomTooltip component — currently defined inline
interface Props { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }
export default function TimelineTooltip({ active, payload, label }: Props) { ... }
```

#### `src/components/govern/_components/ScoreDot.tsx` (~35 lines)
```tsx
// ScoreDot for the recharts dot render prop
interface Props { cx?: number; cy?: number; payload?: { highlight?: boolean }; onDotClick: (i: number) => void; index: number }
export default function ScoreDot(props: Props) { ... }
```

Changes to RiskTimeline.tsx: Remove `CustomTooltip`, `ScoreDot`. Import from `_components/`. Result: ~130 lines.

### VantisIntelligence (231 → ~120 lines)

#### `src/components/shared/_data/vantis-intelligence.data.ts` (~40 lines)
```ts
export const GOVERN_SUGGESTIONS = [ 'Show me QPR defaults', 'Ozone Urbana risk score', ... ]
export const PUBLIC_SUGGESTIONS = [ 'Check Ozone Urbana', 'File a complaint', ... ]
export function findResponse(query: string): string { ... }  // keyword matcher against chatbot-responses.json
```

Changes to VantisIntelligence.tsx: Remove `GOVERN_SUGGESTIONS`, `PUBLIC_SUGGESTIONS`, `findResponse`. Import from `_data/`. Result: ~120 lines.

**Verify:** `bun run build` passes

---

## Commit 13 — app/page.tsx + project/[id]/page.tsx

### app/page.tsx (248 → ~110 lines)

#### `src/app/_data/home.data.ts` (~50 lines)
```ts
export const TRANSLATIONS = {
  en: { title: 'Is this project safe?', searchPlaceholder: '...', ... },
  kn: { title: 'ಈ ಯೋಜನೆ ಸುರಕ್ಷಿತವೇ?', ... },
} as const
export type Lang = keyof typeof TRANSLATIONS
```

#### `src/app/_data/home.utils.ts` (~20 lines)
```ts
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
```

#### `src/app/_components/PublicSearchBar.tsx` (~100 lines)
```tsx
'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import projects from '@/data/projects.json'
import { statusColor, statusDot } from '../_data/home.utils'

interface Props { lang: 'en' | 'kn'; t: Record<string, string> }
export default function PublicSearchBar({ lang, t }: Props) {
  const [filter, setFilter] = useState<'project' | 'developer' | 'rera'>('project')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  // All search logic lives here
}
```
All search-related state moves INTO this component.

Changes to app/page.tsx: Remove TRANSLATIONS, helpers, search JSX. The page becomes a server-side shell that renders `<PublicSearchBar>`, stats section, and trust strip. Keep the `lang` toggle state since it controls both the search bar language and the stats text. Result: ~110 lines.

### project/[id]/page.tsx (346 → ~130 lines)

The file is a server component (no 'use client'). Five targeted extractions:

#### `src/app/project/[id]/_data/project-public.types.ts` (~50 lines)
```ts
export interface LitigationItem { ... }
export interface QPREntry { ... }
export interface Submission { ... }
export interface Project { ... }
```

#### `src/app/project/[id]/_data/project-public.utils.ts` (~35 lines)
```ts
export function statusColor(s: string): string { ... }
export function statusDot(s: string): string { ... }
export function statusSentence(project: Project): string { ... }
export function qprKey(quarter: string): string { ... }
export function dotClasses(status: string): string { ... }
export function dotLabel(status: string): string { ... }
export function formatDate(d: string): string { ... }
```

#### `src/app/project/[id]/_components/PublicProjectHeader.tsx` (~50 lines)
```tsx
// ScoreBar + status badge + plain-language sentence
// No 'use client' — pure presentational, no hooks
import type { Project } from '../_data/project-public.types'
import { statusColor, statusDot, statusSentence } from '../_data/project-public.utils'

interface Props { project: Project }
export default function PublicProjectHeader({ project }: Props) { ... }
```

#### `src/app/project/[id]/_components/PublicProjectFacts.tsx` (~50 lines)
```tsx
// 8-cell facts grid + survey numbers
// No 'use client'
```

#### `src/app/project/[id]/_components/PublicQPRDots.tsx` (~55 lines)
```tsx
// QPR timeline with 8 colored dots + legend
// No 'use client'
import type { Submission } from '../_data/project-public.types'
import { qprKey, dotClasses, dotLabel } from '../_data/project-public.utils'

interface Props { submission: Submission | undefined; quarters: string[] }
export default function PublicQPRDots({ submission, quarters }: Props) { ... }
```

#### `src/app/project/[id]/_components/PublicLitigationList.tsx` (~50 lines)
```tsx
// Court cases list + empty state
// No 'use client'
import type { LitigationItem } from '../_data/project-public.types'
import { formatDate } from '../_data/project-public.utils'

interface Props { litigation: LitigationItem[] }
export default function PublicLitigationList({ litigation }: Props) { ... }
```

Changes to project/[id]/page.tsx: Remove all types, helpers, ScoreBar, sections. Import and compose extracted components. The `generateStaticParams` export stays in the page file. Result: ~130 lines.

**Final verify:** Run all CI gates:
```bash
bunx tsc --noEmit
bun lint
bun run build
bun test
OVER=$(find src/app src/components -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -exec wc -l {} + 2>/dev/null \
  | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "Files still over 150 lines:"; echo "$OVER"; exit 1; fi
echo "All files ≤150 lines. Mission complete."
```

---

## Summary of all new files

| File | ~Lines | Export |
|------|--------|--------|
| `src/app/govern/projects/[id]/_data/project-detail.types.ts` | 55 | types |
| `src/app/govern/projects/[id]/_data/project-detail.utils.ts` | 65 | functions |
| `src/app/govern/projects/[id]/_data/project-detail.data.ts` | 25 | ESCROW, TABS |
| `src/app/govern/projects/[id]/_components/OverviewTab.tsx` | 110 | default |
| `src/app/govern/projects/[id]/_components/QPRTab.tsx` | 100 | default |
| `src/app/govern/projects/[id]/_components/FinancialTab.tsx` | 70 | default |
| `src/app/govern/projects/[id]/_components/LitigationTab.tsx` | 70 | default |
| `src/app/govern/projects/[id]/_components/TimelineTab.tsx` | 40 | default |
| `src/app/govern/projects/[id]/_components/ActionsTab.tsx` | 100 | default |
| `src/app/govern/projects/[id]/_components/DocumentsTab.tsx` | 130 | default |
| `src/app/govern/complaints/_data/complaints.data.ts` | 80 | types + data |
| `src/app/govern/complaints/_data/complaints.utils.ts` | 35 | functions |
| `src/app/govern/complaints/_components/ComplaintsTable.tsx` | 120 | default |
| `src/app/govern/complaints/_components/ComplaintsModals.tsx` | 80 | default |
| `src/app/govern/scanner/_data/scanner.data.ts` | 85 | types + data |
| `src/app/govern/scanner/_data/scanner.utils.ts` | 50 | functions |
| `src/app/govern/scanner/_components/ScannerQueue.tsx` | 60 | default |
| `src/app/govern/scanner/_components/AssessmentCard.tsx` | 100 | default |
| `src/app/govern/scanner/_components/ScannerModals.tsx` | 80 | default |
| `src/app/govern/scanner/_components/ApprovalSuccess.tsx` | 60 | default |
| `src/app/govern/notices/_data/notices.data.ts` | 30 | VIOLATION_TYPES |
| `src/app/govern/notices/_data/notice-templates.ts` | 148 | functions |
| `src/app/govern/notices/_data/notices.utils.ts` | 35 | generateNoticeText, noticeMeta |
| `src/app/govern/notices/_components/NoticeForm.tsx` | 90 | default |
| `src/app/govern/notices/_components/NoticePreview.tsx` | 80 | default |
| `src/app/govern/qpr/_data/qpr-tracker.utils.ts` | 60 | functions |
| `src/app/govern/qpr/_data/qpr-tracker.data.ts` | 30 | ALL_ROWS, TABS |
| `src/app/govern/qpr/_components/QPRTable.tsx` | 120 | default |
| `src/app/govern/qpr/_components/BatchNoticeModal.tsx` | 50 | default |
| `src/app/complaint/file/_data/file-complaint.data.ts` | 60 | TX, NATURES |
| `src/app/complaint/file/_components/Header.tsx` | 30 | default |
| `src/app/complaint/file/_components/Step1.tsx` | 60 | default |
| `src/app/complaint/file/_components/Step2.tsx` | 70 | default |
| `src/app/complaint/file/_components/Step3.tsx` | 60 | default |
| `src/app/complaint/file/_components/SuccessScreen.tsx` | 50 | default |
| `src/app/complaint/track/_data/track-complaint.data.ts` | 65 | TX, ALL_STEPS, NEXT_STEPS |
| `src/app/complaint/track/_data/track-complaint.utils.ts` | 35 | functions |
| `src/app/complaint/track/_components/ProgressBar.tsx` | 50 | default |
| `src/app/complaint/track/_components/TrackContent.tsx` | 100 | default |
| `src/app/govern/_data/govern-layout.data.ts` | 30 | OFFICERS, NAV |
| `src/app/govern/_data/govern-layout.utils.ts` | 20 | functions |
| `src/app/govern/_components/LoginScreen.tsx` | 80 | default |
| `src/app/govern/_components/SidebarNav.tsx` | 60 | default |
| `src/app/govern/_data/command-centre.data.ts` | 40 | KPIs |
| `src/app/govern/_data/command-centre.utils.ts` | 30 | functions |
| `src/app/govern/_components/KarnatakaMapSection.tsx` | 90 | default |
| `src/app/govern/_components/LiveFeedCards.tsx` | 70 | default |
| `src/app/govern/predictive/_data/predictive.data.ts` | 55 | types + ROWS |
| `src/app/govern/predictive/_data/predictive.utils.ts` | 30 | functions |
| `src/app/govern/predictive/_components/PredictiveTable.tsx` | 110 | default |
| `src/app/govern/risk/_data/risk.data.ts` | 70 | types + DEVELOPERS |
| `src/app/govern/risk/_data/risk.utils.ts` | 35 | functions |
| `src/app/govern/risk/_components/DeveloperRiskCard.tsx` | 100 | default |
| `src/app/govern/homebuyer/_data/homebuyer.data.ts` | 50 | types + ROWS |
| `src/app/govern/homebuyer/_data/homebuyer.utils.ts` | 25 | functions |
| `src/app/govern/homebuyer/_components/HomebuyerTable.tsx` | 100 | default |
| `src/app/govern/settings/_data/settings.data.ts` | 40 | constants |
| `src/app/govern/settings/_components/NotificationToggles.tsx` | 60 | default |
| `src/app/govern/settings/_components/DataFreshnessTable.tsx` | 50 | default |
| `src/app/govern/litigation/_data/litigation.utils.ts` | 70 | functions |
| `src/app/govern/litigation/_components/LitigationCard.tsx` | 80 | default |
| `src/app/govern/rrc/_data/rrc.data.ts` | 60 | types + RRCS + fmtDate |
| `src/app/govern/rrc/_components/RRCCard.tsx` | 80 | default |
| `src/app/certificate/[id]/_data/certificate.utils.ts` | 35 | functions |
| `src/app/certificate/[id]/_components/ResultIcon.tsx` | 15 | default |
| `src/app/developer/[id]/_data/developer.data.ts` | 40 | TX, COMPONENT_SCORES |
| `src/app/developer/[id]/_data/developer.utils.ts` | 25 | functions |
| `src/app/developer/[id]/_components/DeveloperHero.tsx` | 60 | default |
| `src/app/developer/[id]/_components/ProjectCards.tsx` | 60 | default |
| `src/components/govern/_components/TimelineTooltip.tsx` | 30 | default |
| `src/components/govern/_components/ScoreDot.tsx` | 35 | default |
| `src/components/shared/_data/vantis-intelligence.data.ts` | 40 | data + findResponse |
| `src/app/_data/home.data.ts` | 50 | TRANSLATIONS |
| `src/app/_data/home.utils.ts` | 20 | functions |
| `src/app/_components/PublicSearchBar.tsx` | 100 | default |
| `src/app/project/[id]/_data/project-public.types.ts` | 50 | types |
| `src/app/project/[id]/_data/project-public.utils.ts` | 35 | functions |
| `src/app/project/[id]/_components/PublicProjectHeader.tsx` | 50 | default |
| `src/app/project/[id]/_components/PublicProjectFacts.tsx` | 50 | default |
| `src/app/project/[id]/_components/PublicQPRDots.tsx` | 55 | default |
| `src/app/project/[id]/_components/PublicLitigationList.tsx` | 50 | default |

**Total new files: 76**

---

## `use client` placement rules

After each extraction, verify:
- Files that import `useState`, `useEffect`, `useRef`, `usePathname`, `useSearchParams`, `useRouter`, or Framer Motion hooks → **must have** `'use client'`
- Pure data files (`.data.ts`, `.utils.ts`, `.types.ts`) → **must NOT have** `'use client'`
- Components that only render JSX from props (no hooks) → no `'use client'` needed; the parent that passes props manages reactivity

---

## Commit sequence checklist

- [ ] Commit 1: `refactor(govern/projects/[id]): extract types, utils, data constants`
- [ ] Commit 2: `refactor(govern/projects/[id]): extract 7 tab components, shrink to ~115 lines` + `bun run build`
- [ ] Commit 3: `refactor(govern/complaints): extract data, utils, table, modals`
- [ ] Commit 4: `refactor(govern/scanner): extract data, utils, queue, assessment, modals, success` + `bun run build`
- [ ] Commit 5: `refactor(govern/notices): extract templates, utils, form, preview`
- [ ] Commit 6: `refactor(govern/qpr): extract data, utils, table, batch modal` + `bun run build`
- [ ] Commit 7: `refactor(complaint/file): extract data and step components`
- [ ] Commit 8: `refactor(complaint/track, govern/layout): extract data and components` + `bun run build`
- [ ] Commit 9: `refactor(govern/page, govern/predictive, govern/risk): extract data and components`
- [ ] Commit 10: `refactor(govern/homebuyer, govern/settings, govern/litigation, govern/rrc): extract` + `bun run build`
- [ ] Commit 11: `refactor(certificate, developer): extract utils and components`
- [ ] Commit 12: `refactor(RiskTimeline, VantisIntelligence): extract subcomponents` + `bun run build`
- [ ] Commit 13: `refactor(app/page, project/[id]/page): extract data and components` + full CI gates
