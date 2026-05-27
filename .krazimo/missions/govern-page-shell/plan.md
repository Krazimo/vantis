# Implementation Plan: govern-page-shell

## Summary

Create `PageShell` — a 15-line wrapper component — then swap the hand-written
outer div + heading block in every govern page for `<PageShell ...>`. Three
pages change their max-width as a side-effect: Litigation and RRC (max-w-5xl
→ max-w-7xl) and Settings (max-w-3xl → max-w-7xl). The project detail page
requires special handling because it's a server wrapper delegating to a client
component.

No new dependencies. No data changes. No sidebar or layout changes.

---

## Codebase Findings

### Current heading pattern (11 of 14 pages)

```tsx
<div className="px-4 sm:px-6 py-6 max-w-?xl mx-auto">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl sm:text-3xl text-foreground">{title}</h1>
      <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
    </div>
    {icon}                 {/* caller controls hidden sm:block */}
  </div>
  {/* page content */}
</div>
```

### Pages with non-standard patterns

| Page | Deviation | Resolution |
|------|-----------|-----------|
| `govern/page.tsx` (Command Centre) | Subtitle is `<div className="flex items-center gap-1.5">` with `<Clock>` icon + text; right side is a "Live" pill | Pass plain string `subtitle`, pass Live pill as `icon`. The Clock icon in the subtitle is decorative — acceptable to drop. |
| `govern/projects/page.tsx` | Subtitle has `<Building2>` icon + text; right side is a filtered-count badge | Same — plain string subtitle, count badge as `icon`. |
| `govern/predictive/page.tsx` | `<h1>` at top, then `<p>` is a sibling outside the flex row (uses `mb-2` not `mb-6` on heading row) | Pass subtitle via prop; PageShell normalises `mb-6`. |
| `govern/intelligence/page.tsx` | Full-page centered placeholder (`min-h-screen`) | Replace with PageShell + centred children div. |
| `govern/settings/page.tsx` | max-w-3xl; heading uses `mb-8` not `mb-6`; no icon | PageShell provides max-w-7xl; inner content wrapped in `<div className="max-w-3xl">`. |
| `govern/rrc/page.tsx` | max-w-5xl | PageShell normalises to max-w-7xl. |
| `govern/litigation/page.tsx` | max-w-5xl; "active alerts" count badge on right | PageShell normalises to max-w-7xl; count badge passed as `icon`. |
| `govern/projects/[id]/page.tsx` | Thin async server wrapper; no heading — heading lives inside `ProjectDetailContent` | Server wrapper does a project lookup and wraps with PageShell; `ProjectDetailContent` loses its outer div + project-card h1. |

### Existing component conventions

- Named exports, no default. Example: `export function StatCard(...)`.
- Props interface defined inline at the top of the file.
- `import { cn } from '@/lib/utils'` for conditional classes.
- No `index.ts` barrel in `src/features/govern/components/` — callers import directly from the file path.

---

## Component Design

### `src/features/govern/components/PageShell.tsx`

```tsx
import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, icon, children }: PageShellProps) {
  return (
    <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>}
        </div>
        {icon}
      </div>
      {children}
    </div>
  )
}
```

- `subtitle?: string` — exactly matches the contract.
- `icon?: ReactNode` — callers pass a fully-constructed element that already carries
  its own `hidden sm:block` (or not) as needed. PageShell does not wrap it.
- `{icon}` rendered directly — no extra `<div>` wrapper — so callers control all
  flex/visibility on their own element.
- **15 lines.** ≤50 contract limit satisfied.

---

## File-by-File Changes

### Step 1 — Create PageShell

**`src/features/govern/components/PageShell.tsx`** (new file, ~15 lines)

Exact code shown in Component Design above.

---

### Step 2 — Simple page migrations

For each of the 12 simple pages below, the change is identical:

1. Add `import { PageShell } from '@/features/govern/components/PageShell'`.
2. Replace the outer `<div className="px-4 sm:px-6 py-6 max-w-?xl mx-auto">` plus
   the inner heading `<div className="flex items-center justify-between mb-6">` block
   with `<PageShell title="..." subtitle="..." icon={...}>`.
