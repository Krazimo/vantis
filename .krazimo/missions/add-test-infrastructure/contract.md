# Mission: add-test-infrastructure

## Goal
Add vitest test infrastructure to Vantis with a smoke test, and add a scoped Husky `pre-push` hook (the same pattern used in LeadConversion that skips test/build for docs-only commits).

## Why
- Krazimo standards require testing for non-trivial logic. Vantis currently has zero tests and no test runner.
- Subsequent missions (file-size cleanup, error-handling audit, future feature work) need a safety net.
- The scoped `pre-push` hook is essential for the harness: contract/plan/handoff commits are docs-only and must not run the full test suite on the runner.

## Context
- Stack: Next 16, React 19, TypeScript 5, bun (post-Mission 2 + 3)
- No existing test framework; `package.json` has no `test` script
- Husky is already wired (Mission via initial harness install) with `pre-commit` and `commit-msg` hooks; no `pre-push` yet
- Vantis is mostly static content + a few client components — initial test surface is small. One smoke test is enough to prove the pipeline runs.

## Contract

1. `vitest` installed as a devDependency (latest stable)
2. `@vitejs/plugin-react` installed as a devDependency
3. `vitest.config.ts` exists at the repo root, configured for:
   - `environment: 'node'` for unit tests (`tests/unit/**/*.test.ts`)
   - JSX/TSX support via the react plugin
4. `package.json` has `"test": "vitest run"` script
5. `tests/unit/smoke.test.ts` exists with one passing test that imports something from `src/lib/utils.ts` (the `cn` function added in Mission 4) and asserts it concatenates classes correctly
6. `bun test` runs vitest, reports `1 passed`, exits 0
7. `.husky/pre-push` exists and skips `bun run test && bun run build` when the push contains no source changes (only `src/`, `tests/`, `package.json`, `bun.lock`, `tsconfig.json`, `vitest.config.ts`, and major configs trigger the full gate)
8. The pre-push script is executable (`chmod +x`)
9. `bunx tsc --noEmit` passes
10. `bun lint` passes
11. `bun run build` succeeds

## Out of scope

- Adding tests for application code (components, routes) — only one smoke test for the pipeline
- E2E/Playwright setup
- Refactoring existing code to be more testable
- Removing the `lint-presets/krazimo*.mjs` ignore from coverage (they shouldn't be tested anyway)

## Verify by

```bash
# 1-3. vitest installed + configured
node -e "const p = require('./package.json'); const all = {...p.dependencies, ...p.devDependencies}; ['vitest','@vitejs/plugin-react'].forEach(d => { if (!all[d]) { console.error('missing:', d); process.exit(1); } })"
test -f vitest.config.ts
grep -q "plugin-react" vitest.config.ts

# 4. test script
node -e "if (require('./package.json').scripts.test !== 'vitest run') { console.error('test script wrong'); process.exit(1); }"

# 5-6. Smoke test exists and passes
test -f tests/unit/smoke.test.ts
bun test 2>&1 | grep -qE "1 passed|✓"

# 7-8. Pre-push hook present, scoped, executable
test -x .husky/pre-push
grep -q "src/" .husky/pre-push    # must reference src/ as a "source" path

# 9-11. CI gates
bunx tsc --noEmit
bun lint
bun run build
```

## Notes for worker

- For the pre-push hook, copy the same pattern used in `/Users/zlink_sphinx/Desktop/Krazimo/LeadConversion/.husky/pre-push` (already on dev there). The relevant logic:
  - Pre-push gets remote SHA on stdin
  - If `git diff $BASE HEAD` shows changes under `src/`, `prisma/`, `tests/`, `package.json`, `bun.lock`, `tsconfig*`, `vitest.config*`, `next.config*`, `middleware.*`, `drizzle.config.*` → run `bun run test && bun run build && bunx knip ...`
  - Otherwise skip (echo "no source/schema/config changes — skipping")
- For Vantis specifically: vantis doesn't use knip yet, so don't include it. Just `bun run test && bun run build`.
- The smoke test can be 5 lines — purely to prove `bun test` works end-to-end.
- Vitest with `environment: 'node'` is correct for this initial setup (the `cn` utility is pure). If a future mission adds component tests, that mission can switch to `jsdom` or add a project config.
