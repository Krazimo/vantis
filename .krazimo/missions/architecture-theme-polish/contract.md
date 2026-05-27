# Mission: architecture-theme-polish

## Goal
Restructure Vantis into the Krazimo features-based architecture, add a proper light theme (default for government employees), unify typography to a single font, remove all dead code, and consolidate duplicated types/components into shared units. After this mission, Vantis is a clean, standards-compliant codebase ready for production iteration.

## Why
- Vantis is being built for K-RERA government officers. The current dark/gold "Palantir" theme is hard to read in government offices with bright lighting. A light theme must be the default.
- 6 copies of `Project` interface, 3 of `QPREntry`, 5 near-identical table components, 5 card components — the codebase is full of duplication that makes every future change risky.
- The Krazimo lint preset enforces `src/features/` import boundaries (`shared-no-features` rule). Vantis currently has no features/ directory at all.
- 15 unused components sit in `src/components/` as dead code.
- 3 fonts are mixed inconsistently across 100+ usage sites.
- 42 hardcoded hex colors bypass design tokens.

## Context
- Stack: Next 16, React 19, bun, shadcn/ui (new-york, zinc base), vitest, Tailwind 3
- Two products in one codebase: Public Portal (/) and Vantis Govern (/govern)
- 21 routes, all App Router
- All data is hardcoded (JSON files in `data/`). No database. No external APIs except Claude chatbot.
- The certificate page (/certificate/[id]) intentionally uses a light/white aesthetic for official document feel — this is correct behavior and should NOT become dark-themed
- The vantis CLAUDE.md (section 2, rule 3) says "DO NOT REFACTOR WORKING CODE" — this mission explicitly overrides that rule for the scope of this contract only. The refactor IS the mission.

---

## Part A: Architecture — Features Structure

### A1. Create `src/features/` directory with this layout:

```
src/features/
  govern/
    components/     ← shared UI within govern (DataTable, StatCard, StatusBadge, FilterBar, TabContainer)
    hooks/          ← useOfficer, useDemoMode, useLocalStorage
    types/          ← all govern domain types (Project, QPREntry, Developer, LitigationItem, Complaint, QPRRow, etc.)
    data/           ← shared data utilities for govern
  public/
    components/     ← shared UI within public portal (SearchDropdown, ProjectCard)
    hooks/          ← useLanguage
    types/          ← public domain types (Language, Tx, SearchResult)
  shared/
    components/     ← app-wide shared (VantisIntelligence, ChatPanel, KarnatakaMap, DataFreshness)
    hooks/          ← app-wide hooks (useMediaQuery, useMounted)
    types/          ← app-wide types (if any)
    lib/            ← shared utilities (moved from src/lib/ if cross-feature)
```

### A2. Consolidate duplicated types

Every duplicated type must have exactly ONE canonical definition:

| Type | Canonical Location | Current Duplicates |
|------|-------------------|--------------------|
| `Project` | `src/features/govern/types/project.types.ts` | 6 definitions across app/_data, complaint, developer, govern/projects, project/ |
| `QPREntry` | `src/features/govern/types/qpr.types.ts` | 3 definitions |
| `QPRRow` | `src/features/govern/types/qpr.types.ts` | 2 definitions |
| `LitigationItem` | `src/features/govern/types/litigation.types.ts` | 3 definitions |
| `Developer` | `src/features/govern/types/developer.types.ts` | 3 definitions |
| `Complaint` | `src/features/govern/types/complaint.types.ts` | 2 definitions |
| `Language`, `Tx` | `src/features/shared/types/i18n.types.ts` | 4 definitions each |

The canonical type must be a **superset** of all current variants (union of all fields). Every consumer imports from the canonical location.

### A3. Extract shared UI components

From the 5 near-identical table components, extract:

