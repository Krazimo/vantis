# Implementation Plan: architecture-theme-polish

## Codebase Audit Summary

### Current state
- `src/app/` — 21 routes, well-structured with co-located `_components/` and `_data/` per route.  
  Already thin pages; most `page.tsx` are under 90 lines. `govern/qpr/page.tsx` is 102 lines (over limit).  
  `project/[id]/page.tsx` is exactly 150 lines (passes but zero headroom).
- `src/components/` — 4 subdirs: `govern/`, `public/`, `shared/`, `ui/`
  - `govern/`: 8 files. `RiskTimeline.tsx`, `RiskDetailPanel.tsx`, `risk-timeline.data.ts` are **alive** (imported by TimelineTab). The other 5 (`AlertCard`, `AssessmentCard`, `CommandCentre`, `QPRTracker`, `Sidebar`) are **dead stubs** (2-line placeholder files, never imported).
  - `public/`: 6 files. `CertificateCard.tsx` is **alive** (imported by 2 routes). The other 5 are **dead stubs**.
  - `shared/`: 6 files. `VantisIntelligence.tsx`, `ChatPanel.tsx`, `chatbot.utils.ts`, `KarnatakaMap.tsx` are **alive**. `DataFreshness.tsx` and `RiskBadge.tsx` are **dead stubs**.
  - `ui/`: vendored shadcn primitives — **DO NOT TOUCH**.
- `src/features/` — **does not exist yet**.
- `src/lib/` — `claude.ts`, `scoring.ts`, `utils.ts`, `divya-villas-*.ts` — cross-cutting, NOT moved.

### Type duplicates (exact counts from grep)
| Interface | Locations |
|-----------|-----------|
| `Project` | `_data/portal.data.ts`, `complaint/file/_data`, `developer/[id]/_data`, `govern/_components/DistrictPanel`, `govern/_components/LiveFeeds`, `govern/page.tsx` (inline), `govern/projects/_data`, `govern/projects/[id]/_data/project-detail.types.ts`, `project/[id]/_data` |
| `QPREntry` | `govern/projects/[id]/_data/project-detail.types.ts`, `govern/qpr/_data/qpr-tracker.data.ts`, `project/[id]/_data/project-profile.data.ts` |
| `QPRRow` | `govern/projects/[id]/_data/project-detail.types.ts`, `govern/qpr/_data/qpr-tracker.data.ts` |
| `LitigationItem` | `govern/_components/LiveFeeds.tsx` (inline), `govern/litigation/_data/litigation-watchlist.data.ts`, `govern/projects/[id]/_data/project-detail.types.ts`, `project/[id]/_data/project-profile.data.ts` |
| `Developer` | `developer/[id]/_data/developer.data.ts`, `govern/projects/[id]/_data/project-detail.types.ts`, `govern/risk/_data/risk.data.ts` |
| `Complaint` | `complaint/track/_data/track-complaint.data.ts`, `govern/complaints/_data/complaints.data.ts` |
| `Language` | `_data/portal.data.ts`, `complaint/file/_data`, `complaint/track/_data`, `developer/[id]/_data` |

### Token color usage (to be replaced)
- `text-off-white`, `bg-off-white`, `text-gold`, `bg-gold`, `border-gold`, `text-gold-light`, `text-gold-dim`, `bg-surface`, `bg-surface2`, `text-gray`, `text-gray-light`, `bg-gray`, `text-silver`, `bg-silver`, `border-border-soft`, `border-border-gold` — ~785 class usages across ~90 files
- Hardcoded hex in NoticePreview: `bg-[#FAFAF7]`, `bg-[#F0EEE6]`, `bg-[#D0CCB8]`, `text-[#0A3D62]`, `text-[#1A1A28]`
- `font-syne` — 100 usages across routes
- `font-mono` — 203 usages; most are RERA IDs/codes (keep), some are headings/stats (remove)

### Largest files (that may require splitting)
- `project/[id]/page.tsx` — 150 lines (at limit)
- `govern/qpr/page.tsx` — 102 lines (over 100 limit for pages)
- All others under 150 lines currently

---

## Color Token Mapping Reference

Use this as the authoritative replacement guide in all phases:

| Old token | New token |
|-----------|-----------|
| `bg-surface` | `bg-card` |
| `bg-surface2` | `bg-muted` |
| `text-off-white` | `text-foreground` |
| `bg-gold` | `bg-primary` |
| `text-gold` | `text-primary` |
| `border-gold` (border color) | `border-primary` |
| `text-gold-light` | `text-primary/80` |
| `text-gold-dim` | `text-primary/60` |
| `bg-gold/10`, `/20`, etc. | `bg-primary/10`, etc. |
| `text-gray` | `text-muted-foreground` |
| `text-gray-light` | `text-muted-foreground/80` |
| `bg-gray` | `bg-muted` |
| `border-border-soft` | `border-border/60` |
| `border-border-gold` | `border-primary/20` |
| `text-silver` | `text-muted-foreground` |
| `bg-silver` | `bg-muted` |
| `bg-surface2/60` | `bg-muted/60` |
| `bg-surface/60` | `bg-card/60` |
| `hover:bg-surface2` | `hover:bg-muted` |
| `hover:bg-gold/10` | `hover:bg-primary/10` |
| `hover:text-gold` | `hover:text-primary` |
| Status: `text-green` (COMPLIANT) | `text-status-compliant` |
| Status: `text-amber` (CAUTION) | `text-status-caution` |
| Status: `text-red` (RISK) | `text-status-risk` |
| Status: `bg-green` dot | `bg-status-compliant` |
| Status: `bg-amber` dot | `bg-status-caution` |
| Status: `bg-red` dot | `bg-status-risk` |
| Notice: `bg-[#FAFAF7]` | `bg-notice-paper` |
| Notice: `border-[#D0CCB8]` | `border-notice-border` |
| Notice: `bg-[#F0EEE6]` | `bg-notice-header` |
| Notice: `text-[#0A3D62]` | `text-notice-krera` |
| Notice: `text-[#1A1A28]` | `text-notice-body` |

