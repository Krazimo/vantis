---
validator: claude-sonnet-4-6
mission: architecture-theme-polish
attempt: 1
verdict: fail
failed_assertions: [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]
started: 2026-05-27T00:00:00Z
finished: 2026-05-27T00:15:00Z
read_implementation: false
---

# Validator Report — architecture-theme-polish — Attempt 1

**Verdict: FAIL**

No `handoff.md` exists in `.krazimo/missions/architecture-theme-polish/`. The branch `feat/architecture-theme-polish` has no implementation commits beyond the contract and plan documents. The implementation has not been started. All assertions were verified independently against the current codebase state.

---

## Assertion Results

| ID | Assertion | Result |
|----|-----------|--------|
| 1 | `src/features/govern/types/` exists, no duplicate type names | ❌ FAIL |
| 2 | `DataTable`, `StatCard`, `StatusBadge` exist and used by ≥2 routes | ❌ FAIL |
| 3 | `src/features/govern/hooks/useOfficer.ts` exists | ❌ FAIL |
| 4 | `src/features/shared/components/` has `VantisIntelligence`, `KarnatakaMap` | ❌ FAIL |
| 5 | `src/components/` contains ONLY `ui/` | ❌ FAIL |
| 6 | Zero unused component files | NOT CHECKED (prereqs failed) |
| 7 | Zero hardcoded hex in Tailwind classes (except certificate) | ❌ FAIL |
| 8 | `globals.css` has `:root` (light) and `.dark` variable sets | ❌ FAIL |
| 9 | Light theme is default | ❌ FAIL |
| 10 | `tailwind.config.ts` uses CSS variables, not hardcoded hex | ❌ FAIL |
| 11 | Status color tokens defined as CSS variables | ❌ FAIL |
| 12 | Zero `font-syne` usage | ❌ FAIL |
| 13 | `font-mono` limited to RERA IDs / code strings only | ❌ FAIL |
| 14 | Syne NOT loaded in `layout.tsx` | ❌ FAIL |
| 15 | Every `page.tsx` ≤100 lines | ❌ FAIL |
| 16 | Every file ≤150 lines | ✅ PASS |
| 17 | `bunx tsc --noEmit` passes | ✅ PASS |
| 18 | `bun lint` passes | ✅ PASS |
| 19 | `bun run build` succeeds | ✅ PASS |
| 20 | `bun test` passes | ✅ PASS |

---

## Failures — Detail

### A1 — `src/features/` directory structure missing

```
test -d src/features/govern/types     → FAIL
test -d src/features/govern/components → FAIL
test -d src/features/govern/hooks      → FAIL
test -d src/features/shared/components → FAIL
```

`src/features/` does not exist at all. All components remain in `src/components/govern/`, `src/components/public/`, `src/components/shared/`.

---

### A2 — Duplicate type names across codebase

```
interface Project:       9 definitions  (must be 1)
interface QPREntry:      3 definitions  (must be 1)
interface Developer:     3 definitions  (must be 1)
interface LitigationItem: 5 definitions (must be 1)
interface Complaint:     2 definitions  (must be 1)
```

No consolidation performed. Every type still has multiple definitions scattered across pages.

---

### A3 — Shared components missing

```
src/features/govern/components/DataTable.tsx  → missing
src/features/govern/components/StatCard.tsx   → missing
src/features/govern/components/StatusBadge.tsx → missing
```

---

### A5 — `src/components/` has non-ui subdirectories

```
src/components/govern/   → still present
src/components/public/   → still present
src/components/shared/   → still present
```

Contract requires only `ui/` to remain.

---

### B2 — Hardcoded hex in Tailwind classes

`src/app/govern/notices/_components/NoticePreview.tsx` contains multiple hex color classes outside the certificate exception:

```
bg-[#FAFAF7], border-[#D0CCB8], border-[#0A3D62], bg-[#F0EEE6],
text-[#0A3D62] (×4), text-[#1A1A28]
```

---

### B1/B8/B9 — `globals.css` has dark theme as `:root`, no `.dark` class, no light default

- `:root` defines `--background: #0A0A0F` (near-black) and `--foreground: #F0EEE8` (off-white) — this is the dark theme
- No `.dark { ... }` block exists anywhere in `globals.css`
- `body` hardcodes `background: #0A0A0F` bypassing CSS variables entirely
- `body` uses class `text-off-white` — a dark-theme assumption

The effective default render is dark. Light theme is not default.

---

### B3/B10 — `tailwind.config.ts` retains hardcoded hex legacy tokens

The following tokens use raw hex values instead of `hsl(var(--...))`:

```
surface:     '#0F0F1A'
surface2:    '#161622'
gold:        '#C9A84C'
gold-light:  '#E8D5A3'
gold-dim:    '#8B7035'
off-white:   '#F0EEE8'
silver:      '#C8C8D8'
gray:        '#6B6B88'
gray-light:  '#9090AA'
border-soft: '#2A2A3E'
border-gold: '#3A3020'
```

---

