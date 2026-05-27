# Worker Handoff — architecture-theme-polish

## Status: Implementation Complete

All 20 contract assertions satisfied. Full CI gate suite passes.

---

## Claims

### Part A — Architecture

1. **Canonical types created**: `src/features/govern/types/` has `project.types.ts`, `qpr.types.ts`, `litigation.types.ts`, `developer.types.ts`, `complaint.types.ts`. `src/features/shared/types/i18n.types.ts` has `Language`. Zero duplicate `interface` declarations for Project, QPREntry, Developer, LitigationItem, Complaint anywhere else in `src/`.

2. **Shared govern components extracted**: `DataTable`, `StatCard`, `StatusBadge`, `FilterBar` in `src/features/govern/components/`. Each imported by ≥2 routes: DataTable (homebuyer, predictive), StatCard (govern/page, homebuyer, qpr), StatusBadge (projects table, homebuyer table), FilterBar (complaints, litigation).

3. **Hooks extracted**: `src/features/govern/hooks/useOfficer.ts` and `useDemoMode.ts`. `govern/layout.tsx` and `govern/settings/page.tsx` both use them.

4. **Dead code deleted**: 12 files removed from `src/components/govern/`, `public/`, `shared/` (AlertCard, AssessmentCard, CommandCentre, QPRTracker, Sidebar, ComplaintSummary, LanguageToggle, QPRTimeline, SearchBar, StatusBadge(public), DataFreshness, RiskBadge). Empty subdirs removed.

5. **Surviving components moved**: RiskTimeline cluster → `src/features/govern/components/`. VantisIntelligence + ChatPanel + chatbot.utils + KarnatakaMap → `src/features/shared/components/`. CertificateCard → `src/features/public/components/`. `src/components/` now contains ONLY `ui/` (shadcn primitives).

### Part B — Theme

6. **Light/dark CSS variables**: `globals.css` has `:root` (light theme default) and `.dark` variable sets using shadcn HSL pattern. Status tokens `--status-compliant`, `--status-caution`, `--status-risk` defined in both. Government document tokens `--notice-*` added for notices letterhead.

7. **Tailwind config**: All hex legacy tokens (surface, gold, off-white, gray, etc.) removed. Only CSS-variable-based tokens remain. Status tokens and notice tokens added.

8. **Zero hardcoded hex** in `src/app/` and `src/features/` (except `src/app/certificate/[id]/` which is excluded by assertion). `NoticePreview.tsx` uses `bg-notice-paper`, `text-notice-ink` etc.

9. **Light is default**: No `dark` class on `<html>` tag in `layout.tsx`.

10. **Legacy tokens replaced**: All `bg-surface` → `bg-card`, `bg-surface2` → `bg-muted`, `text-off-white` → `text-foreground`, `text-gold` → `text-primary`, `text-gray` → `text-muted-foreground`, `text-green/amber/red` → `text-status-compliant/caution/risk` etc. across ~90 files.

### Part C — Typography

11. **Zero `font-syne`**: Removed from all 92 usages across all files.

12. **`font-mono` restricted**: Removed from section labels, stats, numbers, percentages. Retained only for: RERA IDs (`project.rera`, `cert.rera`), certificate IDs, complaint IDs (CMP-XXX), survey numbers, email addresses.

13. **Syne font removed from `layout.tsx`**: Only DM Sans + DM Mono loaded. `syne` variable removed from `<html>` className.

### Part D — File sizes

14. **All pages ≤100 lines**: `project/[id]/page.tsx` split (ProjectHeader, ProjectFacts, ComplaintsSummary extracted). `govern/qpr/page.tsx` refactored with StatCard (91 lines).

15. **All files ≤150 lines**: Verified via `wc -l` check.

---

## Evidence

```
bunx tsc --noEmit  → 0 errors
bun lint           → 0 errors, 0 warnings
bun run build      → 36/36 routes, 0 errors
bun test           → 2 pass, 0 fail
```

Contract verification:
- `src/features/govern/types/` ✓
- `src/features/govern/components/` ✓  
- `src/features/govern/hooks/` ✓
- `src/features/shared/components/` ✓
- `src/components/` only has `ui/` ✓
- No duplicate interface declarations ✓
- No hardcoded hex (outside certificate) ✓
- `:root` and `.dark` in globals.css ✓
- No `dark` class on html tag ✓
- No `font-syne` anywhere ✓
- Syne not loaded in layout.tsx ✓
- All pages ≤100 lines ✓
- All files ≤150 lines ✓

---

## Commits (8 total)

1. `feat(govern): canonical type definitions in src/features/govern/types`
2. `refactor(types): consolidate all type imports to canonical src/features/*/types`
3. `feat(govern): extract StatusBadge, StatCard, FilterBar, DataTable to src/features/govern/components`
4. `feat(govern): extract useOfficer and useDemoMode hooks to src/features/govern/hooks`
5. `refactor(arch): move surviving components to features/, delete 12 dead stubs from src/components/`
6. `feat(theme): add light/dark CSS vars, remove legacy hex tokens, add status tokens`
7. `feat(typography): remove font-syne everywhere, restrict font-mono to IDs, drop Syne font`
8. `refactor(final): split oversized pages, fix lint, delete empty component dirs`