> **Important:** `green`, `amber`, `red`, `blue` tokens remain in tailwind.config.ts for non-status uses (e.g., litigation severity, escrow status, alert pings). Only replace green/amber/red with status variants in the StatusBadge/statusColor/statusDot context.

---

## Phase A: Scaffold Features Structure
**Goal:** Create directory tree; update tailwind content paths. Zero changes to application code.

### Step A1 — Create directory structure
```
src/features/
  govern/
    components/   (empty)
    hooks/        (empty)
    types/        (empty)
  public/
    components/   (empty)
    types/        (empty)
  shared/
    components/   (empty)
    types/        (empty)
```
Use `mkdir -p` for each. Add a `.gitkeep` in each empty dir to make the commit meaningful.

### Step A2 — Update tailwind.config.ts content paths
**File:** `tailwind.config.ts`  
Add `"./src/features/**/*.{js,ts,jsx,tsx,mdx}"` to the `content` array alongside the existing paths.

### Commit A
```
feat(arch): scaffold src/features directory structure and update tailwind content
```

---

## Phase B: Canonical Type Files
**Goal:** Define ONE canonical definition of each shared type. No consumer imports changed yet.

### Step B1 — `src/features/govern/types/project.types.ts`

This is the superset of all `Project` variants found across the codebase. All optional fields (not present in every variant) carry `?`.

```typescript
export interface Project {
  id: string
  name: string
  rera: string
  developer_id?: string
  developer_name: string
  location: string
  survey_numbers?: string[]
  type?: string
  total_units?: number
  units_sold?: number
  declared_cost_crore?: number
  completion_date?: string
  registration_date?: string
  registration_valid_until?: string
  extensions?: number
  status: string
  risk_score: number
  certificate_id?: string | null
  certificate_status?: string
  complaints_pending: number
  complaints_resolved?: number
  qpr?: Record<string, { status: string; filed_date: string | null; completion_pct: number | null }>
  litigation?: Array<{ type: string; court: string; filed: string; status: string }>
  escrow_pct?: number
}
```

### Step B2 — `src/features/govern/types/qpr.types.ts`

```typescript
export interface QPREntry {
  status: string
  filed_date: string | null
  completion_pct: number | null
}

export interface QPRRow {
  quarter: string
  entry: QPREntry
}
```

### Step B3 — `src/features/govern/types/litigation.types.ts`

Superset of all `LitigationItem` variants:

```typescript
export interface LitigationItem {
  id: string
  project_id?: string
  project_name?: string
  developer_name?: string
  type: string
  court: string
  case_number?: string
  filed_date?: string
  filed?: string
  plaintiff?: string
  cause?: string
  relief_sought_crore?: number | null
  status: string
  next_hearing?: string
  severity: string
  survey_numbers?: string[]
}
```

### Step B4 — `src/features/govern/types/developer.types.ts`

Superset of all `Developer` variants:

```typescript
export interface Developer {
  id: string
  name: string
  city?: string
  state?: string
  trust_score: number
  total_projects?: number
  active_projects?: number
  completed_projects?: number
  years_active?: number
  contact_email?: string
  contact_phone?: string
  status?: string
  qpr_compliance?: number
  complaint_density?: number
  completion_rate?: number
  projects?: Array<{ id: string; name: string; status: string; risk_score: number }>
}
```

### Step B5 — `src/features/govern/types/complaint.types.ts`

Superset of `Complaint` from complaints.data and track-complaint.data:

```typescript
export interface Complaint {
  id: string
  project_id?: string
  project_name?: string
  developer_name?: string
  category: string
  status: string
  filed_date: string
  hearing_date?: string | null
  resolution_date?: string | null
  resolution_summary?: string | null
  description?: string
  amount_at_risk_lakh?: number
  assigned_officer?: string
  ref?: string
  steps?: Array<{ key: string; label: string; date?: string }>
}
```

### Step B6 — `src/features/shared/types/i18n.types.ts`

```typescript
export type Language = 'en' | 'kn'
```

### Commit B
```
feat(types): add canonical govern and shared type definitions in src/features
```

---

## Phase C: Migrate Type Imports
**Goal:** Replace every local duplicate type definition with an import from the canonical file. Run `bunx tsc --noEmit` after each sub-step.

The verification check greps for `interface Project ` (with space) — so ALL local `interface Project` definitions must be removed.

### Step C1 — Remove duplicate `Project` definitions

Files to update (remove local `interface Project`, import from canonical):

1. **`src/app/_data/portal.data.ts`**  
   Remove `export interface Project { ... }` (6 fields).  
   Add: `import type { Project } from '@/features/govern/types/project.types'`  
   Keep all other exports (`FilterType`, `Language`, `Tx`, `TRANSLATIONS`, helpers) — but remove local `Language` (now from `@/features/shared/types/i18n.types`).

2. **`src/app/complaint/file/_data/file-complaint.data.ts`**  
   Remove `export interface Project { id: string; name: string; developer_name: string; location: string }`.  
   Add import from canonical.  
   Remove `export type Language = 'en' | 'kn'` — import from `@/features/shared/types/i18n.types`.

3. **`src/app/developer/[id]/_data/developer.data.ts`**  
   Remove `export interface Project { ... }` (the developer-specific Project).  
   Remove `export interface Developer { ... }`.  
   Add imports from `@/features/govern/types/project.types` and `@/features/govern/types/developer.types`.  
   Remove `export type Language = 'en' | 'kn'` — import from `@/features/shared/types/i18n.types`.