- `src/features/govern/components/DataTable.tsx` — reusable table with: sortable columns, mobile card fallback, status badge rendering, hover states. Every govern table route (`complaints`, `homebuyer`, `predictive`, `projects`, `qpr`) uses this instead of its own table.
- `src/features/govern/components/StatCard.tsx` — the stat cards used on the command centre and across pages (icon + number + label pattern).
- `src/features/govern/components/StatusBadge.tsx` — the COMPLIANT/CAUTION/HIGH RISK badge used everywhere.
- `src/features/govern/components/FilterBar.tsx` — the tab-based filter bar that appears on most govern pages.

Each extracted component must be used by **at least 2 routes** (otherwise it stays route-local).

### A4. Extract shared hooks

- `src/features/govern/hooks/useOfficer.ts` — the localStorage-based officer state + demo mode toggle, currently duplicated in `govern/layout.tsx` and `govern/settings/page.tsx`.
- `src/features/govern/hooks/useDemoMode.ts` — the demo mode toggle with keyboard shortcut (Ctrl+Shift+D).

### A5. Delete dead code

Remove all unused components identified in audit:

From `src/components/govern/`: `AlertCard.tsx`, `AssessmentCard.tsx`, `CommandCentre.tsx`, `QPRTracker.tsx`, `Sidebar.tsx`
From `src/components/public/`: `ComplaintSummary.tsx`, `LanguageToggle.tsx`, `QPRTimeline.tsx`, `SearchBar.tsx`, `StatusBadge.tsx`
From `src/components/shared/`: `RiskBadge.tsx`

Before deleting, verify each is truly unused (grep for its export name across entire `src/`). If any IS imported somewhere, keep it (move to appropriate features/ location instead).

### A6. Move remaining `src/components/` files

After dead code removal, move surviving components:
- `src/components/govern/RiskTimeline.tsx` + `RiskDetailPanel.tsx` + `risk-timeline.data.ts` → `src/features/govern/components/`
- `src/components/shared/VantisIntelligence.tsx` + `ChatPanel.tsx` + `chatbot.utils.ts` → `src/features/shared/components/`
- `src/components/shared/KarnatakaMap.tsx` → `src/features/shared/components/`
- `src/components/shared/DataFreshness.tsx` → `src/features/shared/components/`
- `src/components/public/CertificateCard.tsx` → `src/features/public/components/`
- `src/components/ui/` → stays at `src/components/ui/` (shadcn vendored, DO NOT MOVE)

After moves, `src/components/` should contain ONLY `ui/` (shadcn primitives).

### A7. Update all imports

Every import that previously referenced:
- `@/components/govern/*` → `@/features/govern/components/*`
- `@/components/shared/*` → `@/features/shared/components/*`
- `@/components/public/*` → `@/features/public/components/*`
- Duplicated local type imports → canonical `@/features/*/types/*`

Route-local `_components/` and `_data/` files that are only used by ONE route stay co-located (do NOT move them to features/). Only shared code goes into features/.

### A8. Thin route shells

Each `page.tsx` should be a thin shell: import the feature components, compose them, export default. Target: every `page.tsx` under 80 lines. Heavy logic lives in features/.

---

## Part B: Theme — Light Mode for Government

### B1. Add light theme CSS variables

In `src/app/globals.css`, define proper light AND dark theme variables in the shadcn pattern:

```css
@layer base {
  :root {
    /* Light theme (DEFAULT for government users) */
    --background: 0 0% 100%;        /* white */
    --foreground: 240 10% 10%;      /* near-black text */
    --card: 0 0% 98%;               /* very light gray */
    --card-foreground: 240 10% 10%;
    --primary: 40 52% 45%;          /* gold, slightly deeper for light bg readability */
    --primary-foreground: 0 0% 100%;
    --secondary: 240 5% 92%;        /* light gray */
    --secondary-foreground: 240 10% 10%;
    --muted: 240 5% 96%;
    --muted-foreground: 240 5% 45%;
    --accent: 240 5% 92%;
    --accent-foreground: 240 10% 10%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 6% 90%;
    --input: 240 6% 90%;
    --ring: 40 52% 45%;
    /* Status colors */
    --status-compliant: 145 63% 42%;
    --status-caution: 36 100% 50%;
    --status-risk: 4 90% 58%;
  }

  .dark {
    /* Dark theme (optional toggle) */
    --background: 240 20% 5%;
    --foreground: 45 21% 93%;
    /* ... existing dark values ... */
  }
}
```

