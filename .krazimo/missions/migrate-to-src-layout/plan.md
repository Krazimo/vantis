# Implementation Plan: migrate-to-src-layout

## Overview

Move `app/`, `components/`, and `lib/` into `src/` using `git mv` to preserve history.
Update the four config files that hardcode these paths. No file contents change.

---

## Findings

### Imports audit

All `@/` imports found across the codebase:

| Import prefix     | Resolution after move         |
|-------------------|-------------------------------|
| `@/components/…`  | `./src/components/…` ✓        |
| `@/lib/…`         | `./src/lib/…` ✓               |
| `@/data/…`        | `./data/…` (stays at root) ✓  |

There are **no** `@/app/…` imports. Files inside `app/` import from `@/components/…`,
`@/lib/…`, and `@/data/…`.

### Config files that need updating

| File                | What changes                                              |
|---------------------|-----------------------------------------------------------|
| `tailwind.config.ts` | `content` glob paths: `./app/…` and `./components/…` → `./src/app/…` / `./src/components/…` |
| `tsconfig.json`     | `paths["@/*"]`: `["./*"]` → `["./src/*", "./*"]`         |
| `eslint.config.mjs` | `ignores` paths for the two `@ts-nocheck` lib files       |

### Config files that need NO change

| File                 | Reason                                                   |
|----------------------|----------------------------------------------------------|
| `next.config.mjs`    | Next.js auto-detects `src/app/`; no `appDir` flag needed |
| `postcss.config.mjs` | No path references                                       |
| `package.json`       | Scripts run `next dev/build/lint` — no hardcoded paths   |
| `.github/` workflows | Run `bun lint`/`bun build` — no hardcoded paths          |
| `.husky/pre-commit`  | Checks `src/` pattern via git diff — already correct after move |
| `lint-presets/krazimo.mjs` | Glob patterns are all `**/*` or `src/shared/**` (already correct) |

---

## Step-by-Step Implementation

### Step 1 — Create `src/` and move directories

```bash
mkdir src
git mv app src/app
git mv components src/components
git mv lib src/lib
```

After this step:
- `src/app/`, `src/components/`, `src/lib/` exist
- `app/`, `components/`, `lib/` no longer exist at the root
- Git history is preserved (renames, not adds)

### Step 2 — Update `tailwind.config.ts`

File: `tailwind.config.ts`

Change the `content` array from:
```ts
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```
To:
```ts
content: [
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
],
```

Rationale: there is no `pages/` directory; remove it. The two active directories
move into `src/`.

### Step 3 — Update `tsconfig.json` paths

File: `tsconfig.json`

Change the `paths` entry from:
```json
"@/*": ["./*"]
```
To:
```json
"@/*": ["./src/*", "./*"]
```

Rationale: TypeScript tries entries in order. `@/components/…` and `@/lib/…` resolve
via `./src/` (first entry). `@/data/…` tries `./src/data/` (not found), falls through
to `./data/` (second entry, root-level `data/` which does not move). No import
statements in source files need to change.

### Step 4 — Update `eslint.config.mjs` ignore paths

File: `eslint.config.mjs`

Change the `ignores` array inside `vantis/ignores` from:
```js
ignores: ["lib/divya-villas-images.ts", "lib/divya-villas-pdfs.ts"],
```
To:
```js
ignores: ["src/lib/divya-villas-images.ts", "src/lib/divya-villas-pdfs.ts"],
```

Rationale: these two files carry `// @ts-nocheck` for embedded base64 blobs.
ESLint resolves ignore globs relative to the project root; the paths must match
the new locations.

---

## Verification

Run in order after all four steps are complete:

```bash
# Contract checks 1-3: layout in place, old layout gone, git history preserved
test -d src/app && echo "PASS: src/app exists"
test -d src/components && echo "PASS: src/components exists"
test -d src/lib && echo "PASS: src/lib exists"
! test -d app && echo "PASS: old app/ gone"
! test -d components && echo "PASS: old components/ gone"
! test -d lib && echo "PASS: old lib/ gone"
git log --follow --diff-filter=R -1 --name-status src/app/layout.tsx | grep -q "^R" && echo "PASS: git history preserved"

# Contract checks 4-6: static analysis
bunx tsc --noEmit
bun lint
bun run build
```

Dev server smoke test (contract check 7):
```bash
bun run dev > /tmp/vantis-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -fsS http://localhost:3000/ -o /dev/null && echo "PASS: / returns 200"
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true
```

---

## Commit Sequence

Single commit — the migration is one atomic change:

```
git add -A
git commit -m "feat(migrate-to-src-layout): move app/components/lib into src/"
```

Commit message body (optional detail):
```
- git mv app src/app, components src/components, lib src/lib
- tsconfig.json: @/* paths updated to ["./src/*", "./*"] for fallback to data/
- tailwind.config.ts: content globs updated to ./src/app and ./src/components
- eslint.config.mjs: ignores updated for src/lib/divya-villas-*.ts
- No import statements modified; no file contents changed inside moved files
```

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `@/data/…` imports break (data/ stays at root) | Medium | tsconfig fallback path `"./*"` resolves it |
| Build cache stale after move | Low | Delete `.next/` before final build verification |
| Dynamic `import('@/lib/…')` doesn't resolve | Low | Same tsconfig paths apply to dynamic imports via bundler |
| ESLint ignores stop matching → TS errors surface on base64 files | Low | Step 4 updates the paths explicitly |