3. Remove the closing `</div>` for both removed divs.

#### `src/app/govern/page.tsx` — Command Centre

```tsx
// BEFORE: outer div + heading block (lines 44-57 in current file)
// AFTER:
<PageShell
  title="Command Centre"
  subtitle="Data as of 12 May 2026 · Updated daily from K-RERA"
  icon={
    <div className="hidden sm:flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-status-compliant animate-pulse" />
      <span className="text-status-compliant text-xs">Live</span>
    </div>
  }
>
  {/* KPI grid, map section, LiveFeeds */}
</PageShell>
```

Note: `Clock` import can be removed (no longer used). Ensure all other imports stay.

#### `src/app/govern/qpr/page.tsx` — QPR Tracker

```tsx
<PageShell
  title="QPR Compliance Tracker"
  subtitle={`Quarterly Progress Reports · ${QUARTERS.length} quarters tracked`}
  icon={<BarChart2 className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* stat cards, penalty callout, filter tabs, QPRTable, BatchNoticeModal */}
</PageShell>
```

#### `src/app/govern/projects/page.tsx` — Project Registry

```tsx
<PageShell
  title="Project Registry"
  subtitle="All K-RERA registered projects · Vantis database"
  icon={
    <div className="hidden sm:flex items-center gap-1.5 bg-card border border-border rounded-sm px-3 py-1.5">
      <span className="text-primary text-sm font-bold">{filtered.length}</span>
      <span className="text-muted-foreground text-xs">/ {PROJECTS.length} projects</span>
    </div>
  }
>
  {/* search + filter row, status pills, mobile count, ProjectTable */}
</PageShell>
```

Note: Remove `Building2` from the import since it was only used in the subtitle div.
`Filter` and `Search` remain (used in filter row). `Building2` import should be
verified against the rest of the file — if unused after this change, remove it.

#### `src/app/govern/litigation/page.tsx` — Litigation Watchlist

max-w-5xl → max-w-7xl via PageShell.

```tsx
<PageShell
  title="Litigation Watchlist"
  subtitle="Active court cases · eCourts integration"
  icon={
    <div className="flex items-center gap-2">
      <Scale className="w-4 h-4 text-status-risk" />
      <span className="text-status-risk text-sm font-bold">{ALL_CASES.length}</span>
      <span className="text-muted-foreground text-xs">active alerts</span>
    </div>
  }
>
  {/* FilterBar, case list / empty state */}
</PageShell>
```

#### `src/app/govern/scanner/page.tsx` — Submission Scanner

The scanner has an early return for the approval success screen. That early return
comes before the main `<PageShell>` render and is unaffected.

```tsx
if (approved && approvedAt) {
  return <ApprovalSuccess ... />   // unchanged
}

return (
  <PageShell
    title="Submission Scanner"
    subtitle="Pre-assessment queue · 5-database verification"
    icon={
      <div className="hidden sm:flex items-center gap-2 text-muted-foreground text-xs">
        <ScanLine className="w-4 h-4" />
        {APPLICATIONS.length} pending
      </div>
    }
  >
    {/* two-column grid: ScannerQueue + AssessmentCard + ScannerModals */}
  </PageShell>
)
```

#### `src/app/govern/risk/page.tsx` — Developer Risk Intelligence

Current code has no right-side icon (the heading right side is empty). Do not pass
`icon` — PageShell renders nothing on the right.

```tsx
<PageShell
  title="Developer Risk Intelligence"
  subtitle="Trust scores across K-RERA registered developers"
>
  {/* search input, developer grid */}
</PageShell>
```

#### `src/app/govern/predictive/page.tsx` — Predictive Default Analytics

Current pattern has `mb-2` on the heading row then a sibling `<p>` for subtitle.
PageShell normalises to `mb-6`. Pass the long subtitle string.

```tsx
<PageShell
  title="Predictive Default Analytics"
  subtitle="Projects ranked by probability of default in next 4 quarters · Powered by QPR patterns, escrow velocity, litigation accumulation, and sales velocity"
  icon={<TrendingDown className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* case study callout, PredictiveTable */}
</PageShell>
```