### B2. Remove ALL hardcoded hex colors from Tailwind classes

Every instance of `bg-[#...]`, `text-[#...]`, `border-[#...]` in `src/app/` and `src/features/` must be replaced with design token classes:
- `bg-[#080810]` → `bg-background`
- `text-[#F0EEE8]` → `text-foreground`
- `text-[#6B6B88]` → `text-muted-foreground`
- `bg-[#0F0F1A]` → `bg-card`
- `border-[#2A2A3E]` → `border-border`
- Status colors → `text-status-compliant`, `text-status-caution`, `text-status-risk` (define in tailwind.config.ts using CSS variables)

**Exception:** `src/app/certificate/[id]/` may keep its own light palette for the official document print view — but these should ALSO be CSS variables (certificate-specific tokens), not raw hex.

### B3. Remove Vantis-specific hardcoded color tokens from tailwind.config.ts

The current `surface`, `surface2`, `gold`, `gold-light`, `gold-dim`, `off-white`, `silver`, `gray`, `gray-light`, `border-soft`, `border-gold` custom colors should be **removed** from tailwind.config.ts and replaced by CSS variable-based tokens that respond to the light/dark theme.

Keep shadcn's default semantic tokens (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`, `destructive`, `popover`, `ring`). Add `status-compliant`, `status-caution`, `status-risk` as new semantic tokens.

### B4. Make light theme the default

- `:root` (no class) = light theme
- `.dark` class on `<html>` = dark theme
- The `<html>` tag in `src/app/layout.tsx` should NOT have `className="dark"` — light is default
- If the app currently hardcodes `dark` on the html tag, remove it
- The settings page toggle for dark/light mode is nice-to-have but NOT required for this mission — just ensure the default is light

### B5. Verify every route renders correctly in light theme

Every one of the 21 routes must be visually inspectable with no invisible text (white-on-white), no clipped elements, no missing backgrounds. The worker must run `bun run build` which compiles all routes — any hard crash gets caught. For CSS visual issues, the worker should spot-check by reading the JSX for any remaining dark-mode-only color assumptions.

---

## Part C: Typography — Single Font

### C1. Unify to one font family

Replace all `font-syne` (56 uses) and `font-mono` (57 uses) with the default body font (`font-sans` / DM Sans).

**Only exception:** RERA registration numbers and file hash codes (e.g., `PRM/KA/RERA/1234/...`) may keep `font-mono` for readability — but ONLY for actual code/ID strings, not for labels, numbers, or stats.

### C2. Clean up font loading

In `src/app/layout.tsx`, remove the Syne font import. Keep DM Sans (body) and DM Mono (IDs only). The page should load 2 fonts max, not 3.

### C3. Remove all font-syne className usage

Every `font-syne` class in the codebase must be removed or replaced with appropriate weight classes (`font-bold`, `font-semibold`). Headings get their visual weight from `font-bold text-xl` (or similar), not from a display font.

---

## Contract Assertions

