# Mission: migrate-to-src-layout

## Goal
Move Vantis's source tree into a `src/` directory: `app/` → `src/app/`, `components/` → `src/components/`, `lib/` → `src/lib/`. Aligns with Krazimo next-standards source layout conventions.

## Why
- Krazimo standards expect source files under `src/` so deny rules in `.claude/settings.json` (e.g. `Edit(src/**)`, `Write(src/**)`) and hooks (`krazimo-mission-gate.sh`) correctly scope to actual application code, not config or top-level repo files.
- Cleaner separation between source and config — current top-level mixes `app/`, `components/`, `lib/` with `tailwind.config.ts`, `next.config.mjs`, `eslint.config.mjs`, etc.
- Foundation for Mission 4 (shadcn install) — shadcn's default install path is `src/components/ui/`.

## Context
- Current top-level: `app/`, `components/`, `lib/`, plus `data/`, `public/`, `lint-presets/`, configs
- Next.js auto-detects `src/app/` — no `next.config.mjs` change needed
- `tsconfig.json` has `paths` entries — likely needs updating if any `@/...` aliases reference the old roots
- ESLint preset (`lint-presets/krazimo.mjs`) has patterns like `^@/features/...` — vantis doesn't use features pattern so this shouldn't matter, but verify
- `data/`, `public/`, `lint-presets/` stay at the root — they are not source

## Contract

1. `src/app/` exists; old top-level `app/` does NOT exist
2. `src/components/` exists; old top-level `components/` does NOT exist
3. `src/lib/` exists; old top-level `lib/` does NOT exist
4. All files moved preserve git history (use `git mv`, not delete+create)
5. `tsconfig.json` paths still resolve correctly — any `@/...` alias still points to a valid location
6. `bunx tsc --noEmit` passes
7. `bun lint` passes
8. `bun run build` succeeds — all routes compile
9. `bun run dev` starts cleanly and serves a 200 on `/` within 30s

## Out of scope

- Reorganizing the contents of `components/` or `lib/` (just move them, don't refactor)
- Moving `data/`, `public/`, `lint-presets/` — those are NOT source
- Renaming or splitting any files (file-size cleanup is a separate mission)
- Adding shadcn / new components (separate mission)
- `generate_docs.py`, `generate_images.py` — Python scripts stay at root

## Verify by

```bash
# 1. New layout in place
test -d src/app
test -d src/components
test -d src/lib

# 2. Old layout gone
! test -d app
! test -d components
! test -d lib

# 3. Git history preserved (one of the moved files should show rename in log)
git log --follow --diff-filter=R -1 --name-status src/app/layout.tsx | grep -q "^R"

# 4-6. Static checks
bunx tsc --noEmit
bun lint
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

- Use `git mv app src/app && git mv components src/components && git mv lib src/lib` — preserves history (better than `mv` + `git add`).
- After moving, search for any hardcoded path references in configs (`tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `package.json` scripts, `.krazimo/`, `.husky/`, `.github/`).
- `tailwind.config.ts` content paths: update any `./components/**/*` or `./app/**/*` patterns to `./src/...`.
- `tsconfig.json` `paths` aliases: typically `"@/*": ["./*"]`. If so, may need to change to `"@/*": ["./src/*"]` for cleaner imports — but ONLY if app code uses `@/...` imports. If everything uses relative imports, leave tsconfig alone.
- Verify the dev server actually serves the same content as before — open `/` and one secondary route in `bun run dev` to confirm no 500s.
- Keep the diff focused. No content edits inside moved files.