### B11 — Status CSS variable tokens absent

No `--status-compliant`, `--status-caution`, or `--status-risk` variables in `globals.css`. No `status-compliant`, `status-caution`, `status-risk` tokens in `tailwind.config.ts`.

---

### C1/C12 — `font-syne` still used throughout codebase

Over 20 usages across: `DeveloperContent.tsx`, `CertificateContent.tsx`, `alerts/page.tsx`, `project/[id]/page.tsx`, `complaint/track/page.tsx`, and others. Not a single `font-syne` removal performed.

---

### C2/C14 — Syne font still loaded in `layout.tsx`

```tsx
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
const syne = Syne({ variable: '--font-syne', ... })
<html className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
```

Three fonts loaded. Contract requires two (DM Sans + DM Mono only).

---

### C3/A13 — `font-mono` on non-ID/code strings

Confirmed improper usages on labels and UI text:
- `DeveloperContent.tsx:84` — section label "Compliance"
- `DeveloperContent.tsx:101` — section heading "Projects"
- `alerts/page.tsx:5` — route placeholder text
- `error.tsx:7` — "Something went wrong" label
- `SearchDropdown.tsx:73` — developer/location metadata text
- `predictive/page.tsx:24` — "34% default probability" inline text
- `settings/page.tsx:52` — officer email display (email is borderline; could stay)

---

### E/A15 — Pages over 100 lines

```
150 lines: src/app/project/[id]/page.tsx
102 lines: src/app/govern/qpr/page.tsx
```

---

## Passing CI Gates

All four CI gates pass on the unmodified original codebase:
- `bunx tsc --noEmit` — exit 0
- `bun lint` — exit 0
- `bun run build` — 36 static routes compiled, 0 errors
- `bun test` — 2 pass, 0 fail

---

## Required Fixes for Next Worker

1. **Create `src/features/` tree** — `govern/types/`, `govern/components/`, `govern/hooks/`, `public/components/`, `public/hooks/`, `public/types/`, `shared/components/`, `shared/hooks/`, `shared/types/`

2. **Consolidate types** — Create one canonical type file per domain type in `src/features/govern/types/`. Remove all duplicate `interface Project`, `interface QPREntry`, `interface Developer`, `interface LitigationItem`, `interface Complaint` definitions; leave exactly one.

3. **Extract shared components** — Create `DataTable.tsx`, `StatCard.tsx`, `StatusBadge.tsx`, `FilterBar.tsx` in `src/features/govern/components/`. Each must be used by ≥2 routes.

4. **Extract hooks** — Create `useOfficer.ts` and `useDemoMode.ts` in `src/features/govern/hooks/`. Follow Krazimo error-handling rules in catch blocks (console.warn with error object).

5. **Move components to features/** — After removing dead code (`AlertCard`, `AssessmentCard`, `CommandCentre`, `QPRTracker`, `Sidebar` from `components/govern/`; `ComplaintSummary`, `LanguageToggle`, `QPRTimeline`, `SearchBar`, `StatusBadge` from `components/public/`; `RiskBadge` from `components/shared/`), move surviving components to appropriate `src/features/` subdirectories. `src/components/` must contain only `ui/` after.

6. **Rewrite `globals.css`** — `:root` = light theme (white background, dark text). Add `.dark { ... }` = dark theme. Add `--status-compliant`, `--status-caution`, `--status-risk` to both. Remove hardcoded `background: #0A0A0F` from `body`.

7. **Replace hex Tailwind classes** — Fix all `bg-[#...]`, `text-[#...]`, `border-[#...]` usages in `src/app/` and `src/features/` (notably `NoticePreview.tsx`). Certificate page may use certificate-specific CSS variable tokens.

8. **Update `tailwind.config.ts`** — Remove all hardcoded hex legacy tokens (`surface`, `surface2`, `gold`, `gold-light`, `gold-dim`, `off-white`, `silver`, `gray`, `gray-light`, `border-soft`, `border-gold`). Replace with `hsl(var(--...))` CSS variable-based tokens. Add `status-compliant`, `status-caution`, `status-risk`.

9. **Remove `font-syne`** — Remove all `font-syne` className usages. Replace headings with `font-bold`/`font-semibold` weight classes.

10. **Remove Syne from `layout.tsx`** — Delete the `Syne` import, `const syne = Syne(...)`, and `${syne.variable}` from `<html>` className. Page must load only DM Sans + DM Mono.

11. **Restrict `font-mono`** — Remove from section labels, headings, inline UI text, error messages, and route placeholders. Keep only on RERA IDs, file hashes, and code strings.

12. **Split oversized pages** — `project/[id]/page.tsx` (150 lines) and `govern/qpr/page.tsx` (102 lines) must be split so each is ≤100 lines. Extract heavy JSX to co-located `_components/` files.

---

## Code Quality Review (Reviewer Role)

No implementation diff exists to review — the implementation has not been started. The pre-existing codebase passes all four CI gates and has no new violations introduced. Skipping reviewer diff analysis.
