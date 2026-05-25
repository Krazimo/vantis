# Implementation Plan: add-test-infrastructure

## Overview

Four targeted changes, no refactoring, no new abstractions:
1. Install two devDependencies (`vitest`, `@vitejs/plugin-react`)
2. Add `vitest.config.ts` at repo root
3. Add `"test": "vitest run"` script and `tests/unit/smoke.test.ts`
4. Add `.husky/pre-push` scoped gate

All TypeScript, ESLint, and Next.js build constraints are satisfied by design (see rationale sections below).

---

## Step 1 — Check and install devDependencies

```bash
bun info vitest version
bun info @vitejs/plugin-react version
bun add -D vitest@latest @vitejs/plugin-react@latest
```

**Why `@vitejs/plugin-react`:** Contract requires it and it future-proofs component tests. For the current `environment: 'node'` smoke test it does no harm.

Expected diff: `package.json` gains two entries under `devDependencies`; `bun.lock` is updated.

---

## Step 2 — Add `"test"` script to `package.json`

File: `package.json`

In the `"scripts"` block, add between `"lint"` and the closing brace:

```json
"test": "vitest run"
```

Result:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "test": "vitest run"
}
```

---

## Step 3 — Create `vitest.config.ts`

File: `vitest.config.ts` (repo root, new file)

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
})
```

**No path alias needed:** The smoke test uses a relative import (`../../src/lib/utils`), so no `resolve.alias` is required. Keep config minimal.

**TypeScript:** `tsconfig.json` already has `"include": ["**/*.ts"]`, so this file is covered. Vitest ships its own types; no additional `tsconfig` changes needed.

**ESLint:** The `krazimo/ignores` block in `lint-presets/krazimo.mjs` excludes `**/.next/**` but NOT the repo root, so this file will be linted. It contains only an `export default` with typed imports — clean.

---

## Step 4 — Create `tests/unit/smoke.test.ts`

File: `tests/unit/smoke.test.ts` (new directory + file)

```ts
import { describe, it, expect } from 'vitest'
import { cn } from '../../src/lib/utils'

describe('cn', () => {
  it('concatenates classes', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('merges conflicting Tailwind classes (tailwind-merge)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
})
```

**Why explicit imports:** Using `import { describe, it, expect } from 'vitest'` (not globals) means:
- No `globals: true` needed in vitest config
- No `eslint-plugin-vitest` needed to declare test globals
- `bun lint` passes without any additional config
- `bun test` (bun's native runner) also works because it resolves the vitest imports normally

**Two test cases:** Both satisfy "asserts it concatenates classes correctly". Vitest output will show `Test Files  1 passed (1)` — the validator grep `"1 passed|✓"` matches on both the file count ("1 passed") and each case ("✓").

**TypeScript:** `tsconfig.json` `include: **/*.ts` picks this up. `../../src/lib/utils` resolves correctly. `cn` is typed as `(...inputs: ClassValue[]) => string` — no type errors.

---

## Step 5 — Create `.husky/pre-push`

File: `.husky/pre-push` (new file)

```bash
#!/usr/bin/env bash

SOURCE_PATTERN='^(src/|tests/|package\.json|bun\.lock|tsconfig|vitest\.config|next\.config|middleware\.)'

while read local_ref local_sha remote_ref remote_sha; do
  if [ "$remote_sha" = "0000000000000000000000000000000000000000" ]; then
    BASE=$(git rev-list --max-parents=0 HEAD)
  else
    BASE="$remote_sha"
  fi

  if git diff --name-only "$BASE" "$local_sha" 2>/dev/null | grep -qE "$SOURCE_PATTERN"; then
    echo "Source/config changes detected — running test + build gate..."
    bun run test && bun run build
  else
    echo "No source/config changes — skipping test + build gate."
  fi
done

exit 0
```

**Pattern covers:** `src/`, `tests/`, `package.json`, `bun.lock`, `tsconfig*`, `vitest.config*`, `next.config*`, `middleware.*` — exactly as specified in the contract. No `prisma/`, `drizzle.config.*` (Vantis has no database layer). No `knip` (Vantis doesn't use it).

**New branch handling:** When `remote_sha` is all-zeros (first push of a new branch), diff against the initial commit. This avoids a blank diff that would silently skip the gate on first push.

**No `set -euo pipefail`:** The `while read` construct on stdin can receive zero lines (no-op push), which plays badly with `set -e`. The loop naturally exits without error in that case. Consistent with the existing `.husky/pre-commit` which also omits `set -e`.

After writing the file, make it executable:
```bash
chmod +x .husky/pre-push
```

---

## Step 6 — Verify all gates pass

Run in this order (each must exit 0):

```bash
bun run test
```
Expected: `Test Files  1 passed (1)` / `Tests  2 passed (2)` / exit 0

```bash
bun test
```
Expected: bun's native runner finds `tests/unit/smoke.test.ts`, resolves vitest imports, runs tests, outputs "✓" lines / exit 0

```bash
bunx tsc --noEmit
```
Expected: no type errors (vitest ships its types, `cn` return type is `string`)

```bash
bun lint
```
Expected: no lint errors (explicit vitest imports, no unused vars, clean file)

```bash
bun run build
```
Expected: Next.js build succeeds, 37/37 routes (vitest.config.ts is not a Next.js page)

```bash
test -x .husky/pre-push && echo "executable"
grep -q "src/" .husky/pre-push && echo "references src/"
```

---

## Commit sequence

**Single logical commit** (this is one atomic mission):

```
feat(add-test-infrastructure): add vitest, smoke test, and scoped pre-push hook

- vitest + @vitejs/plugin-react installed as devDependencies
- vitest.config.ts: environment: 'node', tests/unit/**/*.test.ts
- tests/unit/smoke.test.ts: 2 passing tests for cn() from src/lib/utils
- .husky/pre-push: scoped gate — only runs test + build when src/, tests/,
  package.json, bun.lock, tsconfig*, vitest.config*, next.config*, or
  middleware.* files change; docs-only pushes skip silently
```

---

## Files touched

| Path | Action |
|------|--------|
| `package.json` | Edit — add `"test": "vitest run"` to scripts; devDeps updated by bun |
| `bun.lock` | Updated automatically by `bun add` |
| `vitest.config.ts` | Create |
| `tests/unit/smoke.test.ts` | Create (new directory `tests/unit/`) |
| `.husky/pre-push` | Create + chmod +x |

**Not touched:** `tsconfig.json`, `eslint.config.mjs`, `lint-presets/krazimo.mjs`, any `src/` file, any existing Husky hook.

---

## Risk notes

| Risk | Mitigation |
|------|------------|
| `bun test` vs `bun run test` ambiguity | Explicit `vitest` imports make the test runnable by both bun's native runner and vitest; the validator grep matches either output |
| ESLint strict on test file | Resolved by explicit imports — no globals, no `any`, no unused variables |
| `@vitejs/plugin-react` version mismatch with React 19 | `@vitejs/plugin-react@latest` supports React 19 as of v4.x; check latest version before installing |
| `vitest.config.ts` esnext module format | `import.meta` not used; `defineConfig` is a named import; no `__dirname` CJS shim needed |