4. **`src/app/govern/_components/DistrictPanel.tsx`**  
   Remove `interface Project { id: string; name: string; developer_name: string; location: string; status: string; risk_score: number; complaints_pending: number }`.  
   Add import from canonical.

5. **`src/app/govern/_components/LiveFeeds.tsx`**  
   Remove `interface Project { ... }` and `interface LitigationItem { ... }`.  
   Add imports from canonical types.

6. **`src/app/govern/page.tsx`**  
   Remove inline `interface Project { ... }` and `interface LitigationItem { ... }` (lines 12–13).  
   Add imports from canonical types.

7. **`src/app/govern/projects/_data/project-registry.data.ts`**  
   Remove `export interface Project { ... }` (12 fields).  
   Add import from canonical.  
   Keep all other exports (StatusFilter, PROJECTS, helpers).

8. **`src/app/govern/projects/[id]/_data/project-detail.types.ts`**  
   Remove ALL interfaces (`Project`, `Developer`, `LitigationItem`, `QPREntry`, `QPRRow`).  
   Replace with re-exports from canonical locations:
   ```typescript
   export type { Project } from '@/features/govern/types/project.types'
   export type { Developer } from '@/features/govern/types/developer.types'
   export type { LitigationItem } from '@/features/govern/types/litigation.types'
   export type { QPREntry, QPRRow } from '@/features/govern/types/qpr.types'
   ```
   Keep `EscrowData` (unique to this file, not duplicated).

9. **`src/app/project/[id]/_data/project-profile.data.ts`**  
   Remove `export interface QPREntry { ... }`, `export interface LitigationItem { ... }`, `export interface Project { ... }`.  
   Add imports from canonical types.

### Step C2 — Remove duplicate `QPREntry`/`QPRRow` definitions

1. **`src/app/govern/qpr/_data/qpr-tracker.data.ts`**  
   Remove `export interface QPREntry { ... }` and `export interface QPRRow { ... }`.  
   Add imports from `@/features/govern/types/qpr.types`.

2. **`src/app/govern/projects/[id]/_components/QPRTab.tsx`**  
   Remove `interface QPRRow { quarter: string; entry: QPREntry }` — this is now imported from canonical via project-detail.types.ts re-exports.

### Step C3 — Remove duplicate `LitigationItem` definitions
(Already handled in C1 for govern/_components and project/[id]. The `govern/litigation/_data/litigation-watchlist.data.ts` defines its own):

1. **`src/app/govern/litigation/_data/litigation-watchlist.data.ts`**  
   Remove `export interface LitigationItem { ... }`.  
   Add import from `@/features/govern/types/litigation.types`.

### Step C4 — Remove duplicate `Developer` definitions

1. **`src/app/govern/risk/_data/risk.data.ts`**  
   Remove `export interface Developer { ... }`.  
   Add import from `@/features/govern/types/developer.types`.

### Step C5 — Remove duplicate `Complaint` definition

1. **`src/app/complaint/track/_data/track-complaint.data.ts`**  
   Remove `export interface Complaint { ... }`.  
   Add import from `@/features/govern/types/complaint.types`.  
   Remove `export type Language = 'en' | 'kn'` — import from `@/features/shared/types/i18n.types`.

2. **`src/app/govern/complaints/_data/complaints.data.ts`**  
   Remove `export interface Complaint { ... }`.  
   Add import from `@/features/govern/types/complaint.types`.

### Step C6 — Verify: `bunx tsc --noEmit` must pass

### Commit C
```
refactor(types): consolidate duplicate type definitions to canonical src/features/*/types
```

---

## Phase D: Extract Shared Govern Components

### Step D1 — `src/features/govern/components/StatusBadge.tsx`

The project-status badge (COMPLIANT / CAUTION / HIGH RISK) appears in: `ProjectTable`, `HomebuyerTable`, `PredictiveTable`, `DistrictPanel`, and `LiveFeeds`. Extract it:

```typescript
'use client'
import { cn } from '@/lib/utils'

type Status = 'COMPLIANT' | 'CAUTION' | 'HIGH RISK' | string

interface StatusBadgeProps {
  status: Status
  className?: string
}

function dotClass(s: Status) {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}
function textClass(s: Status) {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', textClass(status), className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClass(status))} />
      {status}
    </span>
  )
}
```

Update the following to use `StatusBadge` from `@/features/govern/components/StatusBadge`:
- `src/app/govern/projects/_components/ProjectTable.tsx` (currently has inline statusColor/statusDot helpers)
- `src/app/govern/homebuyer/_components/HomebuyerTable.tsx`
- `src/app/govern/predictive/_components/PredictiveTable.tsx`
- `src/app/govern/_components/DistrictPanel.tsx`
- `src/app/govern/_components/LiveFeeds.tsx`
- `src/app/govern/complaints/_components/ComplaintsTable.tsx`

After migrating, remove the per-file `statusColor`/`statusDot` helper functions that are no longer needed.

### Step D2 — `src/features/govern/components/StatCard.tsx`

The KPI stat card in `govern/page.tsx` (icon + value + label + subtext) follows the same pattern as stat cards in `homebuyer/page.tsx` and `predictive/page.tsx`. Extract:

```typescript
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  icon?: LucideIcon
  valueColor?: string   // Tailwind class e.g. 'text-primary', 'text-destructive'
  className?: string
}

export function StatCard({ label, value, sub, icon: Icon, valueColor = 'text-primary', className }: StatCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-sm p-4', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-xs leading-tight">{label}</span>
        {Icon && <Icon className={cn('w-4 h-4 shrink-0', valueColor)} />}
      </div>
      <div className={cn('text-2xl sm:text-3xl font-bold', valueColor)}>{value}</div>
      {sub && <div className="text-muted-foreground text-xs mt-1">{sub}</div>}
    </div>
  )
}
```

