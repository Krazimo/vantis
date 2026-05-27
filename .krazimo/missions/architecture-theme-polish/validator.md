---
validator: claude-sonnet-4-6
mission: architecture-theme-polish
attempt: 3
verdict: fail
failed_assertions: [13]
started: 2026-05-27T08:00:00Z
finished: 2026-05-27T08:45:00Z
read_implementation: false
---

# Validator Report — architecture-theme-polish — Attempt 3

**Verdict: FAIL**

19 of 20 assertions pass. All automated "Verify by" commands pass. Assertion 13 still has one residual violation after the attempt 2 → attempt 3 fix (commit c9d17dc): `font-mono` remains on human-readable prose in NoticeForm.tsx.

Additionally, one code quality issue was found by reviewer: the local `StatusBadge` in QPRTable.tsx silently shadows the shared component with a different implementation.

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
| **13** | **`font-mono` limited to RERA IDs, file hashes, code strings — not labels/stats/numbers** | **❌ FAIL** |
| 14 | Syne NOT loaded in `layout.tsx` | ✅ PASS |
| 15 | Every `page.tsx` ≤100 lines | ✅ PASS |
| 16 | Every file ≤150 lines | ✅ PASS |
| 17 | `bunx tsc --noEmit` passes | ✅ PASS |
| 18 | `bun lint` passes | ✅ PASS |
| 19 | `bun run build` succeeds — all routes compile | ✅ PASS |
| 20 | `bun test` passes | ✅ PASS |

---

## Failures — Detail

### Assertion 13 — `font-mono` on prose (1 remaining violation)

**File:** `src/app/govern/notices/_components/NoticeForm.tsx`, line 41

```jsx
<div className="w-full bg-muted border border-border rounded-sm px-3 py-2.5 text-sm font-mono text-primary">
  {selectedSection} — Real Estate (Regulation and Development) Act, 2016
</div>
```

`selectedSection` holds a legal section code (e.g., "Section 63") — borderline acceptable as a code reference. However the full rendered string includes "— Real Estate (Regulation and Development) Act, 2016" which is human-readable prose. The `font-mono` class is on the container div rendering both the section code and the act title together.

Contract Section C1: "ONLY for actual code/ID strings, not for labels, numbers, or stats."

**Fix:** Remove `font-mono` from the container div. If the section code identifier alone needs mono, wrap only `{selectedSection}` in `<span className="font-mono">` and leave the act title in the default body font.

---

## Code Quality Issues (non-blocking, reviewer findings)

### CQ-1: Local StatusBadge in QPRTable shadows the shared component

**File:** `src/app/govern/qpr/_components/QPRTable.tsx`, lines 5–24

```tsx
function StatusBadge({ status }: { status: string }) {
  if (status === 'ON_TIME') return (
    <span className="flex items-center gap-1 text-status-compliant text-xs font-medium">
      <CheckCircle className="w-3.5 h-3.5" /> On Time
    </span>
  )
  // ... etc
```

This local function is named identically to `src/features/govern/components/StatusBadge.tsx` but renders differently (Lucide icons + human labels vs dot + raw status text). The local variant handles QPR-specific values (`ON_TIME`, `LATE`, `MISSED`) that the shared component doesn't map.

The naming collision is a maintainability hazard: future developers will find two components with the same name behaving differently. The local one is correctly scoped — it just needs a distinct name.

**Recommendation:** Rename to `QPRStatusBadge` or `QPRStatusCell`. No functional change required.

### CQ-2: Certificate page still uses raw hex

**File:** `src/app/certificate/[id]/CertificateContent.tsx` (multiple lines)

The contract exempts this route from assertion 7, but contract text states: "these should ALSO be CSS variables (certificate-specific tokens), not raw hex." The file uses raw hex throughout: `bg-[#FAF8F3]`, `text-[#1A1A28]`, `text-[#6B6B88]`, `border-[#E2DDD4]`, etc.

Assertion 7 passes (certificate excluded). This is tech debt.

---

## Passing Verification Commands

```
test -d src/features/govern/types          → exit 0
test -d src/features/govern/components     → exit 0
test -d src/features/govern/hooks          → exit 0
test -d src/features/shared/components    → exit 0

interface Project:       1 definition ✓
interface QPREntry:      1 definition ✓
interface Developer:     1 definition ✓
interface LitigationItem: 1 definition ✓
interface Complaint:     1 definition ✓

DataTable:   used in predictive/_components + homebuyer/_components (2 routes) ✓
StatCard:    used in govern/page + qpr/page + homebuyer/page (3 routes) ✓
StatusBadge: imported from features in projects/_components + homebuyer/_components (2 routes) ✓

src/components/ only contains ui/ ✓
no hardcoded hex outside src/app/certificate/[id]/ ✓
--background in globals.css ✓, .dark in globals.css ✓
no dark class on html tag ✓
tailwind.config.ts: 27 hsl(var(--...)) usages, no hardcoded hex ✓
--status-compliant, --status-caution, --status-risk defined ✓
no font-syne usage anywhere ✓
Syne not in layout.tsx ✓
all files ≤150 lines ✓
all pages ≤100 lines ✓
bunx tsc --noEmit → 0 errors ✓
bun lint → 0 errors ✓
bun run build → all routes compile ✓
bun test → 2 pass, 0 fail ✓
```

---

## Required Fix for Next Worker

**Assertion 13 — 1 file to fix:**

`src/app/govern/notices/_components/NoticeForm.tsx` line 41 — Remove `font-mono` from the container div. If the section code token needs mono, wrap only `{selectedSection}` in a `<span className="font-mono">`.

After fix: `bunx tsc --noEmit && bun lint && bun run build && bun test`