#### `src/app/govern/homebuyer/page.tsx` — Homebuyer Early Warning

```tsx
<PageShell
  title="Homebuyer Early Warning"
  subtitle="Proactive protection for at-risk homebuyers"
  icon={<Users className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* stat cards, HomebuyerTable, callout */}
</PageShell>
```

#### `src/app/govern/complaints/page.tsx` — Complaint Management

```tsx
<PageShell
  title="Complaint Management"
  subtitle="Track, schedule hearings, and record orders"
  icon={<FileText className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* stats grid, FilterBar, ComplaintsTable, ComplaintsModals */}
</PageShell>
```

#### `src/app/govern/rrc/page.tsx` — RRC Tracker

max-w-5xl → max-w-7xl via PageShell.

```tsx
<PageShell
  title="RRC Tracker"
  subtitle="Revenue Recovery Certificate proceedings"
  icon={<Shield className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* stats grid, RRC cards, escalation callout */}
</PageShell>
```

#### `src/app/govern/notices/page.tsx` — AI Notice Generator

```tsx
<PageShell
  title="AI Notice Generator"
  subtitle="Draft regulatory notices · Powered by Vantis Intelligence"
  icon={<FileText className="w-6 h-6 text-muted-foreground hidden sm:block" />}
>
  {/* two-column grid: NoticeForm + NoticePreview */}
</PageShell>
```

#### `src/app/govern/intelligence/page.tsx` — Vantis Intelligence

Current file is a placeholder centered on the full screen. Replace with PageShell:

```tsx
export default function GovernIntelligence() {
  return (
    <PageShell title="Vantis Intelligence" subtitle="K-RERA AI Assistant">
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2">
            Route: /govern/intelligence
          </p>
          <p className="text-primary mt-1">Full-page chatbot interface — Session 4</p>
        </div>
      </div>
    </PageShell>
  )
}
```

---

### Step 3 — Settings page (inner max-w constraint)

Settings currently uses `max-w-3xl` for everything. After PageShell provides
`max-w-7xl`, the inner content should be wrapped in `<div className="max-w-3xl">`.

The early `if (!mounted)` return is unaffected — it stays before PageShell.

```tsx
if (!mounted) return <div className="min-h-screen bg-background" />

return (
  <PageShell
    title="Settings"
    subtitle="Account, notifications, data freshness, and demo mode"
  >
    <div className="max-w-3xl">
      {/* Current User card */}
      {/* Notification Preferences card */}
      <DataFreshnessSection />
      <DemoModeSection demoMode={demoMode} onToggle={toggleDemoMode} />
    </div>
  </PageShell>
)
```

Remove `User` and `Bell` icon imports if they were only used in the heading block.
Verify: those icons are also used inside the card `<div className="flex items-center gap-2 mb-4">` — keep them.

---

### Step 4 — Project detail (server wrapper + client component)

This is the most complex case. Two files change.

#### `src/app/govern/projects/[id]/page.tsx`

The server wrapper does a project lookup and uses PageShell to provide the title.
In the not-found case, PageShell is skipped and `ProjectDetailContent` handles its
own 404 UI (which has its own `min-h-screen` centering).

```tsx
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
```

Line count: ~20 lines. ✓

#### `src/app/govern/projects/[id]/ProjectDetailContent.tsx`

Two changes:

1. **Remove the outer wrapper div** — `<div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">` and its closing `</div>`. The max-w-7xl now comes from PageShell.

2. **Remove the project name `<h1>`** from the project card — the project name is now
   rendered by PageShell's `<h1>`. The card retains RERA number, developer/location,
   status badge, and risk score bar.

   The card's `<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">` inner left column changes from:
   ```tsx
   <div>
     <h1 className="text-xl sm:text-2xl text-foreground font-bold leading-tight mb-1">{project.name}</h1>
     <div className="font-mono text-primary text-xs mb-1.5">{project.rera}</div>
     <div className="text-muted-foreground text-xs">{project.developer_name} · {project.location}</div>
   </div>
   ```
   to:
   ```tsx
   <div>
     <div className="font-mono text-primary text-xs mb-1.5">{project.rera}</div>
     <div className="text-muted-foreground text-xs">{project.developer_name} · {project.location}</div>
   </div>
   ```

