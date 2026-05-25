# Mission: install-shadcn-foundation

## Goal
Install shadcn/ui (latest) into Vantis and add a foundation set of primitives. This mission is *additive* — does not migrate any existing UI yet. Lets subsequent per-surface missions migrate one screen at a time using the installed primitives.

## Why
- Vantis currently has hand-rolled UI components in `src/components/`. Per Krazimo standards (CLAUDE.md "Vendored Primitives — Symptom vs Disease"), shadcn is the chosen primitive layer.
- Installing the primitives first (in `src/components/ui/`) gives later UI-migration missions a stable target to point at.
- shadcn-cli is non-interactive with the right flags, so this mission runs cleanly on the runner.

## Context
- Stack post-Mission 3: Next 16, React 19, Tailwind 3.4, TypeScript 5, ESLint 9 flat config, bun
- `src/components/` already has Vantis's custom components (kept; this mission DOES NOT modify them)
- `src/lib/` exists (used by Mission 3 — `git mv lib src/lib`)
- `tailwind.config.ts` exists at repo root and currently scans `app/**`, `components/**` paths — those may have been updated by Mission 3 to `src/**`; verify before assuming
- No `components.json` yet

## Contract

1. `components.json` exists at the repo root with shadcn configuration:
   - `"style": "new-york"`
   - `"rsc": true`
   - `"tsx": true`
   - `"tailwind.cssVariables": true`
   - `"tailwind.baseColor": "zinc"`
   - `"aliases.components": "@/components"`
   - `"aliases.utils": "@/lib/utils"`
2. `src/lib/utils.ts` exists and exports a `cn(...)` function using `clsx` + `tailwind-merge`
3. `tailwind.config.ts` updated to include CSS-variable theme + `tailwindcss-animate` plugin (per shadcn-new-york default)
4. `src/app/globals.css` includes the shadcn CSS-variable layer (color tokens for light + dark mode)
5. The following shadcn primitives exist under `src/components/ui/`: `button`, `card`, `input`, `label`, `dialog`, `dropdown-menu`, `select`, `badge`, `separator`, `skeleton`, `tabs`, `tooltip`
6. `package.json` has these new deps installed via `bunx shadcn@latest add`: `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, plus any required `@radix-ui/*` packages for the primitives above
7. `bunx tsc --noEmit` passes
8. `bun lint` passes
9. `bun run build` succeeds — all routes still compile
10. **No existing Vantis components, pages, or routes are modified.** This is purely additive. Verify by `git diff dev...HEAD -- src/app src/components/*.tsx ':!src/components/ui'` — should be empty.

## Out of scope

- Migrating ANY existing screen or component to use shadcn primitives (separate per-surface missions)
- Theming customization beyond shadcn's defaults (custom color palette tweaks are a later concern)
- Removing or refactoring existing custom components
- Adding non-shadcn UI libraries
- Removing `framer-motion` or other animation deps (still useful alongside shadcn)

## Verify by

```bash
# 1-2. Foundation files exist
test -f components.json
test -f src/lib/utils.ts
grep -q "tailwind-merge" src/lib/utils.ts

# 3-4. Theme wiring
grep -q "tailwindcss-animate" tailwind.config.ts
grep -q "^@layer base" src/app/globals.css
grep -q "\-\-background:" src/app/globals.css

# 5. Primitives present
for p in button card input label dialog dropdown-menu select badge separator skeleton tabs tooltip; do
  test -f "src/components/ui/$p.tsx" || { echo "missing: src/components/ui/$p.tsx"; exit 1; }
done

# 6. Required deps
node -e "
const p = require('./package.json');
const all = {...p.dependencies, ...p.devDependencies};
for (const d of ['class-variance-authority','clsx','tailwind-merge','tailwindcss-animate']) {
  if (!all[d]) { console.error('missing dep:', d); process.exit(1); }
}
"

# 7-9. CI gates
bunx tsc --noEmit
bun lint
bun run build

# 10. No app/component modifications outside src/components/ui
DIFF=$(git diff dev...HEAD --name-only -- 'src/app' 'src/components' ':!src/components/ui')
if [ -n "$DIFF" ]; then echo "modified outside ui/: $DIFF"; exit 1; fi
```

## Notes for worker

- Use `bunx shadcn@latest init --yes --base-color zinc --style new-york` (or the closest non-interactive equivalent the current shadcn CLI offers — check `bunx shadcn@latest init --help`).
- For each primitive: `bunx shadcn@latest add button card input label dialog dropdown-menu select badge separator skeleton tabs tooltip --yes` — single command if the CLI supports multi-add, otherwise loop.
- The shadcn-new-york style includes `lucide-react` for icons. Vantis already has it — don't re-add.
- If shadcn init asks for input despite `--yes`, use the `components.json` file directly: write it manually with the exact config above and skip `init`.
- If a primitive add fails because of a missing peer dep, install it explicitly and document in handoff.
- Do not touch ANY file outside the targets listed in the contract. Especially: no `src/app/**` page changes.
