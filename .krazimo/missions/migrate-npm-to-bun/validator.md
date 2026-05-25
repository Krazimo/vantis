# Validator Report: migrate-npm-to-bun

**Verdict: PASS**
**Date:** 2026-05-25
**Validator:** AI Review (Phase 4)

---

## Step 1 — Adversarial Validation

Each command from the contract's "Verify by" section was run verbatim.

| # | Command | Result |
|---|---------|--------|
| 1 | `! test -f package-lock.json` | ✅ PASS — file does not exist |
| 2 | `test -f bun.lock` | ✅ PASS — file present |
| 3 | `bun install && git diff --exit-code bun.lock` | ✅ PASS — "Checked 402 packages (no changes)"; lockfile stable |
| 4 | `bun run dev` → "Local:" within 8s | ✅ PASS — "Local: http://localhost:3000" at 3.1s |
| 5 | `bun run build` | ✅ PASS — "Generating static pages (37/37)", 0 errors |
| 6 | `bun lint` | ✅ PASS — "0 errors, 20 warnings" (all `max-lines`, informational) |
| 7 | `grep -E "bun (install\|run)" README.md` | ✅ PASS — found `bun install` and `bun dev` |
| 8 | `! grep -E "^(npm install\|npm run ...)" README.md` | ✅ PASS — no bare npm commands |
| 9 | `! grep -E "^npm run lint$" CLAUDE.md` | ✅ PASS — not found |

All 8 contract assertions satisfied.

---

## Step 2 — Code Quality Review

### Diff scope

Files changed: `bun.lock` (new), `package-lock.json` (deleted), `package.json`, `README.md`, `CLAUDE.md`, `eslint.config.mjs`, `lint-presets/krazimo.mjs` (new), `lint-presets/krazimo-strict.mjs` (new), `.github/workflows/krazimo-mission-runner.yml`, 9 source files.

### Findings

#### LOW — `lint-presets/krazimo-strict.mjs` has a broken import

`krazimo-strict.mjs:3` imports `./index.mjs` which does not exist in `lint-presets/`. The correct file is `krazimo.mjs`. This file is dead code (nothing imports it), so it does not affect the build or lint. But it's inaccurate and will confuse any future consumer.

**Recommendation:** fix the import to `./krazimo.mjs` or delete the file if it's not needed.

#### LOW — `@typescript-eslint/no-non-null-assertion` disabled project-wide

This rule is disabled via `eslint.config.mjs` rather than with targeted inline `// eslint-disable-next-line` comments. For a demo app this is acceptable, but disabling it globally means new `!` assertions will also go unchecked. The handoff acknowledges this.

**Recommendation:** if the rule is re-enabled in a follow-up, prefer inline disables to keep the project-level config clean.

#### INFORMATIONAL — 4 jsx-a11y rules disabled project-wide

`jsx-a11y/click-events-have-key-events`, `jsx-a11y/no-static-element-interactions`, `jsx-a11y/no-noninteractive-element-interactions`, `jsx-a11y/label-has-associated-control` are all off. The handoff documents why (onClick-on-divs pattern throughout the demo app) and recommends a follow-up mission `fix-accessibility-lint`. The comment in `eslint.config.mjs` is clear and accurate.

#### PASS — Source file changes are surgical and correct

All 9 source file changes are minimal:
- Unused imports/vars removed (AlertTriangle, DISTRICTS, formatDate, unused `i`, riskFill, styleStr, projectName prop)
- Ternary-as-statement converted to `if/else` in `qpr/page.tsx`
- Unescaped `'` in JSX fixed in `rrc/page.tsx`
- `lang="en"` added to `<html>` in `global-error.tsx`

Every changed line traces directly to making `bun lint` pass. No unrelated cleanup.

#### PASS — Vendored lint preset is justified

`@krazimo/next-standards` removed from `package.json` devDependencies and the ESLint config vendored into `lint-presets/krazimo.mjs`. The package uses a `github:Krazimo/next-standards#v0.3.3` spec that requires PAT authentication in CI, making it a CI blocker. The vendored copy is a snapshot of the preset with one documented change (`no-duplicate-head` disabled for ESLint 9 compat). This is a correct pragmatic choice for the demo context.

#### PASS — Workflow authentication setup is correct

The workflow `krazimo-mission-runner.yml` adds PAT-based git rewrites that wipe stale runner config before setting up. The approach (x-access-token, `--unset-all` before `--add`) is the correct GitHub-recommended pattern. The npm cache clean is harmless even though bun is now the package manager.

---

## Summary

The migration is complete and correct. All contract assertions pass. Two low-severity code quality issues noted (broken `krazimo-strict.mjs` import, project-wide `no-non-null-assertion` disable) that are non-blocking. The accessibility rule disables are well-documented with a clear follow-up path.