3. **404 state is unchanged** — `ProjectDetailContent` returns its own
   `min-h-screen flex items-center justify-center` div when project is not found.
   This path is triggered via `page.tsx`'s `if (!project) return <ProjectDetailContent ...>`,
   so the 404 UI still renders correctly without PageShell.

Result: ProjectDetailContent.tsx shrinks from 112 → ~109 lines. Still under 150. ✓

---

## Test Strategy

No new tests. The vitest config (`tests/unit/**/*.test.ts`, environment `node`)
only supports utility function tests — no jsdom, no React rendering. PageShell
is a pure-JSX layout component with no logic.

The contract's verify script is the complete test plan:

```bash
# 1. PageShell exists
test -f src/features/govern/components/PageShell.tsx

# 2. All govern page.tsx files import PageShell
for f in $(find src/app/govern -name "page.tsx"); do
  grep -q "PageShell" "$f" || { echo "missing: $f"; exit 1; }
done

# 3. No page-level max-w overrides
grep -rn "max-w-" src/app/govern/*/page.tsx src/app/govern/page.tsx 2>/dev/null || true
# Expected: empty output

# 4. PageShell declares max-w-7xl
grep -q "max-w-7xl" src/features/govern/components/PageShell.tsx

# 5. File size checks
wc -l < src/features/govern/components/PageShell.tsx   # must be ≤50
# Run full size check from contract

# 6. CI gates
bunx tsc --noEmit
bun lint
bun run build
bun test
```

---

## Commit Sequence

```
# Commit 1 — new component only
git add src/features/govern/components/PageShell.tsx
git commit -m "feat(govern): add PageShell component for consistent page layout"

# Commit 2 — 12 simple page migrations (Steps 2 + 3)
git add src/app/govern/page.tsx \
        src/app/govern/qpr/page.tsx \
        src/app/govern/projects/page.tsx \
        src/app/govern/litigation/page.tsx \
        src/app/govern/scanner/page.tsx \
        src/app/govern/risk/page.tsx \
        src/app/govern/predictive/page.tsx \
        src/app/govern/homebuyer/page.tsx \
        src/app/govern/complaints/page.tsx \
        src/app/govern/rrc/page.tsx \
        src/app/govern/notices/page.tsx \
        src/app/govern/settings/page.tsx \
        src/app/govern/intelligence/page.tsx
git commit -m "refactor(govern/pages): migrate all govern pages to PageShell"

# Commit 3 — project detail special case (Step 4)
git add src/app/govern/projects/\[id\]/page.tsx \
        src/app/govern/projects/\[id\]/ProjectDetailContent.tsx
git commit -m "refactor(govern/project-detail): wrap with PageShell via server component"
```

Run `bun run build` after Commit 1 and after Commit 3 to catch type/import errors.
Run the full verify script after Commit 3.

---

## Edge Cases and Risks

| Risk | Mitigation |
|------|-----------|
| `Building2` import left dangling in `projects/page.tsx` | Check: it's used only in the subtitle div → remove it. `Filter` and `Search` are used in the filter row → keep. |
| `Clock` import left dangling in `govern/page.tsx` | It was only in the subtitle div → remove it. |
| `TrendingDown` used only in heading in `predictive/page.tsx` | It moves to the `icon` prop → import still needed. |
| Predictive page: long subtitle string | No wrapping issues — it's a `<p>` with `text-xs`. |
| `ProjectDetailContent` 404 path rendering without PageShell | `page.tsx` returns `<ProjectDetailContent>` directly for not-found — the component's own `min-h-screen` layout handles centering correctly. |
| `settings/page.tsx` `if (!mounted)` early return | Stays before `<PageShell>`. No change to hydration behaviour. |
| `scanner/page.tsx` approval success early return | Stays before `<PageShell>`. `ApprovalSuccess` has its own full-screen layout. |
| File-size compliance after changes | All page.tsx files currently ≤90 lines; after swapping outer div for PageShell, line count decreases by 4–7 lines per file. All stay under 100. `ProjectDetailContent.tsx` drops from 112 → ~109 lines, under 150. |
