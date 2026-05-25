# Implementation Plan: migrate-npm-to-bun

## Context

**Current state:**
- `package-lock.json` exists at repo root
- No `bun.lock` exists
- Workflow (`krazimo-mission-runner.yml`) already detects `bun.lock | bun.lockb` and runs `bun install`; falls through to `npm ci` without it
- `krazimo-ci.yml` already uses bun throughout
- Husky hooks (`.husky/pre-commit`, `.husky/commit-msg`) are pure bash — no npm references, no changes needed
- `package.json` scripts are standard Next.js: `dev`, `build`, `start`, `lint` — no changes needed
- `README.md`: boilerplate create-next-app with `npm run dev` as first option, then yarn/pnpm/bun
- `CLAUDE.md`: two locations with npm references:
  - Line 55: `Run npm run build after every major` (inside "NEVER BREAK THE BUILD" rule)
  - Line 550: `Run \`npm run lint\`` (inside Krazimo Engineering Standards)

## Files to Change

| File | Action | What changes |
|---|---|---|
| `bun.lock` | **Create** | `bun install` generates this |
| `package-lock.json` | **Delete** | Replaced by `bun.lock` |
| `README.md` | **Modify** | Replace npm-first Getting Started block |
| `CLAUDE.md` | **Modify** | Two npm references → bun |

No other files touch this migration.

---

## Step-by-Step Execution

### Step 1 — Verify bun version

```bash
bun --version
```

Expected: `1.x.x` (any 1.x is fine; this is for the worker's log, not a blocking check).

### Step 2 — Generate bun.lock

```bash
cd /path/to/vantis
bun install
```

**Expected outcome:** `bun.lock` created at repo root, `node_modules/` refreshed. No errors. If any package reports an incompatibility, surface it — do not silently downgrade.

### Step 3 — Verify install is stable (no drift)

```bash
bun install
git diff --exit-code bun.lock
```

Must exit 0. If the lockfile changes on a second install, there is a floating dep — resolve before proceeding.

### Step 4 — Delete package-lock.json

```bash
rm package-lock.json
```

### Step 5 — Update README.md

**Current block (lines 5–14 approximately):**
```markdown
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
```

**Replace with:**
```markdown
## Getting Started

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun dev
```
```

Remove or keep the rest of the README unchanged. The validator check is:
- `grep -E "bun (install|run)" README.md` → must match
- `! grep -E "^(npm install|npm run (dev|build|start|lint))" README.md` → must pass

The replacement above satisfies both: `bun install` and `bun dev` are present; no bare `npm run dev` line exists.

### Step 6 — Update CLAUDE.md

Two surgical replacements only:

**Change 1** — In "NEVER BREAK THE BUILD" rule (line ~55):

Old:
```
6. NEVER BREAK THE BUILD. Run npm run build after every major
```
New:
```
6. NEVER BREAK THE BUILD. Run bun run build after every major
```

**Change 2** — In Krazimo Engineering Standards / Lint preset section (line ~550):

Old:
```
- **Lint preset:** `@krazimo/next-standards` wired in `eslint.config.mjs`. Run `npm run lint`.
```
New:
```
- **Lint preset:** `@krazimo/next-standards` wired in `eslint.config.mjs`. Run `bun lint`.
```

The validator check `! grep -E "^npm run lint$" CLAUDE.md` will pass because the occurrence is inline (backtick-wrapped), not a bare line — but the change to `bun lint` makes it accurate regardless.

### Step 7 — Verify scripts work

```bash
bun lint
bun run build
```

Both must pass with zero errors before committing.

### Step 8 — Verify dev server starts

```bash
timeout 8 bun run dev > /tmp/vantis-dev.log 2>&1 || true
grep -q "Local:" /tmp/vantis-dev.log || grep -q "ready" /tmp/vantis-dev.log
```

### Step 9 — Commit

Stage only the four affected paths:

```bash
git add bun.lock README.md CLAUDE.md
git rm package-lock.json
git commit -m "chore(migrate-npm-to-bun): switch package manager from npm to bun"
git push
```

---

## Commit Sequence

Single commit. All changes are part of one logical operation (package manager switch).

```
chore(migrate-npm-to-bun): switch package manager from npm to bun
```

Files in commit:
- `bun.lock` (added)
- `package-lock.json` (deleted)
- `README.md` (modified)
- `CLAUDE.md` (modified)

---

## Test Strategy

No application test files exist in this project. Verification is entirely via the contract's `Verify by` commands:

1. `! test -f package-lock.json` — file gone
2. `test -f bun.lock` — lockfile present
3. `bun install && git diff --exit-code bun.lock` — lockfile stable
4. `timeout 8 bun run dev` → grep `Local:` or `ready` — dev starts
5. `bun run build` — build succeeds (37 routes, zero errors expected)
6. `bun lint` — lint passes
7. README grep checks — bun present, npm install/run lines absent
8. CLAUDE.md grep check — no bare `npm run lint` line

---

## What NOT to change

- `.husky/pre-commit` — pure bash, no npm refs
- `.husky/commit-msg` — pure bash, no npm refs
- `.github/workflows/krazimo-mission-runner.yml` — already detects `bun.lock`
- `.github/workflows/krazimo-ci.yml` — already uses bun
- `package.json` — scripts are package-manager-agnostic, no changes needed
- `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`, `eslint.config.mjs` — untouched
- Historical session notes in `CLAUDE.md` (e.g. `npm run build` in session logs) — out of scope per contract

---

## Risk Assessment

**Low risk.** This is a lockfile swap with two text replacements. The only risk is a bun incompatibility with an existing dependency — specifically `@krazimo/next-standards` (loaded via git+https) or the base64-heavy `lib/divya-villas-*.ts` build. Both were working under npm; bun uses the same node_modules layout, so no breakage expected. If `bun install` reports a warning, surface it before proceeding.
