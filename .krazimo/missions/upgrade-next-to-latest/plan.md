# Implementation Plan: upgrade-next-to-latest

Architect: claude-sonnet-4-6
Date: 2026-05-25

---

## Versions discovered at planning time

Run `bun info <package> version` before each install to confirm nothing has
shifted. Do NOT use the numbers below as gospel — they are planning-time
snapshots for risk assessment only.

| Package | Current | Latest (2026-05-25) |
|---|---|---|
| next | 14.2.35 | 16.2.6 |
| react | ^18 | 19.2.6 |
| react-dom | ^18 | 19.2.6 |
| @types/react | ^18 | 19.2.15 |
| @types/react-dom | ^18 | 19.2.3 |
| @next/eslint-plugin-next | ^14.2.35 | 16.2.6 |
| eslint-plugin-react-hooks | ^5.0.0 | 7.1.1 |
| framer-motion | ^12.38.0 | 12.40.0 (minor, safe) |
| lucide-react | ^1.14.0 | 1.16.0 (minor, safe) |
| recharts | ^3.8.1 | 3.8.1 (already latest) |
| qrcode.react | ^4.2.0 | 4.2.0 (already latest) |
| @anthropic-ai/sdk | ^0.95.2 | 0.98.0 (minor, safe) |

---

## Breaking changes to address

### Next.js 15+ breaking change: `params` is now a Promise

In Next.js 15, dynamic route `params` in Server Components became
`Promise<{ id: string }>` instead of `{ id: string }`. The four server-page
wrappers that synchronously destructure `params` must be updated.

Affected files (all are thin server wrappers):
- `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/certificate/[id]/page.tsx`
- `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/developer/[id]/page.tsx`
- `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/govern/projects/[id]/page.tsx`
- `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/project/[id]/page.tsx`

Pattern fix for thin server wrappers that pass params to a Client Component:

```tsx
// BEFORE (Next 14)
export default function Page({ params }: { params: { id: string } }) {
  return <SomeContent params={params} />
}

// AFTER (Next 15/16) — make the page async, await params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <SomeContent params={resolvedParams} />
}
```

`app/project/[id]/page.tsx` uses `params.id` directly in the server component
body (no client wrapper), so it also needs `async` + `await params`.

### Next.js 15+ breaking change: `output: 'export'` removed from next.config

`output: 'export'` was **not present** in the current `next.config.mjs` —
the CLAUDE.md Session 8 note is historical, and the live config does not have
it. No change needed there. Confirm this before proceeding.

### `no-duplicate-head` ESLint rule

The comment in `lint-presets/krazimo.mjs` states the rule is off due to
`@next/eslint-plugin-next@14` ESLint 9 incompatibility. After upgrading to
`@next/eslint-plugin-next@16`, re-enable the rule by removing the `"off"`
override line and updating the comment.

### React 18 → 19: no direct breaking changes in this codebase

The app has no `ReactDOM.render`, no `createRoot` calls, no legacy context
API, no string refs, and no `act()` usage. All client components are
standard function components. React 19 is a drop-in here.

### `eslint-plugin-react-hooks` ^5 → ^7

v7 continues to export `configs['recommended-latest']` which is already
referenced in `lint-presets/krazimo.mjs`. No change to the preset needed;
just bump the version.

---

## Files to modify (exhaustive list)

### 1. `package.json`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/package.json`

Changes:
- `"next"`: `"14.2.35"` → `"^16.x.x"` (exact discovered version)
- `"react"`: `"^18"` → `"^19"`
- `"react-dom"`: `"^18"` → `"^19"`
- `"@types/react"`: `"^18"` → `"^19"`
- `"@types/react-dom"`: `"^18"` → `"^19"`
- `"@next/eslint-plugin-next"`: `"^14.2.35"` → `"^16.x.x"` (match next major)
- `"eslint-plugin-react-hooks"`: `"^5.0.0"` → `"^7.0.0"`

Do NOT bump: `framer-motion`, `lucide-react`, `recharts`, `qrcode.react`,
`@anthropic-ai/sdk` — their current `^`-pinned ranges already satisfy
the latest minor versions. No need to touch them for this mission.

After editing `package.json`, run:
```bash
bun install
```

This regenerates `bun.lock`.

### 2. `lint-presets/krazimo.mjs`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/lint-presets/krazimo.mjs`

Changes in the `krazimo/nextjs` config block:
- Remove the comment about ESLint 9 incompatibility (`no-duplicate-head uses context.getAncestors()...`)
- Change `"@next/next/no-duplicate-head": "off"` → `"@next/next/no-duplicate-head": "error"`

If `bun lint` fails because `@next/eslint-plugin-next@16` still does not
export this rule, revert that single line to `"off"` and add a comment:
`// @next/next/no-duplicate-head not yet in @next/eslint-plugin-next@16 — re-check at next major bump`

### 3. `app/certificate/[id]/page.tsx`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/certificate/[id]/page.tsx`

```tsx
import CertificateContent from './CertificateContent'

export function generateStaticParams() {
  return [
    { id: 'VG-2026-007034-0001' },
    { id: 'VG-2026-007821-0002' },
    { id: 'VG-2026-009134-0003' },
    { id: 'VG-2026-007934-0004' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CertificateContent params={resolvedParams} />
}
```

### 4. `app/developer/[id]/page.tsx`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/developer/[id]/page.tsx`

```tsx
import DeveloperContent from './DeveloperContent'

export function generateStaticParams() {
  return [
    { id: 'zion-estate' },
    { id: 'ozone-group' },
    { id: 'prestige-group' },
    { id: 'skylark-constructions' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <DeveloperContent params={resolvedParams} />
}
```