Update to use StatCard:
- `src/app/govern/page.tsx` (KPIs grid — already maps over an array, just swap the JSX)
- `src/app/govern/homebuyer/page.tsx` (3 metric cards)
- `src/app/govern/predictive/page.tsx` (summary cards)

### Step D3 — `src/features/govern/components/FilterBar.tsx`

The tab-based filter bar (All / Status1 / Status2 / ...) appears in: `complaints/page.tsx`, `qpr/page.tsx`, `litigation/page.tsx`, `projects/page.tsx`. Extract:

```typescript
interface FilterBarProps {
  tabs: Array<{ key: string; label: string; count?: number }>
  active: string
  onChange: (key: string) => void
  className?: string
}

export function FilterBar({ tabs, active, onChange, className }: FilterBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150',
            active === tab.key
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/60'
          )}
        >
          {tab.label}
          {tab.count !== undefined && <span className="ml-1.5 opacity-60">{tab.count}</span>}
        </button>
      ))}
    </div>
  )
}
```

Update to use FilterBar:
- `src/app/govern/complaints/page.tsx`
- `src/app/govern/qpr/page.tsx` (also brings page.tsx under 100 lines)
- `src/app/govern/litigation/page.tsx`
- `src/app/govern/projects/page.tsx`

### Step D4 — `src/features/govern/components/DataTable.tsx`

Generic column-definition table with desktop/mobile split. Used by ≥2 routes.

```typescript
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  headerClassName?: string
  cellClassName?: string
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[]
  rows: T[]
  mobileCard: (row: T) => React.ReactNode
  emptyMessage?: string
  rowClassName?: (row: T) => string
}

export function DataTable<T extends { id: string }>({ columns, rows, mobileCard, emptyMessage = 'No data', rowClassName }: DataTableProps<T>) {
  if (rows.length === 0) return <p className="text-muted-foreground text-sm py-8 text-center">{emptyMessage}</p>
  return (
    <>
      <div className="hidden md:block bg-card border border-border rounded-sm overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              {columns.map(col => (
                <th key={col.key} className={cn('text-left px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold', col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={cn('border-b border-border last:border-0 hover:bg-muted/40 transition-colors duration-150', rowClassName?.(row))}>
                {columns.map(col => (
                  <td key={col.key} className={cn('px-4 py-3', col.cellClassName)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-3 mb-6">
        {rows.map(row => <div key={row.id}>{mobileCard(row)}</div>)}
      </div>
    </>
  )
}
```

Migrate these routes to DataTable (simplest tables, no complex expand/batch behavior):
- `src/app/govern/homebuyer/_components/HomebuyerTable.tsx` — convert to use DataTable + column defs
- `src/app/govern/predictive/_components/PredictiveTable.tsx` — convert to use DataTable + column defs

`complaints/`, `qpr/`, `projects/` keep their own table components because they have complex behavior (expandable rows, batch checkboxes, row-click navigation). DataTable satisfies the ≥2 route requirement.

### Step D5 — Run `bun run build`

### Commit D
```
feat(govern): extract StatusBadge, StatCard, FilterBar, DataTable to src/features/govern/components
```

---

## Phase E: Extract Govern Hooks

### Step E1 — `src/features/govern/hooks/useOfficer.ts`

Encapsulates all localStorage officer state (read, write, parse, logout):

```typescript
'use client'
import { useState, useEffect } from 'react'
import type { Officer } from '@/app/govern/_data/govern-layout.data'

interface UseOfficerReturn {
  officer: Officer | null
  mounted: boolean
  login: (o: Officer) => void
  logout: () => void
}

export function useOfficer(): UseOfficerReturn {
  const [mounted, setMounted] = useState(false)
  const [officer, setOfficer] = useState<Officer | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('vantis_officer')
      if (stored) setOfficer(JSON.parse(stored) as Officer)
    } catch (error) { console.warn('vantis localStorage read unavailable:', error) }
  }, [])

  function login(o: Officer) {
    try { localStorage.setItem('vantis_officer', JSON.stringify(o)) } catch (error) { console.warn('vantis localStorage write unavailable:', error) }
    setOfficer(o)
  }

  function logout() {
    try { localStorage.removeItem('vantis_officer') } catch (error) { console.warn('vantis localStorage remove unavailable:', error) }
    setOfficer(null)
  }

  return { officer, mounted, login, logout }
}
```

### Step E2 — `src/features/govern/hooks/useDemoMode.ts`

```typescript
'use client'
import { useState, useEffect } from 'react'

interface UseDemoModeReturn {
  demoMode: boolean
  toggle: () => void
}

export function useDemoMode(): UseDemoModeReturn {
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('vantis_demo_mode') === 'true') setDemoMode(true)
    } catch (error) { console.warn('vantis localStorage read unavailable:', error) }

    function handleKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setDemoMode(prev => {
          const next = !prev
          try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode localStorage write unavailable:', error) }
          return next
        })
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  function toggle() {
    const next = !demoMode
    setDemoMode(next)
    try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode write unavailable:', error) }
  }

  return { demoMode, toggle }
}
```

### Step E3 — Update `govern/layout.tsx`

Replace the inline localStorage logic with hook calls:
```typescript
import { useOfficer } from '@/features/govern/hooks/useOfficer'
import { useDemoMode } from '@/features/govern/hooks/useDemoMode'

// Remove: useState for officer, demoMode; the useEffect block with localStorage reads and keydown handler
// Add: const { officer, mounted, login, logout } = useOfficer()
//      const { demoMode } = useDemoMode()
// Replace: onLogin handler → login(o)
// Replace: handleLogout → logout
```

