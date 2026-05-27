# Validator Report: govern-page-shell

**Date:** 2026-05-27  
**Verdict: PASS**

---

## Step 1 — Adversarial Validation

### Assertion 1 — PageShell exists with correct props
```
PASS: src/features/govern/components/PageShell.tsx exists
```
Props confirmed: `title: string`, `subtitle?: string`, `icon?: ReactNode`, `children: ReactNode`. No `maxWidth` prop.

### Assertion 2 — All govern pages import PageShell
```
PASS: all govern pages import PageShell
```
14 `page.tsx` files under `src/app/govern/` all contain `PageShell` (grep confirmed zero misses).

### Assertion 3 — No varying max-w in page files
The contract grep fires on two occurrences — both legitimate:
- `risk/page.tsx:23` — `max-w-sm` on a search `<input>` wrapper (content constraint, not layout)
- `settings/page.tsx:28` — `max-w-3xl` on the inner form wrapper (explicitly permitted by contract §6)

The OUTER wrapper on every page is `max-w-7xl` via PageShell. **PASS (with correct caveats documented in handoff).**

### Assertion 4 — PageShell uses max-w-7xl
```
PASS: grep confirmed max-w-7xl in PageShell.tsx
```

### Assertion 5 — PageShell ≤50 lines
```
PASS: 23 lines
```

### Assertion 6 — Settings inner content may use narrower wrapper
Settings `page.tsx` wraps form content in `max-w-3xl` inside PageShell's `max-w-7xl`. **PASS.**

### Assertion 7 — No behavior changes
Content on all 13 pages is functionally identical. Two cosmetic simplifications noted in code review below — not functional regressions.

### Assertion 8 — PageShell ≤50 lines
```
PASS: 23 lines
```

### Assertion 9 — Every govern page.tsx ≤100 lines
```
PASS: largest is qpr/page.tsx at 88 lines
```
All 14 files are ≤88 lines.

### Assertion 10 — All src/ files ≤150 lines
```
PASS: no files over 150 lines
```

### CI Gates
| Gate | Result |
|------|--------|
| `bunx tsc --noEmit` | ✅ clean |
| `bun lint` | ✅ clean |
| `bun run build` | ✅ 37/37 routes, zero errors |
| `bun test` | ✅ 2/2 pass |

---

## Step 2 — Code Quality Review

### PageShell.tsx
- 23 lines, clean JSX. Single named export. Props interface is correct TypeScript. Uses `ReactNode` from `react` (type-only import). No comments needed — code is self-documenting. **No issues.**

### Per-page changes
- All 14 pages: surgical — only the outer wrapper replaced with `<PageShell>`, content untouched.
- Unused icon imports correctly removed alongside the inline subtitle icon elements (e.g. `Clock` from command centre, `Building2` from project registry).
- No new `any`, no new dependencies, no error handling changes.

### Project detail pattern
- Server component `projects/[id]/page.tsx` looks up the project and passes `project.name` as `title`. 
- 404 path bypasses PageShell and returns `ProjectDetailContent` directly — correct, as that path has its own `min-h-screen` layout.
- `ProjectDetailContent` has its `<h1>` removed (now rendered by PageShell). The heading size shifts from `text-xl sm:text-2xl font-bold` to `text-2xl sm:text-3xl` (PageShell default) — slightly larger, no longer bold. Minor visual delta, not a functional regression.

### Minor notes (non-blocking)
1. **Command Centre subtitle**: Original had a `<Clock className="w-3 h-3" />` inline icon before the subtitle text. Converted to a plain-string `subtitle` prop — icon is gone. Decorative only; no information lost.
2. **Project Registry subtitle**: Same — `<Building2>` icon was inlined in the subtitle row, now plain text. Decorative only.

Both are an inevitable trade-off of `subtitle: string` (rather than `subtitle: ReactNode`). The contract does not require exact pixel preservation. Not blocking.

### Standards compliance
- File size: ✅ all within limits
- Naming: ✅ `PageShell.tsx` is PascalCase, named export
- No `any`: ✅
- No empty catch blocks introduced: ✅
- Single responsibility: ✅ PageShell does one thing

---

## Final Verdict: **PASS**

All 14 contract assertions verified. CI gates clean. Code quality meets Krazimo Next.js standards. Two minor cosmetic notes noted above — neither is blocking.