1. `src/features/govern/types/` exists with canonical type definitions; no duplicate type names exist anywhere else under `src/`
2. `src/features/govern/components/` contains at least `DataTable.tsx`, `StatCard.tsx`, `StatusBadge.tsx` — each imported by ≥2 routes
3. `src/features/govern/hooks/` contains `useOfficer.ts` — imported by govern layout + settings at minimum
4. `src/features/shared/components/` contains `VantisIntelligence.tsx`, `KarnatakaMap.tsx`
5. `src/components/` contains ONLY `ui/` (shadcn primitives) — no other subdirectories
6. Zero unused component files (every `.tsx` under `src/features/` and `src/components/` is imported by at least one consumer)
7. Zero hardcoded hex colors in Tailwind classes (`bg-[#...]`, `text-[#...]`, `border-[#...]`) in `src/app/` and `src/features/` — **exception:** `src/app/certificate/[id]/` may use CSS-variable-based certificate tokens
8. `globals.css` has `:root` (light) and `.dark` theme variable sets
9. Light theme is the default (no `dark` class on `<html>` tag)
10. `tailwind.config.ts` uses CSS variable-based color tokens (`hsl(var(--...))` pattern), not hardcoded hex for any semantic colors
11. Status colors (`compliant`, `caution`, `risk`) are defined as CSS variable tokens and used consistently across all status badges
12. Zero `font-syne` className usage anywhere in `src/`
13. `font-mono` usage is limited to actual RERA IDs, file hashes, and code strings — not headings, labels, stats, or numbers
14. Syne font is NOT loaded in layout.tsx (only DM Sans + DM Mono remain)
15. Every `page.tsx` is ≤100 lines
16. Every file under `src/` (excluding `src/components/ui/**`) is ≤150 lines
17. `bunx tsc --noEmit` passes
18. `bun lint` passes
19. `bun run build` succeeds — all 21 routes compile
20. `bun test` passes

## Out of scope

- Deploying to any environment (localhost only)
- Adding new features or screens
- Adding new tests beyond keeping existing smoke test passing
- Database/API integration
- E2E/Playwright setup
- Modifying `data/*.json` files
- Changing route URLs or adding/removing routes
- Modifying `src/components/ui/**` (vendored shadcn primitives)
- Dark mode toggle UI (nice-to-have, not required)
- Mobile responsiveness overhaul (preserve existing responsive behavior)
- Modifying Python scripts (`generate_docs.py`, `generate_images.py`)

## Verify by

```bash
# A1-A4. Features structure exists
test -d src/features/govern/types
test -d src/features/govern/components
test -d src/features/govern/hooks
test -d src/features/shared/components

# A2. No duplicate type names (Project, QPREntry, etc.)
for t in "interface Project " "interface QPREntry " "interface Developer " "interface LitigationItem " "interface Complaint "; do
  COUNT=$(grep -rn "$t" src/ --include='*.ts' --include='*.tsx' | grep -v node_modules | wc -l)
  if [ "$COUNT" -gt 1 ]; then echo "DUPLICATE: $t found $COUNT times"; exit 1; fi
done

# A3. Shared components exist and are used by multiple routes
for c in DataTable StatCard StatusBadge; do
  test -f "src/features/govern/components/$c.tsx" || { echo "missing: $c"; exit 1; }
  IMPORTS=$(grep -rn "from.*['\"]@/features/govern/components/$c['\"]" src/app/ | wc -l)
  if [ "$IMPORTS" -lt 2 ]; then echo "$c used by <2 routes ($IMPORTS)"; exit 1; fi
done

# A5. No dead code — all non-ui components are imported somewhere
find src/features src/components -name "*.tsx" -not -path "*/ui/*" | while read f; do
  BASENAME=$(basename "$f" .tsx)
  IMPORTS=$(grep -rn "$BASENAME" src/ --include='*.ts' --include='*.tsx' | grep -v "$(basename $f)" | wc -l)
  if [ "$IMPORTS" -eq 0 ]; then echo "UNUSED: $f"; exit 1; fi
done

# A6. src/components/ only has ui/
DIRS=$(ls -d src/components/*/ 2>/dev/null | grep -v ui)
if [ -n "$DIRS" ]; then echo "non-ui dirs in components/: $DIRS"; exit 1; fi

# B1-B2. No hardcoded hex in tailwind classes (except certificate)
HEX=$(grep -rEn "(bg|text|border)-\[#[0-9a-fA-F]" src/app/ src/features/ \
  --include='*.tsx' --include='*.ts' 2>/dev/null \
  | grep -v 'certificate' || true)
if [ -n "$HEX" ]; then echo "hardcoded hex colors:"; echo "$HEX"; exit 1; fi

# B3. Light theme is default
! grep -q 'className.*dark' src/app/layout.tsx || \
  ! grep -q "class.*dark" src/app/layout.tsx || true
grep -q '\-\-background:' src/app/globals.css

# C1. No font-syne usage
SYNE=$(grep -rn "font-syne" src/ --include='*.tsx' --include='*.ts' 2>/dev/null || true)
if [ -n "$SYNE" ]; then echo "font-syne still used:"; echo "$SYNE"; exit 1; fi

# C2. Syne not loaded
! grep -qi "syne" src/app/layout.tsx

# D. File size compliance
OVER=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -not -path "*/node_modules/*" \
  -exec wc -l {} + 2>/dev/null | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "files over 150:"; echo "$OVER"; exit 1; fi

# E. Page files ≤100 lines
BIGPAGES=$(find src/app -name "page.tsx" -exec wc -l {} + | awk '$1 > 100 && $2 != "total" {print}')
if [ -n "$BIGPAGES" ]; then echo "pages over 100:"; echo "$BIGPAGES"; exit 1; fi

# F. CI gates
bunx tsc --noEmit
bun lint
bun run build
bun test
```