Layout drops from ~95 lines to ~65 lines.

### Step E4 — Update `govern/settings/page.tsx`

Replace inline localStorage reads with hook calls:
```typescript
import { useOfficer } from '@/features/govern/hooks/useOfficer'
import { useDemoMode } from '@/features/govern/hooks/useDemoMode'

// Remove: local OfficerProfile interface, useState for officer/demoMode, useEffect block
// Add: const { officer } = useOfficer()
//      const { demoMode, toggle: toggleDemoMode } = useDemoMode()
```

Settings `OfficerProfile` interface: remove it; the `officer` from `useOfficer` has type `Officer` which has the needed fields. Add `NAME_MAP` lookup at render time.

### Step E5 — Run `bun run build`

### Commit E
```
feat(govern): extract useOfficer and useDemoMode hooks to src/features/govern/hooks
```

---

## Phase F: Delete Dead Code + Move Live Components

### Step F1 — Verify dead components are truly unused

Run before deleting:
```bash
for f in AlertCard AssessmentCard CommandCentre QPRTracker Sidebar \
          ComplaintSummary LanguageToggle QPRTimeline SearchBar StatusBadge \
          RiskBadge DataFreshness; do
  grep -rn "from.*components.*/$f" src/ --include='*.ts' --include='*.tsx' | grep -v "^src/components"
done
```
Expected: zero output for all. Proceed only if confirmed.

### Step F2 — Delete dead stubs

```
src/components/govern/AlertCard.tsx        ← delete
src/components/govern/AssessmentCard.tsx   ← delete
src/components/govern/CommandCentre.tsx    ← delete
src/components/govern/QPRTracker.tsx       ← delete
src/components/govern/Sidebar.tsx          ← delete
src/components/public/ComplaintSummary.tsx ← delete
src/components/public/LanguageToggle.tsx   ← delete
src/components/public/QPRTimeline.tsx      ← delete
src/components/public/SearchBar.tsx        ← delete
src/components/public/StatusBadge.tsx      ← delete
src/components/shared/RiskBadge.tsx        ← delete
src/components/shared/DataFreshness.tsx    ← delete
```

### Step F3 — Move RiskTimeline cluster to features/govern/components

Source → Destination:
```
src/components/govern/RiskTimeline.tsx      → src/features/govern/components/RiskTimeline.tsx
src/components/govern/RiskDetailPanel.tsx   → src/features/govern/components/RiskDetailPanel.tsx
src/components/govern/risk-timeline.data.ts → src/features/govern/components/risk-timeline.data.ts
```

Update `src/app/govern/projects/[id]/_components/TimelineTab.tsx`:
```typescript
// Before:
const RiskTimeline = dynamic(() => import('@/components/govern/RiskTimeline'), { ssr: false })
// After:
const RiskTimeline = dynamic(() => import('@/features/govern/components/RiskTimeline'), { ssr: false })
```

Update internal imports inside `RiskTimeline.tsx`:
```typescript
// Before: import { ... } from './risk-timeline.data'
// After: same relative path — this stays as-is since files move together
```

Delete source files after verifying build passes.

### Step F4 — Move shared components to features/shared/components

Source → Destination:
```
src/components/shared/VantisIntelligence.tsx → src/features/shared/components/VantisIntelligence.tsx
src/components/shared/ChatPanel.tsx          → src/features/shared/components/ChatPanel.tsx
src/components/shared/chatbot.utils.ts       → src/features/shared/components/chatbot.utils.ts
src/components/shared/KarnatakaMap.tsx       → src/features/shared/components/KarnatakaMap.tsx
```

Update consumers:
- `src/app/layout.tsx`: `import VantisIntelligence from '@/features/shared/components/VantisIntelligence'`
- `src/app/govern/page.tsx`: `import KarnatakaMap from '@/features/shared/components/KarnatakaMap'`
- Internal imports inside `VantisIntelligence.tsx`: update ChatPanel + chatbot.utils relative paths to same-dir (`./ChatPanel`, `./chatbot.utils`).

### Step F5 — Move CertificateCard to features/public/components

```
src/components/public/CertificateCard.tsx → src/features/public/components/CertificateCard.tsx
```

Update consumer:
- `src/app/project/[id]/page.tsx`: `import CertificateCard from '@/features/public/components/CertificateCard'`

### Step F6 — Verify src/components/ only has ui/

```bash
ls src/components/   # Must show only: ui/
```

### Step F7 — Run `bun run build`

### Commit F
```
refactor(arch): delete dead component stubs, move live components to src/features
```

---

## Phase G: Theme — Light Mode by Default

### Step G1 — Update `src/app/globals.css`

Replace the current `:root` dark-only block with a proper light/dark pair:

