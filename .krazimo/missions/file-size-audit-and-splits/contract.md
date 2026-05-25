# Mission: file-size-audit-and-splits

## Goal
Bring every Vantis application source file under 150 lines, per Krazimo standards (`CLAUDE.md` → "File size: Target 30-100 lines. Maximum 150 lines, split if larger.").

## Why
- 20 application files currently exceed 150 lines, the largest at 892.
- Krazimo standards mandate 150-line ceiling for maintainability. Future LLM-driven edits and human reviewers both benefit from focused files.
- Future per-screen UI-migration missions (post-shadcn) will be much smaller diffs once page files are decomposed.

## Context
- Stack post-Mission 5: Next 16, React 19, TS 5, Tailwind 3, shadcn primitives in `src/components/ui/*`, vitest infra, scoped pre-push hook
- All files live under `src/` (post-Mission 3)
- Existing custom Vantis components in `src/components/` (not yet migrated to shadcn — this mission does NOT migrate them, only splits oversized files)
- shadcn primitives in `src/components/ui/*` are **vendored as-shipped** per CLAUDE.md's "Vendored Primitives — Symptom vs Disease" rule and MUST NOT be modified (`dropdown-menu.tsx` at 201 lines and any other shadcn-generated file is **exempt**)

## Current offenders (must each end ≤150 lines)

Application files (NOT exempt):

```
892  src/app/govern/projects/[id]/ProjectDetailContent.tsx
542  src/app/govern/complaints/page.tsx
468  src/app/govern/scanner/page.tsx
428  src/app/govern/notices/page.tsx
413  src/app/govern/qpr/page.tsx
392  src/app/complaint/file/page.tsx
346  src/app/project/[id]/page.tsx
337  src/app/govern/projects/page.tsx
337  src/app/complaint/track/page.tsx
295  src/app/govern/layout.tsx
285  src/app/govern/page.tsx
283  src/app/developer/[id]/DeveloperContent.tsx
265  src/app/govern/predictive/page.tsx
262  src/app/govern/risk/page.tsx
251  src/components/govern/RiskTimeline.tsx
248  src/app/page.tsx
243  src/app/govern/homebuyer/page.tsx
240  src/app/govern/settings/page.tsx
237  src/app/govern/litigation/page.tsx
231  src/components/shared/VantisIntelligence.tsx
205  src/app/govern/rrc/page.tsx
199  src/app/certificate/[id]/CertificateContent.tsx
```

Exempt (do NOT modify — vendored shadcn primitives):

```
src/components/ui/**
```

## Contract

1. Every application file at `src/app/**` and `src/components/**` (EXCLUDING `src/components/ui/**`) is **≤150 lines** after this mission.
2. Each large file is decomposed into smaller, co-located files following these patterns (in priority order):
   - **Repeated JSX sections** → extract into a sub-component (one default or named export per file)
   - **Long static data arrays / object literals** → extract into a sibling `<feature>.data.ts` file
   - **Local helper functions** (formatters, calculators, mappers) → extract into a sibling `<feature>.utils.ts`
   - **Custom hooks** (`useState`+`useEffect`+derived state for one concern) → extract into a sibling `use<Thing>.ts`
   - **Type definitions used by multiple sub-components** → extract into a sibling `<feature>.types.ts`
3. Extracted files live in a sibling folder when 3+ pieces are extracted from one page (e.g. `src/app/govern/projects/[id]/_components/`, `src/app/govern/projects/[id]/_data/`); folder names are prefixed with `_` so Next.js does not treat them as routable.
4. Public route entry-point filenames (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`) keep their names; their internal implementation is what shrinks.
5. **No behavior changes.** The mission is purely structural. `bun run dev` and `bun run build` produce the same rendered routes (visually + functionally).
6. **No file deletions.** Every previously-existing route/component still resolves at its original URL/import path.
7. `bunx tsc --noEmit` passes.
8. `bun lint` passes.
9. `bun run build` succeeds (all routes compile).
10. `bun test` passes (the smoke test from Mission 5 still passes; new tests are out of scope).
11. Diff is scoped to `src/app/**` and `src/components/**` outside `src/components/ui/**`. No changes to `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `eslint.config.mjs`, or any other top-level config.

## Out of scope

- Migrating any Vantis custom UI component to shadcn primitives (separate per-surface missions)
- Adding tests for the extracted units (deferred)
- Renaming routes or changing URL structure
- Theming changes
- Restructuring of `src/lib/`
- Error-handling rework (Mission 7)
- ANY modifications to `src/components/ui/**`

## Verify by

```bash
# 1. Every application file ≤150 lines (excluding shadcn ui/)
OVER=$(find src/app src/components -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -exec wc -l {} + 2>/dev/null \
  | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "Files still over 150 lines:"; echo "$OVER"; exit 1; fi

# 2. Public route entry-points still exist for every route they did before
for f in $(git ls-tree -r --name-only origin/dev | grep -E '^src/app/.*/(page|layout|loading|error|not-found)\.tsx$'); do
  test -f "$f" || { echo "missing entry-point: $f"; exit 1; }
done

# 3. No modifications to vendored shadcn primitives
DIFF=$(git diff origin/dev...HEAD --name-only -- 'src/components/ui')
if [ -n "$DIFF" ]; then echo "modified vendored ui/: $DIFF"; exit 1; fi

# 4. No top-level config modifications
CONFIGS=$(git diff origin/dev...HEAD --name-only -- 'package.json' 'tsconfig.json' \
  'next.config.mjs' 'tailwind.config.ts' 'eslint.config.mjs' 'postcss.config.mjs')
if [ -n "$CONFIGS" ]; then echo "config files modified: $CONFIGS"; exit 1; fi

# 5. CI gates
bunx tsc --noEmit
bun lint
bun run build
bun test
```

## Notes for worker

- Do NOT mass-rename or invent abstractions. Each extraction must read naturally — a sub-component called `<ProjectHeader />`, not `<Component1 />`.
- For huge files (>400 lines), expect 3–5 extractions. For 200–300 line files, 1–2 extractions is usually enough.
- Keep extracted components close to their consumer (sibling `_components/` folder), NOT in `src/components/` — those are app-wide reusable pieces, this is screen-local decomposition.
- When extracting data arrays, type them and export the type too (e.g. `export type Project = { ... }; export const PROJECTS: Project[] = [...]`).
- The "use client" directive (if present at the top of a file) belongs on the file that USES the React hooks. After extraction, double-check: extracted sub-components that use hooks/state need "use client"; extracted pure data/utils files do NOT.
- Each split commit should be one route or one component at a time, with a descriptive message (`refactor(govern/projects): extract ProjectHeader, RiskBadge from ProjectDetailContent`). Aim for ~10-15 commits across the mission, not one mega-commit.
- After every batch of splits, run `bun run build` to catch import/path mistakes early. Do not push a broken build.
- `_components/` and `_data/` (underscore-prefixed) prevent Next.js from treating them as routes. Use them.
- Do NOT touch `src/components/ui/**`. If a shadcn primitive is over 150 lines, leave it. The CLAUDE.md "Vendored Primitives" rule is explicit.
- If after extraction a sub-component itself ends up over 150 lines, recurse — extract again until everything is ≤150.