## Notes for worker

### Execution order (IMPORTANT — do this in phases to avoid broken intermediate states)

**Phase A: Types consolidation (commit after)**
1. Create `src/features/govern/types/` and canonical type files
2. Update all imports across the codebase to point to canonical types
3. Delete duplicate type definitions from `_data/*.ts` files
4. Run `bunx tsc --noEmit` to verify

**Phase B: Shared components extraction (commit after each)**
1. Create `DataTable.tsx` by generalizing the most complete table component
2. Refactor each table route to use `DataTable`
3. Repeat for `StatCard`, `StatusBadge`, `FilterBar`
4. Run `bun run build` after each component extraction

**Phase C: Dead code removal + file moves (commit after)**
1. Verify each component is unused (grep)
2. Delete dead components
3. Move surviving components to `src/features/`
4. Update imports
5. Run `bun run build`

**Phase D: Theme (commit after)**
1. Update `globals.css` with light/dark CSS variable sets
2. Update `tailwind.config.ts` to use CSS variables
3. Replace all hardcoded hex colors in className strings
4. Remove `dark` class from html tag if present
5. Run `bun run build` and spot-check routes visually

**Phase E: Typography (commit after)**
1. Remove all `font-syne` from className
2. Restrict `font-mono` to ID/code strings only
3. Remove Syne import from layout.tsx
4. Run `bun run build`

**Phase F: Final cleanup (commit after)**
1. Verify all page.tsx files ≤100 lines
2. Verify all files ≤150 lines
3. Run full CI gates

### Key constraints
- Do NOT modify `src/components/ui/**` (shadcn vendored primitives)
- Do NOT modify `data/*.json` files
- Do NOT change route URLs
- Do NOT add or remove pages
- Certificate page (/certificate/[id]) keeps its light/official aesthetic — it should look like an official government document, not follow the govern dashboard theme
- `_components/` and `_data/` folders local to a single route should stay co-located — only move code to `src/features/` if it's shared by multiple routes
- The `DataTable` component should accept column definitions and row data as props — NOT have any route-specific logic baked in
- Status colors: `compliant` = green, `caution` = amber/yellow, `risk` = red — these semantics must be preserved
- When consolidating types: the canonical type is the SUPERSET of all variants. Add optional (`?`) markers for fields that don't appear in every variant.
- Keep all 21 routes functional. If `bun run build` fails, stop and fix before proceeding.
- The `useOfficer` hook should encapsulate ALL localStorage officer logic (read, write, parse, default). The catch blocks must follow Krazimo error-handling rules (console.warn with error object, never silent).
- Aim for ~20-25 focused commits, not one mega-commit. Each commit should pass `bun run build`.