### 5. `app/govern/projects/[id]/page.tsx`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/govern/projects/[id]/page.tsx`

```tsx
import ProjectDetailContent from './ProjectDetailContent'

export function generateStaticParams() {
  return [
    { id: 'divya-villas' },
    { id: 'ozone-urbana' },
    { id: 'prestige-lakeside' },
    { id: 'skylark-arcadia' },
  ]
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <ProjectDetailContent params={resolvedParams} />
}
```

### 6. `app/project/[id]/page.tsx`

Modify: `/Users/mridul/actions-runner-vantis/_work/vantis/vantis/app/project/[id]/page.tsx`

This page uses `params.id` directly in its body (not a client component
wrapper). Make the default export async and `await params`:

```tsx
// Change the function signature from:
export default function ProjectProfile({ params }: { params: { id: string } }) {

// To:
export default async function ProjectProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Replace all params.id references with id
```

There are three occurrences of `params.id` in this file; replace each with
the destructured `id` local variable.

---

## Files NOT to modify

- `next.config.mjs` — current config (`trailingSlash`, `images.unoptimized`)
  remains valid under Next.js 16. No deprecated options present.
- `tsconfig.json` — no changes needed; `moduleResolution: "bundler"` and
  `jsx: "preserve"` are still correct for Next.js 16.
- `eslint.config.mjs` — no changes needed; project-level overrides remain valid.
- `app/layout.tsx` — no changes needed.
- `app/govern/layout.tsx` — `usePathname` and `useRouter` from `next/navigation`
  are unchanged in Next.js 16.
- `components/shared/VantisIntelligence.tsx` — framer-motion usage unchanged.
- `components/govern/RiskTimeline.tsx` — recharts usage unchanged.
- All data files, `lib/`, `styles/` — out of scope.

---

## Codemod strategy

Run the official codemod **after** `bun install` succeeds:

```bash
bunx @next/codemod@latest upgrade latest --dry-run
```

Review the dry-run output. If the codemod wants to transform any file beyond
what this plan already covers, apply it and include the diff in the handoff.
Most likely the codemod will only touch the `params` signature in the four
server pages — which this plan already covers manually. In that case, skip
the codemod or let it run as a no-op confirmation.

If the codemod transforms files: commit those changes in a dedicated commit
(Commit 3 in sequence below) so the diff is isolated and visible to the
validator.

---

## Commit sequence

### Commit 1 — dependency bump
```
chore(upgrade): bump next 14→16, react 18→19 and ecosystem
```
Files: `package.json`, `bun.lock`

Run before committing:
```bash
bun install
bunx tsc --noEmit
bun lint
bun run build
```
All three must pass before committing.

### Commit 2 — params async fix
```
fix(upgrade): await dynamic route params for Next.js 15+ API
```
Files:
- `app/certificate/[id]/page.tsx`
- `app/developer/[id]/page.tsx`
- `app/govern/projects/[id]/page.tsx`
- `app/project/[id]/page.tsx`

### Commit 3 — ESLint preset update
```
chore(upgrade): re-enable no-duplicate-head rule for Next 16 plugin
```
Files: `lint-presets/krazimo.mjs`

(Skip or merge into Commit 1 if re-enabling causes lint failures — document
the decision in handoff.)

### Commit 4 — codemod output (conditional)
```
chore(upgrade): apply @next/codemod upgrade latest transforms
```
Files: whatever the codemod modified.
Only create this commit if the codemod actually touches files.

---

## Test strategy

Run the full verification suite from the contract in order:

```bash
# 1. Confirm version strings in package.json
node -e "const v=require('./package.json').dependencies.next; if(!/^\^?16\./.test(v)) { console.error('next not at 16.x:', v); process.exit(1); }"
node -e "const v=require('./package.json').dependencies.react; if(!/^\^?19\./.test(v)) { console.error('react not at 19.x:', v); process.exit(1); }"

# 2. Typecheck
bunx tsc --noEmit

# 3. Lint
bun lint

# 4. Build
bun run build

# 5. Dev server smoke test
bun run dev > /tmp/vantis-dev.log 2>&1 &
DEV_PID=$!
sleep 12
curl -fsS http://localhost:3000/ -o /dev/null && echo "200 OK"
kill $DEV_PID 2>/dev/null || true
wait $DEV_PID 2>/dev/null || true
```

Manual verification after dev server starts:
- Navigate to `/` — search bar renders, project dropdown works
- Navigate to `/govern` — login screen renders, can log in with `chairman@krera.gov.in / demo`
- Navigate to `/govern/projects/divya-villas` — all 7 tabs load
- Navigate to `/project/ozone-urbana` — project profile renders
- Navigate to `/certificate/VG-2026-007034-0001` — certificate renders on light background

---

## Rollback strategy

The branch is `feat/upgrade-next-to-latest`. If the build is broken after
the upgrade and cannot be fixed within the mission:

```bash
# Reset to pre-upgrade state
git checkout main -- package.json bun.lock
bun install
```

This restores the original lockfile and `package.json`. No application source
files will have been touched at that point (source changes come in Commit 2
which is independent). The branch can be abandoned and the PR closed.

---

## Handoff notes (to fill in after implementation)

- Record actual installed versions from `bun pm ls` after `bun install`
- Record whether `@next/next/no-duplicate-head` was re-enabled or kept off
- Record whether the codemod touched any files beyond what the plan covers
- Record any pre-existing TypeScript errors found by `tsc --noEmit` that
  existed before this upgrade (do not fix them — document them)
- Record any new TypeScript errors introduced by the upgrade and how they
  were resolved
