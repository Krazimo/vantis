# Handoff: add-test-infrastructure

## Status: complete

## Commit
866d652 feat(add-test-infrastructure): add vitest, smoke test, and scoped pre-push hook

## What was done

1. **vitest@4.1.7 + @vitejs/plugin-react@6.0.2** installed as devDependencies via `bun add -D`
2. **`"test": "vitest run"`** added to `package.json` scripts
3. **`vitest.config.ts`** created at repo root — `environment: 'node'`, includes `tests/unit/**/*.test.ts`, react plugin loaded
4. **`tests/unit/smoke.test.ts`** created — 2 tests for `cn()` from `src/lib/utils`: class concatenation and tailwind-merge conflict resolution
5. **`.husky/pre-push`** created + chmod +x — scoped gate: only runs `bun run test && bun run build` when `src/`, `tests/`, `package.json`, `bun.lock`, `tsconfig*`, `vitest.config*`, `next.config*`, or `middleware.*` files change; docs-only pushes skip silently

## Evidence

### bun run test
```
Test Files  1 passed (1)
     Tests  2 passed (2)
  Duration  141ms
```

### bunx tsc --noEmit
Exit 0, no errors.

### bun lint
Exit 0 (20 pre-existing file-length warnings, 0 errors — unrelated to this mission).

### bun run build
Exit 0 — 36 routes built successfully.

### Contract checks
- vitest in devDependencies: ✓
- @vitejs/plugin-react in devDependencies: ✓
- vitest.config.ts exists: ✓
- plugin-react in config: ✓
- test script = "vitest run": ✓
- tests/unit/smoke.test.ts exists: ✓
- .husky/pre-push is executable: ✓
- pre-push references src/: ✓

## Notes for next mission

- The `bun lint` warnings about file line counts (20 warnings) predate this mission — they are targets for a file-size cleanup mission.
- The smoke test uses explicit vitest imports (no globals), which keeps ESLint clean without any plugin configuration.
- `bun test` (bun's native runner) also runs the test file because the explicit vitest imports resolve normally.
