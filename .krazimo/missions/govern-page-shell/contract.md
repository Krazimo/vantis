# Mission: govern-page-shell

## Goal
Extract a shared `PageShell` component for all Vantis Govern pages. Every govern page currently duplicates the same outer wrapper (padding + max-width + heading structure). Unify into one component so layout is consistent across all 13 govern routes.

## Why
- RRC Tracker uses `max-w-5xl`, QPR uses `max-w-7xl`, Settings uses `max-w-3xl` — inconsistent widths make the dashboard feel unpolished.
- Every page hand-writes the same heading pattern: `<h1>` + subtitle + icon. This is duplicated 13 times.
- Krazimo standards: "shared code that can be shared" must be extracted. This is the most obvious case.

## Context
- All 13 govern pages share this pattern at their root:
  ```tsx
  <div className="px-4 sm:px-6 py-6 max-w-?xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl text-foreground">Title</h1>
        <p className="text-muted-foreground text-xs mt-1">Subtitle</p>
      </div>
      <Icon className="w-6 h-6 text-muted-foreground hidden sm:block" />
    </div>
    {/* page content */}
  </div>
  ```
- The govern layout (`src/app/govern/layout.tsx`) handles sidebar + top bar. The `PageShell` sits inside it.

## Contract

1. `src/features/govern/components/PageShell.tsx` exists with props:
   - `title: string` — the page heading
   - `subtitle?: string` — optional description under the title
   - `icon?: React.ReactNode` — optional icon element in the top-right
   - `children: React.ReactNode` — page content
   - No `maxWidth` prop — ALL pages use the same width (`max-w-7xl`) for consistency
2. Every govern `page.tsx` (13 total: command centre, projects, projects/[id], qpr, litigation, scanner, risk, predictive, homebuyer, complaints, rrc, notices, settings, intelligence) uses `<PageShell>` as its outermost wrapper
3. All pages render at `max-w-7xl` — no more `max-w-5xl` or `max-w-3xl` outliers
4. Padding is consistent: `px-4 sm:px-6 py-6` on every page (via PageShell)
5. Heading structure is consistent: same `h1` size, same subtitle styling, same icon placement
6. Settings page uses the same `max-w-7xl` shell but may constrain its inner form content with a narrower wrapper inside — the OUTER shell must match all other pages
7. No behavior changes — all 13 pages render the same content, just with unified spacing
8. `PageShell.tsx` is ≤50 lines
9. Every `page.tsx` under `src/app/govern/` is ≤100 lines
10. Every file under `src/` (excluding `src/components/ui/**`) is ≤150 lines
11. `bunx tsc --noEmit` passes
12. `bun lint` passes
13. `bun run build` succeeds
14. `bun test` passes

## Out of scope

- Changing page content, data, or functionality
- Modifying the sidebar or top bar (those live in govern/layout.tsx)
- Adding new shared components beyond PageShell
- Theme changes
- Public portal pages (only govern)
- Modifying `src/components/ui/**`

## Verify by

```bash
# 1. PageShell exists
test -f src/features/govern/components/PageShell.tsx

# 2. All govern pages import PageShell
for f in $(find src/app/govern -name "page.tsx"); do
  grep -q "PageShell" "$f" || { echo "missing PageShell: $f"; exit 1; }
done

# 3. No varying max-w in page files (all handled by PageShell)
VARYING=$(grep -rn "max-w-" src/app/govern/*/page.tsx src/app/govern/page.tsx 2>/dev/null || true)
if [ -n "$VARYING" ]; then echo "pages still set their own max-w:"; echo "$VARYING"; exit 1; fi

# 4. PageShell uses max-w-7xl
grep -q "max-w-7xl" src/features/govern/components/PageShell.tsx

# 5. File size compliance
SHELL_LINES=$(wc -l < src/features/govern/components/PageShell.tsx)
if [ "$SHELL_LINES" -gt 50 ]; then echo "PageShell too large: $SHELL_LINES lines"; exit 1; fi

OVER=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -exec wc -l {} + 2>/dev/null \
  | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "files over 150:"; echo "$OVER"; exit 1; fi

# 6. CI gates
bunx tsc --noEmit
bun lint
bun run build
bun test
```

## Notes for worker

- The PageShell component is simple — ~20 lines of JSX. Don't overcomplicate it.
- For the `icon` prop, accept `React.ReactNode` so callers pass `<BarChart2 className="w-6 h-6 text-muted-foreground" />` directly.
- The `projects/[id]` detail page may not have the exact same heading pattern (it has tabs). Check if PageShell fits — if the detail page uses a fundamentally different layout, it can skip PageShell but must still use `max-w-7xl px-4 sm:px-6 py-6`.
- Settings page currently uses `max-w-3xl` — change the outer wrapper to `max-w-7xl` via PageShell, but the form content inside can use its own `max-w-3xl` container. The page should no longer look "squished" compared to neighbors.
- After updating each page, run `bun run build` to catch import/type errors before moving to the next.
- Import path: `import { PageShell } from '@/features/govern/components/PageShell'`
