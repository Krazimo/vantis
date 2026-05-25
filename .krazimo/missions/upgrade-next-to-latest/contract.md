# Mission: upgrade-next-to-latest

## Goal
Upgrade Next.js from 14.2.35 to the latest stable (16.x) along with React 18 → 19 and the surrounding ecosystem. Apply official codemods. Resolve any breaking changes that block build/lint/typecheck.

## Why
- Krazimo standards target latest Next.js
- Foundation for downstream missions (src/ migration, shadcn, etc.) that may benefit from Next 16+ features (Server Components stable, Server Actions improvements, etc.)
- React 18 → 19 unlocks the new compiler-aware hooks plugin and modern patterns

## Context
- Current: Next 14.2.35, React 18, ESLint 9 (flat config), bun 1.3.14 (just migrated)
- Vantis is App Router only (no `pages/`), uses TypeScript, no DB
- Lint script uses `eslint .` directly (Mission 1 changed away from `next lint`)
- The previous mission disabled `@next/next/no-duplicate-head` in `lint-presets/krazimo.mjs` due to ESLint 9 incompatibility in `@next/eslint-plugin-next@14`. Re-enabling is OK if Next 16's plugin is compatible.

## Contract

1. `package.json` has `next` at `^16.x` (whatever the latest stable is at execution time — `bun info next version` to discover)
2. `react` and `react-dom` at `^19.x`
3. `@next/eslint-plugin-next` upgraded to match the new `next` major (drop any version-pinning in `lint-presets/krazimo.mjs` if appropriate)
4. `bun install` succeeds — fresh `bun.lock` reflects the new versions
5. `bunx tsc --noEmit` passes (zero new errors introduced by this PR — pre-existing errors documented in handoff if any persist)
6. `bun lint` passes (re-enable `@next/next/no-duplicate-head` if Next 16's plugin supports ESLint 9; document in handoff if not)
7. `bun run build` succeeds — all routes compile, no runtime warnings about removed APIs
8. `next.config.mjs` valid under Next 16 (delete or migrate any options that became defaults or were removed)
9. `app/` routes still respond correctly — `bun run dev` starts cleanly with no error overlay (verify by `curl -fsS http://localhost:3000/` returns 200 within 30s of start; kill dev server after check)
10. Application of the official codemod is documented in handoff if any source files were transformed

## Out of scope

- Migrating `app/` → `src/app/` (separate mission)
- Installing shadcn (separate mission)
- Adding tests (separate mission)
- Rewriting components for React 19 compiler optimizations (separate mission)
- Database / ORM changes (vantis has none)
- The python scripts (`generate_docs.py`, `generate_images.py`) — out of scope

## Verify by

```bash
# 1. Next major version
node -e "const v=require('./package.json').dependencies.next; if(!/^\\^?16\\./.test(v)) { console.error('next not at 16.x:', v); process.exit(1); }"

# 2. React major
node -e "const v=require('./package.json').dependencies.react; if(!/^\\^?19\\./.test(v)) { console.error('react not at 19.x:', v); process.exit(1); }"

# 3. Lockfile fresh
bun install
git diff --exit-code bun.lock

# 4. Typecheck
bunx tsc --noEmit

# 5. Lint
bun lint

# 6. Build
bun run build

# 7. Dev server smoke
bun run dev > /tmp/vantis-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -fsS http://localhost:3000/ -o /dev/null
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true
```

## Notes for worker

- Always check the latest stable Next version with `bun info next version` before pinning — don't hardcode from memory.
- Apply `bunx @next/codemod@latest upgrade latest` (or `next-codemod` equivalent for the running version) — this handles most breaking-change rewrites automatically.
- If the codemod touches user code, review the diff in handoff so the validator and reviewer can see what changed.
- `framer-motion`, `lucide-react`, `recharts`, `qrcode.react`, `@anthropic-ai/sdk` may have their own React 19 compatibility requirements — bump as needed but flag any majors in handoff.
- If a dependency genuinely doesn't support React 19 yet, escalate via `blocked:needs-decision` rather than downgrading React.
- Keep the diff focused on the upgrade. Don't refactor unrelated code.
- All files must stay under 150 lines (no new code, but if codemod produces large files, split).
