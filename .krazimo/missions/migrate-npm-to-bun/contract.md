# Mission: migrate-npm-to-bun

## Goal
Switch Vantis from npm to bun as the package manager.

## Why
Krazimo standards mandate bun. The mission runner workflow's auto-detection (`if bun.lock || bun.lockb`) currently falls through to `npm ci`. Every subsequent harness mission will be smoother with bun: faster installs on the runner, `bunx`/`bun run` commands in the architect/worker prompts will work, and downstream missions can assume bun.

## Context
- Current: `package-lock.json` exists, no `bun.lock`. Workflow falls back to `npm ci`.
- Vantis stack: Next.js 14.2.35, React 18, TS 5, Tailwind 3 — no DB, no test framework yet.
- Husky hooks already use bash (no npm refs). Workflow files only reference `npm ci` as fallback — will auto-pick bun once `bun.lock` exists.
- README.md and CLAUDE.md mention npm in install/usage instructions.

## Contract

The migration must:

1. Delete `package-lock.json`
2. Create `bun.lock` by running `bun install`
3. Keep `node_modules/` matching `bun.lock` (no orphan dependencies, no missing ones)
4. All scripts in `package.json` (`dev`, `build`, `start`, `lint`) work via `bun run <script>` exactly as they did via `npm run <script>`
5. README.md install/usage instructions updated to use `bun install` / `bun run` (any references to `npm` for install/usage must be replaced; references inside historical commit notes are out of scope)
6. CLAUDE.md mentions of `npm run lint` are updated to `bun lint`

## Out of scope

- Upgrading dependency versions (separate mission: Next.js latest)
- Migrating source layout to `src/` (separate mission)
- Installing new tools (vitest, shadcn) — separate missions
- Re-writing scripts beyond what's needed for the migration
- Removing or updating the Python scripts (`generate_docs.py`, `generate_images.py`) — out of scope
- Removing the unused `@anthropic-ai/sdk` dependency (audit happens in a later mission if at all)

## Verify by

The validator must run these commands and confirm each passes:

```bash
# 1. package-lock.json gone
! test -f package-lock.json

# 2. bun.lock exists
test -f bun.lock

# 3. bun install is clean (no errors, no stale deps)
bun install
git diff --exit-code bun.lock  # exits 0 if no change after a fresh install

# 4. dev script works (start, then kill quickly)
timeout 8 bun run dev > /tmp/vantis-dev.log 2>&1 || true
grep -q "Local:" /tmp/vantis-dev.log || grep -q "ready" /tmp/vantis-dev.log

# 5. build succeeds
bun run build

# 6. lint passes (don't change behavior — must still pass)
bun lint

# 7. README mentions bun, not npm
grep -E "bun (install|run)" README.md
! grep -E "^(npm install|npm run (dev|build|start|lint))" README.md

# 8. CLAUDE.md updated
! grep -E "^npm run lint$" CLAUDE.md
```

## Notes for the worker

- Use `bun@latest` — verify with `bun --version` before installing
- After `bun install`, commit `bun.lock`. Don't commit `node_modules/`.
- If `bun install` flags incompatible packages, surface the conflict — don't silently downgrade.
- If a Husky hook breaks because of `bun install` rebuilding things, fix the hook, don't bypass it.
- Keep the diff focused — only files this mission needs to change.
