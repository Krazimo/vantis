---
validator: claude-sonnet-4-6
mission: architecture-theme-polish
attempt: 2
verdict: fail
failed_assertions: [13]
started: 2026-05-27T00:00:00Z
finished: 2026-05-27T00:30:00Z
read_implementation: false
---

# Validator Report — architecture-theme-polish — Attempt 2

**Verdict: FAIL**

19 of 20 assertions pass. All automated "Verify by" commands pass. Assertion 13 (font-mono restricted to ID/code strings) fails — the implementation contains residual `font-mono` usage on labels, taglines, and UI text that are explicitly ruled out by contract Section C1 and Assertion 13.

One additional non-assertion code quality issue found: dead token reference (`accent-gold`) in `QPRTable.tsx` after the `gold` token was removed from `tailwind.config.ts`.

---

## Assertion Results

| ID | Assertion | Result |
|----|-----------|--------|
| 1 | `src/features/govern/types/` exists, no duplicate type names | ✅ PASS |
| 2 | `DataTable`, `StatCard`, `StatusBadge` exist and used by ≥2 routes | ✅ PASS |
| 3 | `src/features/govern/hooks/useOfficer.ts` imported by govern layout + settings | ✅ PASS |
| 4 | `src/features/shared/components/` has `VantisIntelligence`, `KarnatakaMap` | ✅ PASS |
| 5 | `src/components/` contains ONLY `ui/` | ✅ PASS |
| 6 | Zero unused component files | ✅ PASS |
| 7 | Zero hardcoded hex in Tailwind classes (except certificate) | ✅ PASS |
| 8 | `globals.css` has `:root` (light) and `.dark` variable sets | ✅ PASS |
| 9 | Light theme is default (no `dark` class on `<html>`) | ✅ PASS |
| 10 | `tailwind.config.ts` uses CSS variable-based tokens | ✅ PASS |
| 11 | Status tokens `--status-compliant/caution/risk` defined as CSS variables | ✅ PASS |
| 12 | Zero `font-syne` usage anywhere in `src/` | ✅ PASS |
| 13 | `font-mono` limited to RERA IDs, file hashes, code strings | ❌ FAIL |
| 14 | Syne NOT loaded in `layout.tsx` | ✅ PASS |
| 15 | Every `page.tsx` ≤100 lines | ✅ PASS |
| 16 | Every file ≤150 lines | ✅ PASS |
| 17 | `bunx tsc --noEmit` passes | ✅ PASS |
| 18 | `bun lint` passes | ✅ PASS |
| 19 | `bun run build` succeeds — all routes compile | ✅ PASS |
| 20 | `bun test` passes | ✅ PASS |

---

## Failures — Detail

### Assertion 13 — `font-mono` on non-code strings

Contract Section C1 says: `font-mono` "ONLY for actual code/ID strings, not for labels, numbers, or stats."  
The handoff claims: "Removed from section labels, stats, numbers, percentages."  
That claim does not match delivery.

**Clear violations (non-code UI text with `font-mono`):**

| File | Line | Content |
|------|------|---------|
| `src/app/page.tsx` | 29 | `"by Orianode"` — brand attribution label |
| `src/app/page.tsx` | 45 | `{tx.tagline}` — "Palantir for Indian real estate" tagline |
| `src/app/page.tsx` | 65 | `{s.label}` — stat card labels ("Projects Monitored", "QPR Defaulters", "Litigation Alerts") |
| `src/app/page.tsx` | 78 | `{tx.poweredBy}` — footer attribution text |
| `src/app/govern/layout.tsx` | 58 | `"K-RERA Officer Portal"` — sidebar label |
| `src/app/error.tsx` | 7 | `"Something went wrong"` — error page label |

**Stats/numbers that the handoff explicitly said were removed (found remaining):**