```css
/* Remove existing :root block (lines 5-8: raw hex --background/--foreground) */
/* Remove existing body { background: #0A0A0F; color: #F0EEE8; } */

/* Keep: box-sizing, typing animation, text-balance utility */

@layer base {
  :root {
    /* Light theme — DEFAULT for government officers */
    --background:             0 0% 100%;
    --foreground:             240 10% 10%;
    --card:                   0 0% 97%;
    --card-foreground:        240 10% 10%;
    --popover:                0 0% 97%;
    --popover-foreground:     240 10% 10%;
    --primary:                40 52% 45%;
    --primary-foreground:     0 0% 100%;
    --secondary:              240 5% 92%;
    --secondary-foreground:   240 10% 10%;
    --muted:                  240 5% 94%;
    --muted-foreground:       240 5% 45%;
    --accent:                 240 5% 92%;
    --accent-foreground:      240 10% 10%;
    --destructive:            0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border:                 240 6% 86%;
    --input:                  240 6% 86%;
    --ring:                   40 52% 45%;
    --radius:                 0.125rem;

    /* Status tokens */
    --status-compliant:       145 63% 35%;
    --status-caution:         36 100% 45%;
    --status-risk:            4 90% 50%;

    /* Notice / government letterhead tokens */
    --notice-paper:           45 40% 98%;
    --notice-paper-border:    40 20% 82%;
    --notice-header:          40 37% 93%;
    --notice-krera:           206 79% 21%;
    --notice-body:            240 22% 13%;
  }

  .dark {
    /* Dark theme — matches current Vantis Fey palette */
    --background:             240 20% 4%;
    --foreground:             45 21% 93%;
    --card:                   240 22% 7%;
    --card-foreground:        45 21% 93%;
    --popover:                240 22% 7%;
    --popover-foreground:     45 21% 93%;
    --primary:                40 52% 55%;
    --primary-foreground:     240 20% 5%;
    --secondary:              240 17% 10%;
    --secondary-foreground:   45 21% 93%;
    --muted:                  240 17% 10%;
    --muted-foreground:       245 13% 48%;
    --accent:                 240 17% 10%;
    --accent-foreground:      45 21% 93%;
    --destructive:            4 76% 56%;
    --destructive-foreground: 45 21% 93%;
    --border:                 240 21% 14%;
    --input:                  240 21% 14%;
    --ring:                   40 52% 55%;

    /* Status tokens — same semantics, slightly brighter in dark */
    --status-compliant:       145 63% 42%;
    --status-caution:         36 100% 50%;
    --status-risk:            4 90% 58%;

    /* Notice tokens — same in dark (letterhead is always light) */
    --notice-paper:           45 40% 98%;
    --notice-paper-border:    40 20% 82%;
    --notice-header:          40 37% 93%;
    --notice-krera:           206 79% 21%;
    --notice-body:            240 22% 13%;
  }
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step G2 — Update `tailwind.config.ts`

**Remove** from `colors`:
- `surface`, `surface2`, `gold`, `gold-light`, `gold-dim`, `off-white`, `silver`, `gray`, `gray-light`, `border-soft`, `border-gold`

**Keep**: `green`, `amber`, `red`, `blue` (used for non-status severity coloring)

**Add** CSS-variable-based tokens:
```typescript
status: {
  compliant: 'hsl(var(--status-compliant))',
  caution:   'hsl(var(--status-caution))',
  risk:      'hsl(var(--status-risk))',
},
notice: {
  paper:  'hsl(var(--notice-paper))',
  border: 'hsl(var(--notice-paper-border))',
  header: 'hsl(var(--notice-header))',
  krera:  'hsl(var(--notice-krera))',
  body:   'hsl(var(--notice-body))',
},
```

**Update** `fontFamily` — remove `syne` entry (done in Phase I, but can be done here):
```typescript
fontFamily: {
  sans: ['var(--font-dm-sans)', 'sans-serif'],
  mono: ['var(--font-dm-mono)', 'monospace'],
},
```

**Update** `content` to also include features (done in Phase A, verify it's there).

### Step G3 — Remove `dark` class from `<html>` in `src/app/layout.tsx`

Current: `<html lang="en" className={\`${syne.variable} ${dmSans.variable} ${dmMono.variable}\`}>`  
No `dark` class present (already not hardcoded). Verify and leave as-is.

### Step G4 — Mass-replace color token classes (batch by file group)

This is the highest-volume step. Work through files systematically. For each group, run `bun run build` at the end.

**Group 1: govern/ route pages and components**  
Files: `govern/page.tsx`, `govern/layout.tsx`, `govern/complaints/page.tsx`, `govern/homebuyer/page.tsx`, `govern/litigation/page.tsx`, `govern/notices/page.tsx`, `govern/predictive/page.tsx`, `govern/projects/page.tsx`, `govern/qpr/page.tsx`, `govern/risk/page.tsx`, `govern/rrc/page.tsx`, `govern/scanner/page.tsx`, `govern/settings/page.tsx`  
Apply Token Mapping Reference. Use sed or manual edits — exact replacement (not bulk `sed -i` as it can corrupt JSX).

**Group 2: govern/ _components files**  
Files: `govern/_components/DistrictPanel.tsx`, `govern/_components/LiveFeeds.tsx`, `govern/_components/LoginScreen.tsx`, `govern/_components/SidebarNav.tsx`

**Group 3: govern/ feature-specific _components**  
Files under `govern/complaints/_components/`, `govern/homebuyer/_components/`, `govern/litigation/_components/`, `govern/notices/_components/`, `govern/predictive/_components/`, `govern/projects/_components/`, `govern/qpr/_components/`, `govern/risk/_components/`, `govern/rrc/_components/`, `govern/scanner/_components/`, `govern/settings/_components/`

**Group 4: src/features/ components created in Phases D-F**  
Files: `features/govern/components/DataTable.tsx`, `StatusBadge.tsx`, `StatCard.tsx`, `FilterBar.tsx`, `RiskTimeline.tsx`, `RiskDetailPanel.tsx`, `features/shared/components/VantisIntelligence.tsx`, `ChatPanel.tsx`, `KarnatakaMap.tsx`

**Group 5: public portal routes**  
Files: `app/page.tsx`, `app/_components/SearchDropdown.tsx`, `app/project/[id]/page.tsx`, `app/project/[id]/_components/`, `app/developer/[id]/DeveloperContent.tsx`, `app/developer/[id]/_components/`, `app/complaint/file/page.tsx`, `app/complaint/file/_components/`, `app/complaint/track/page.tsx`, `app/complaint/track/_components/`

**Group 6: alerts page, certificate page (keep its own palette)**  
- `app/alerts/page.tsx` — normal token replacement
- `app/certificate/[id]/` — keep its own light/official tokens (already light-themed), just convert hardcoded hex to certificate-specific CSS vars if any exist

**Group 7: NoticePreview hardcoded hex**  
File: `govern/notices/_components/NoticePreview.tsx`  
Replace: `bg-[#FAFAF7]` → `bg-notice-paper`, `border-[#D0CCB8]` → `border-notice-border`, `bg-[#F0EEE6]` → `bg-notice-header`, `text-[#0A3D62]` → `text-notice-krera`, `text-[#1A1A28]` → `text-notice-body`

**Also update `statusColor`/`statusDot` helper functions in all `_data/*.ts` files:**
Any file with:
```typescript
function statusColor(s: string) {
  if (s === 'COMPLIANT') return 'text-green'
  if (s === 'CAUTION')   return 'text-amber'
  return 'text-red'
}
```
Change to:
```typescript
function statusColor(s: string) {
  if (s === 'COMPLIANT') return 'text-status-compliant'
  if (s === 'CAUTION')   return 'text-status-caution'
  return 'text-status-risk'
}
function statusDot(s: string) {
  if (s === 'COMPLIANT') return 'bg-status-compliant'
  if (s === 'CAUTION')   return 'bg-status-caution'
  return 'bg-status-risk'
}
```

### Step G5 — Run `bun run build` and `bunx tsc --noEmit`

### Step G6 — Spot-check routes for visual correctness

Read JSX of each page.tsx and verify:
- No remaining `text-off-white`, `bg-surface`, `text-gold`, `bg-surface2`, `text-gray`
- No hardcoded hex outside `certificate/` and `notice-paper` context

### Commit G
```
feat(theme): light theme by default — CSS variables, token replacement, remove dark hex tokens
```

---

## Phase H: Typography — Single Font

### Step H1 — Remove all `font-syne` class usage

100 occurrences across files. Replacement:
- Headings: `font-syne text-2xl font-bold` → `text-2xl font-bold` (DM Sans with weight is fine)
- Section labels: `font-syne text-sm font-semibold` → `text-sm font-semibold`
- Brand elements: `font-syne text-sm text-primary` → `text-sm font-semibold text-primary`
- Stat numbers: `font-syne text-3xl font-bold` → `text-3xl font-bold`

Work through all files containing `font-syne`:
- `govern/layout.tsx` (2 uses)
- `govern/page.tsx` (2 uses — headings and stat values)
- `govern/settings/page.tsx` (3 uses)
- `govern/homebuyer/page.tsx`
- All other govern routes and components
- `app/page.tsx`, `app/project/[id]/page.tsx`, `app/developer/[id]/DeveloperContent.tsx`
- `app/complaint/file/page.tsx`, `app/complaint/track/page.tsx`
- `app/alerts/page.tsx`

### Step H2 — Audit `font-mono` usage — keep only ID/code strings

Run: `grep -rn "font-mono" src/ --include='*.tsx' --include='*.ts'`

Keep `font-mono` for:
- RERA registration numbers (`PRM/KA/RERA/...`)
- Certificate IDs (`VG-2026-...`, `CMP-...`)
- Complaint reference numbers
- Dates displayed as `fmtDate()` output in mono columns
- Penalty amounts (e.g., `₹45,75,000`) — these ARE numeric codes, keep
- Quarter labels (e.g., `Q4 2025`) when in mono column context

Remove `font-mono` from:
- Page headings (e.g., `font-mono text-[10px] text-gray uppercase tracking-[0.15em]` section labels)

Wait — the section label pattern `font-mono text-[10px] uppercase tracking-[0.15em]` appears ~57 times and is the established design language for section headers. The contract says:
> **Only exception:** RERA registration numbers and file hash codes may keep `font-mono`

But also: "font-mono" usage is limited to actual RERA IDs, file hashes, and code strings — not **headings**, **labels**, **stats**, or **numbers**"

Section labels (the `text-[10px] uppercase tracking-widest` pattern) are LABELS. They should lose `font-mono`. Replace with just `text-[10px] uppercase tracking-[0.15em] text-muted-foreground`.

This is ~57 changes across `_components/*.tsx` files and `page.tsx` files. Be systematic: search for `font-mono.*\[0.15em\]` or `font-mono.*uppercase.*tracking` patterns.

### Step H3 — Remove Syne from `src/app/layout.tsx`

```typescript
// Remove:
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', display: 'swap' })

// Keep:
import { DM_Sans, DM_Mono } from 'next/font/google'

// Update html className:
// Before: className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
// After:  className={`${dmSans.variable} ${dmMono.variable}`}
```

### Step H4 — Remove `syne` from `tailwind.config.ts` fontFamily

(Already handled in G2 if done together — confirm it's gone.)

### Step H5 — Run `bun run build`

### Commit H
```
refactor(typography): remove font-syne, restrict font-mono to IDs only, drop Syne font load
```

---

## Phase I: File Size Compliance

### Step I1 — Audit file sizes

```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -not -path "*/node_modules/*" \
  | xargs wc -l | sort -rn | head -20
```

Files likely to need splitting after the above phases:
- `project/[id]/page.tsx` — 150 lines (AT LIMIT). After Phase C type-import replacements, it may shrink. If still at 150, extract `ProjectFacts` grid section to `_components/ProjectFacts.tsx`.
- `govern/projects/[id]/_components/DocumentsTab.tsx` — 136 lines. After token replacement may grow slightly. If >150, extract photo grid section.
- `govern/complaints/_components/ComplaintsTable.tsx` — 135 lines. After token replacement may stay. If >150, move mobile card section to `ComplaintMobileCard.tsx`.
- `govern/homebuyer/_components/HomebuyerTable.tsx` — will shrink after DataTable migration to ~40 lines.

### Step I2 — Fix `govern/qpr/page.tsx` page size

Currently 102 lines. After FilterBar extraction and using StatCard, it drops to ≤85 lines.
Verify after Phase D and G changes.

### Step I3 — Run final CI gates

```bash
bunx tsc --noEmit
bun lint
bun run build
bun test
```

All must pass before the commit.

### Commit I
```
chore(cleanup): split oversized files, verify all CI gates pass
```

---

## Commit Sequence Summary

| # | Commit | After |
|---|--------|-------|
| 1 | `feat(arch): scaffold src/features directory structure and update tailwind content` | Phase A |
| 2 | `feat(types): add canonical govern and shared type definitions in src/features` | Phase B |
| 3 | `refactor(types): consolidate duplicate type definitions to canonical src/features/*/types` | Phase C |
| 4 | `feat(govern): extract StatusBadge, StatCard, FilterBar, DataTable to src/features/govern/components` | Phase D |
| 5 | `feat(govern): extract useOfficer and useDemoMode hooks to src/features/govern/hooks` | Phase E |
| 6 | `refactor(arch): delete dead component stubs, move live components to src/features` | Phase F |
| 7 | `feat(theme): light theme by default — CSS variables, token replacement, remove dark hex tokens` | Phase G |
| 8 | `refactor(typography): remove font-syne, restrict font-mono to IDs only, drop Syne font load` | Phase H |
| 9 | `chore(cleanup): split oversized files, verify all CI gates pass` | Phase I |

Total: 9 commits (each must pass `bun run build` before committing).

---

## Critical Implementation Notes

### Do not move `_data/*.ts` files that are route-local
Files like `govern/qpr/_data/qpr-tracker.data.ts`, `govern/complaints/_data/complaints.data.ts`, etc. are used by exactly ONE route. They stay co-located. Only their local type definitions get replaced with canonical imports.

### `project-detail.types.ts` becomes a re-export barrel
This file is currently the canonical types for the project detail page. After Phase C, it becomes a thin re-export barrel pointing to `src/features/govern/types/`. This is intentional — existing consumers in `_components/` continue to import from `project-detail.types.ts` without knowing about `src/features/`, maintaining locality.

### `RiskDetailPanel` is in `RiskTimeline.tsx`'s import chain
When moving `RiskTimeline.tsx`, also check `RiskDetailPanel.tsx` internal imports. Since both move together to `src/features/govern/components/`, the relative import between them stays `./RiskDetailPanel`.

### `useOfficer` in settings: name lookup
`govern/settings/page.tsx` currently does `NAME_MAP[parsed.email] ?? parsed.email` to get the display name. After using `useOfficer`, the `officer` object from the hook has type `Officer` (from `govern-layout.data`). The settings page should still do the `NAME_MAP` lookup from the returned `officer.email` to get display name. This logic stays in the settings page, not the hook.

### NoticePreview has inline `style={{ fontFamily: 'inherit' }}`
This is fine — it's not a Tailwind class, it's an inline style. Leave it untouched.

### Certificate page aesthetic preservation
`app/certificate/[id]/CertificateContent.tsx` (110 lines) and `app/certificate/[id]/_components/VerificationList.tsx` intentionally use a light/official aesthetic. During Phase G token replacement, verify that this page continues to look like an official document. Replace any remaining hardcoded hex in it with certificate-specific CSS variables (add `--certificate-*` vars to globals.css if needed).

### `EscrowData` type stays in project-detail.types.ts
`EscrowData` is only used in `FinancialTab.tsx` — it's not duplicated anywhere. Keep it in `project-detail.types.ts` (which becomes a re-export barrel + keeps EscrowData).

### After removing `surface`, `surface2` etc. from tailwind.config.ts
`bun run build` will still succeed (Tailwind purges unused classes, but unknown classes simply output nothing — there's no build error). However, the UI will look broken until all usages are replaced. This means Phase G must complete the full mass-replacement before committing. Do NOT commit partial color replacement.

### `accent-gold` CSS property
In QPRTable there is `className="accent-gold w-3.5 h-3.5"` on checkboxes (CSS `accent-color`). Map `accent-gold` → `accent-primary`.

---

## Test Strategy

The only existing tests are in `tests/` (vitest smoke tests from PR #5). Run `bun test` at the end of Phase I. No new tests are needed; this is a refactor, not feature addition. The test suite verifies the build doesn't crash and critical module exports work.

---

## Validation Assertions Coverage

| Contract Assertion | Covered By |
|--------------------|-----------|
| A1: `src/features/govern/types/` exists | Phase B |
| A2: No duplicate type names | Phase C |
| A3: DataTable, StatCard, StatusBadge in features, used by ≥2 routes | Phase D |
| A4: `useOfficer` in features/govern/hooks | Phase E |
| A5: `VantisIntelligence`, `KarnatakaMap` in features/shared | Phase F |
| A6: `src/components/` only has `ui/` | Phase F |
| A7: Zero unused components | Phase F (delete dead stubs) |
| B1: No hardcoded hex except certificate | Phase G |
| B2: `globals.css` has `:root` and `.dark` | Phase G |
| B3: Light theme default | Phase G |
| B4: Tailwind uses CSS var tokens | Phase G |
| B5: Status tokens consistent | Phase D (StatusBadge) + Phase G |
| C1: Zero `font-syne` usage | Phase H |
| C2: `font-mono` limited to IDs | Phase H |
| C3: Syne not loaded | Phase H |
| D1: Every page.tsx ≤100 lines | Phase I |
| D2: Every file ≤150 lines | Phase I |
| D3: `bunx tsc --noEmit` passes | Phase C, E, G, I |
| D4: `bun lint` passes | Phase I |
| D5: `bun run build` succeeds | Phase F, G, H, I |
| D6: `bun test` passes | Phase I |
