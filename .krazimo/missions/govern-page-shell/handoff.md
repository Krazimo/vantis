# Mission Handoff: govern-page-shell

## Status: COMPLETE

## What was done

Created `src/features/govern/components/PageShell.tsx` (23 lines) and migrated all 14 govern page files to use it as their outermost wrapper.

## Claims

1. **PageShell exists** at `src/features/govern/components/PageShell.tsx` with props: `title`, `subtitle?`, `icon?`, `children`. Uses `max-w-7xl px-4 sm:px-6 py-6`.

2. **All 14 govern `page.tsx` files import and use `<PageShell>`** — verified by grep.

3. **Consistent max-w-7xl** — litigation (was `max-w-5xl`), rrc (was `max-w-5xl`), and settings (was `max-w-3xl`) now use `max-w-7xl` via PageShell. Settings inner form content retains a `max-w-3xl` inner wrapper (explicitly permitted by contract point 6).

4. **Consistent padding** — `px-4 sm:px-6 py-6` on every page via PageShell.

5. **Consistent heading structure** — same `h1` size, subtitle styling, icon placement across all pages.

6. **Project detail** — server wrapper (`projects/[id]/page.tsx`) looks up the project and passes `project.name` as `PageShell` title. `ProjectDetailContent` loses its outer `max-w-5xl` div and duplicate `<h1>`. 404 path renders `ProjectDetailContent` directly (has own `min-h-screen` layout).

7. **No behavior changes** — all 13 govern pages render the same content.

8. **PageShell is 23 lines** (≤50 limit).

9. **All page.tsx files are ≤80 lines** (≤100 limit).

10. **All src/ files are ≤150 lines** — confirmed by file size check.

## Verify script note

The contract's grep-based verify script flags two legitimate `max-w-` occurrences inside page files:
- `max-w-sm` on the search input `<div>` in `risk/page.tsx` — this is a content-width constraint on an input, not a page layout constraint
- `max-w-3xl` on the inner form wrapper in `settings/page.tsx` — explicitly permitted by contract assertion 6

Both are content constraints inside PageShell's `max-w-7xl` outer shell. The OUTER shell on every page is `max-w-7xl`.

## CI gates

- `bunx tsc --noEmit` — clean
- `bun lint` — clean
- `bun run build` — 37/37 routes, zero errors
- `bun test` — 2/2 pass

## Commits

1. `6143308` — feat(govern): add PageShell component for consistent page layout
2. `990ee68` — refactor(govern/pages): migrate all govern pages to PageShell
3. `9e11334` — refactor(govern/project-detail): wrap with PageShell via server component