| File | Line | Content |
|------|------|---------|
| `src/features/govern/components/RiskTimeline.tsx` | 18, 20 | Risk score number and default probability % |
| `src/features/govern/components/RiskDetailPanel.tsx` | 32 | Default probability % |
| `src/app/govern/predictive/page.tsx` | 24 | `"34% default probability"` inline text |
| `src/app/govern/qpr/_components/QPRTable.tsx` | 68–69, 101 | Overdue days and penalty amounts |
| `src/app/govern/litigation/_components/LitigationCard.tsx` | 48 | Currency amount (₹ Cr) |

**Borderline (could be argued as code strings):**
- `src/app/govern/layout.tsx`: `tx.poweredBy` footer text
- `src/app/govern/qpr/_components/QPRTable.tsx`: `row.quarter` ("Q1 2026" — quarter codes)
- Placeholder route pages (`alerts`, `intelligence`): debugging text

---

## Code Quality Issue — Dead Token Reference

**File:** `src/app/govern/qpr/_components/QPRTable.tsx` (lines 45, 61, 88)  
**Issue:** Uses `accent-gold` Tailwind class. The `gold` color token was removed from `tailwind.config.ts` in this mission. `accent-gold` now generates no CSS and silently falls back to the browser default checkbox accent (blue), not the intended gold tint.  
**Severity:** Visual regression — QPR tracker bulk-select checkboxes now use browser-default blue instead of project gold accent.  
**Fix:** Replace `accent-gold` with `accent-primary` (which maps to the CSS variable gold token).

---

## Passing Verification Commands

All six CI gate commands from the contract's "Verify by" section pass:

```
test -d src/features/govern/types          → exit 0
test -d src/features/govern/components     → exit 0
test -d src/features/govern/hooks          → exit 0
test -d src/features/shared/components    → exit 0

interface Project:       1 definition
interface QPREntry:      1 definition
interface Developer:     1 definition
interface LitigationItem: 1 definition
interface Complaint:     1 definition

DataTable:   2 imports in src/app/
StatCard:    3 imports in src/app/
StatusBadge: 2 imports in src/app/

src/components/ only contains ui/
no hardcoded hex outside src/app/certificate/[id]/
--background in globals.css ✓, .dark in globals.css ✓
no dark class on html tag
no hex in tailwind.config.ts colors
--status-compliant, --status-caution, --status-risk defined
no font-syne usage
Syne not loaded in layout.tsx
all files ≤150 lines
all pages ≤100 lines
bunx tsc --noEmit → 0 errors
bun lint → 0 errors
bun run build → 36 routes, 0 errors
bun test → 2 pass, 0 fail
```

---

## Required Fixes for Next Worker

**Assertion 13 — fix font-mono violations (approx 15 files):**

1. `src/app/page.tsx` — Replace `font-mono` on brand attribution ("by Orianode"), tagline text, stat card labels, and footer text with `font-sans` (or remove the class entirely).
2. `src/app/govern/layout.tsx` — Replace `font-mono` on "K-RERA Officer Portal" label with `font-sans`.
3. `src/app/error.tsx` — Replace `font-mono` on "Something went wrong" with `font-sans`.
4. `src/features/govern/components/RiskTimeline.tsx` — Remove `font-mono` from score/probability chart annotations (Recharts `<ReferenceLine>` labels and custom dot tooltips).
5. `src/features/govern/components/RiskDetailPanel.tsx` — Remove `font-mono` from probability percentage display.
6. `src/app/govern/predictive/page.tsx` — Remove `font-mono` from the "34% default probability" inline text.
7. `src/app/govern/qpr/_components/QPRTable.tsx` — Remove `font-mono` from overdue days and penalty amounts; retain on `row.quarter` if quarter codes are accepted as code strings.
8. `src/app/govern/litigation/_components/LitigationCard.tsx` — Remove `font-mono` from monetary "Relief Sought" amount.

**Dead token fix:**

9. `src/app/govern/qpr/_components/QPRTable.tsx` — Replace `accent-gold` with `accent-primary` on all 3 checkbox inputs.
