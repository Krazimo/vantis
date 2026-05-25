# Implementation Plan: install-shadcn-foundation

## Context summary

| Item | Current state |
|------|--------------|
| `src/lib/utils.ts` | Exists. `cn()` uses plain `.filter(Boolean).join(' ')` — must be replaced with `clsx` + `tailwind-merge` |
| `src/components/ui/` | Has `Button.tsx`, `Card.tsx`, `Modal.tsx`, `Table.tsx` — all are **empty stubs** ("Session 2" placeholders), **zero imports anywhere** |
| `tailwind.config.ts` | Has Vantis custom hex colors; no CSS-variable tokens, no `tailwindcss-animate` plugin |
| `src/app/globals.css` | Has bare `--background` + `--foreground` vars in `:root`; no `@layer base` block, no full shadcn CSS-variable set |
| `components.json` | Does not exist |
| `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate` | Not installed |

**Approach:** Do NOT run `bunx shadcn@latest init`. It would overwrite `tailwind.config.ts` and `globals.css` wholesale and destroy the Vantis design system. Instead: install deps manually, write `components.json` manually, patch the two config files surgically, then run `bunx shadcn@latest add` (which only writes component files, no config changes).

**macOS case-sensitivity hazard:** `src/components/ui/Button.tsx` and shadcn's output `src/components/ui/button.tsx` are the same path on APFS (case-insensitive). Since `Button.tsx` and `Card.tsx` are unused stubs with zero imports, delete them before running `shadcn add` so shadcn creates clean lowercase files.

---

## Step 1 — Install runtime dependencies

```bash
bun add clsx tailwind-merge class-variance-authority tailwindcss-animate
```

Expected additions to `package.json` `dependencies`:
- `clsx`
- `tailwind-merge`
- `class-variance-authority`
- `tailwindcss-animate`

Do not pin versions — `@latest` is used via `bun add`.

---

## Step 2 — Update `src/lib/utils.ts`

Replace the `cn()` implementation only. Keep `formatDate` and `formatCrore` unchanged.

**File:** `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatCrore(value: number): string {
  return `Rs.${value.toLocaleString('en-IN')} crore`
}
```

---

## Step 3 — Create `components.json`

Write this file at the **repo root** (`/components.json`, not inside `src/`).

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

`@/components` resolves to `src/components/` via the `tsconfig.json` path alias `"@/*": ["./src/*", "./*"]`. shadcn will therefore write primitives to `src/components/ui/`.

---

## Step 4 — Update `tailwind.config.ts`

**Strategy:** Extend the existing config additively.

- Add shadcn CSS-variable color tokens under `theme.extend.colors`. For tokens that already exist in the Vantis palette (`background`, `foreground`, `border`), replace the hex literal with `hsl(var(--token))` and calibrate the CSS variable to the same Vantis hex value (see Step 5).
- Add `borderRadius` extension so shadcn's `rounded-sm/md/lg` references work.
- Add `tailwindcss-animate` to plugins.
- Keep all other existing Vantis color tokens intact.

**Complete replacement for `tailwind.config.ts`:**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Vantis design system (hex) ─────────────────────────── */
        surface:          '#0F0F1A',
        surface2:         '#161622',
        gold:             '#C9A84C',
        'gold-light':     '#E8D5A3',
        'gold-dim':       '#8B7035',
        'off-white':      '#F0EEE8',
        silver:           '#C8C8D8',
        gray:             '#6B6B88',
        'gray-light':     '#9090AA',
        'border-soft':    '#2A2A3E',
        'border-gold':    '#3A3020',
        green:            '#2ECC71',
        amber:            '#F39C12',
        red:              '#E74C3C',
        blue:             '#3498DB',

        /* ── shadcn CSS-variable tokens ─────────────────────────── */
        /* background / foreground / border reference the CSS vars   */
        /* which are set to match Vantis hex values in globals.css   */
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
```

**Notes:**
- `darkMode: ["class"]` is added. Vantis doesn't currently toggle dark mode — this is inert but required for shadcn primitives to compile. It will not cause any visual change since `class="dark"` is not applied anywhere.
- `border` color was `'#1E1E2E'` (hex) and is now `hsl(var(--border))`. `--border` is set to `240 21% 15%` in globals.css, which renders as `#26263A` — near-identical to the original. If exact pixel-perfect match is critical, override `--border` to the precise Vantis value (see Step 5 table).
- `background` was `'#0A0A0F'` and is now `hsl(var(--background))`. `--background: 240 20% 5%` renders as `#09090F` — visually indistinguishable.

---

## Step 5 — Update `src/app/globals.css`

Add a full `@layer base` block with `:root` CSS variable definitions. Vantis is dark-only — set all values in `:root` directly (no `.dark` class toggle needed).

**Color mapping (Vantis hex → HSL triple for CSS var):**

| CSS var | Vantis hex | HSL triple |
|---------|-----------|-----------|
| `--background` | `#0A0A0F` | `240 20% 5%` |
| `--foreground` | `#F0EEE8` | `45 21% 93%` |
| `--card` | `#0F0F1A` (surface) | `240 22% 8%` |
| `--card-foreground` | `#F0EEE8` | `45 21% 93%` |
| `--popover` | `#0F0F1A` | `240 22% 8%` |
| `--popover-foreground` | `#F0EEE8` | `45 21% 93%` |
| `--primary` | `#C9A84C` (gold) | `40 52% 55%` |
| `--primary-foreground` | `#0A0A0F` | `240 20% 5%` |
| `--secondary` | `#161622` (surface2) | `240 17% 11%` |
| `--secondary-foreground` | `#F0EEE8` | `45 21% 93%` |
| `--muted` | `#161622` | `240 17% 11%` |
| `--muted-foreground` | `#6B6B88` (gray) | `245 13% 48%` |
| `--accent` | `#161622` | `240 17% 11%` |
| `--accent-foreground` | `#F0EEE8` | `45 21% 93%` |
| `--destructive` | `#E74C3C` (red) | `4 76% 56%` |
| `--destructive-foreground` | `#F0EEE8` | `45 21% 93%` |
| `--border` | `#1E1E2E` | `240 21% 15%` |
| `--input` | `#1E1E2E` | `240 21% 15%` |
| `--ring` | `#C9A84C` (gold) | `40 52% 55%` |
| `--radius` | (design: rounded-sm) | `0.125rem` |

**Append to `src/app/globals.css`** (after the existing content):

```css
@layer base {
  :root {
    --background:            240 20% 5%;
    --foreground:            45 21% 93%;
    --card:                  240 22% 8%;
    --card-foreground:       45 21% 93%;
    --popover:               240 22% 8%;
    --popover-foreground:    45 21% 93%;
    --primary:               40 52% 55%;
    --primary-foreground:    240 20% 5%;
    --secondary:             240 17% 11%;
    --secondary-foreground:  45 21% 93%;
    --muted:                 240 17% 11%;
    --muted-foreground:      245 13% 48%;
    --accent:                240 17% 11%;
    --accent-foreground:     45 21% 93%;
    --destructive:           4 76% 56%;
    --destructive-foreground: 45 21% 93%;
    --border:                240 21% 15%;
    --input:                 240 21% 15%;
    --ring:                  40 52% 55%;
    --radius:                0.125rem;
  }
}
```

Also update the two existing `:root` variables to match:
```css
:root {
  --background: #0A0A0F;   /* keep as-is — used by body { background } */
  --foreground: #F0EEE8;   /* keep as-is */
}
```
These hex vars in the existing `:root` block are only used by the `body { background: #0A0A0F }` rule and don't interfere with the HSL triples in `@layer base`.

---

## Step 6 — Remove conflicting placeholder stubs

The existing `Button.tsx` and `Card.tsx` in `src/components/ui/` are session-2 stubs with no imports anywhere in the codebase. On macOS APFS (case-insensitive), writing `button.tsx` would silently overwrite `Button.tsx`. Remove them before running `shadcn add` to avoid ambiguity:

```bash
rm src/components/ui/Button.tsx src/components/ui/Card.tsx
```

`Modal.tsx` and `Table.tsx` have no shadcn counterparts in the primitive list — leave them.

---

## Step 7 — Add shadcn primitives

With `components.json` in place, `shadcn add` only writes component files. It does **not** re-run config changes to `tailwind.config.ts` or `globals.css`.

```bash
bunx shadcn@latest add button card input label dialog dropdown-menu select badge separator skeleton tabs tooltip --yes
```

Expected output: 12 files created under `src/components/ui/`:
```
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/dialog.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/select.tsx
src/components/ui/badge.tsx
src/components/ui/separator.tsx
src/components/ui/skeleton.tsx
src/components/ui/tabs.tsx
src/components/ui/tooltip.tsx
```

The command will also install required `@radix-ui/*` peer deps via bun automatically. Expected new packages in `package.json`:
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-slot`
- `@radix-ui/react-tabs`
- `@radix-ui/react-tooltip`

**Post-add guard:** Immediately run `git diff src/app src/components/govern src/components/public src/components/shared src/lib/claude.ts src/lib/scoring.ts` and verify it is empty. If `shadcn add` touched anything outside `src/components/ui/`, `src/lib/utils.ts`, `tailwind.config.ts`, `globals.css`, or `package.json` — revert those hunks.

---

## Step 8 — CI gates

Run in order (each must pass before proceeding to the next):

```bash
# TypeScript
bunx tsc --noEmit

# Lint
bun lint

# Build
bun run build
```

If `tsc` reports errors:
- Most likely cause: shadcn wrote a component that imports a type not present in React 19. shadcn supports React 19 — if this happens, check `bunx shadcn@latest` version and update.
- Second cause: `tailwind-merge` or `clsx` types missing — `bun add -d @types/clsx` (unlikely, both ship their own types).

If `bun lint` reports errors:
- shadcn components use `React.forwardRef` and display names; the linter preset may flag unused vars in the `ref` parameter. Add targeted `// eslint-disable-next-line` only on the specific generated line, or add a narrow rule override to `eslint.config.mjs` scoped to `src/components/ui/**`.

If `bun run build` fails:
- The most common issue is the `tailwind.config.ts` `require('tailwindcss-animate')` being ESM-incompatible. If the build errors with `require is not defined in ES module scope`, change the plugin line to:
  ```ts
  import tailwindcssAnimate from 'tailwindcss-animate'
  // ...
  plugins: [tailwindcssAnimate],
  ```
  and add `import tailwindcssAnimate from 'tailwindcss-animate'` at the top of `tailwind.config.ts`.

---

## Step 9 — Commit

```bash
git add components.json src/lib/utils.ts tailwind.config.ts src/app/globals.css src/components/ui/ package.json bun.lock
git commit -m "feat(install-shadcn-foundation): install shadcn/ui primitives

- Add components.json (new-york, zinc, cssVariables, RSC)
- Replace cn() with clsx + tailwind-merge
- Extend tailwind.config with shadcn CSS-variable token set
- Add @layer base CSS variables to globals.css (Vantis-calibrated HSL values)
- Add 12 shadcn primitives: button card input label dialog dropdown-menu select badge separator skeleton tabs tooltip
- Install class-variance-authority clsx tailwind-merge tailwindcss-animate + Radix UI peer deps

No existing pages or components modified."
```

---

## Verification checklist

Run the exact commands from the contract's "Verify by" section:

```bash
# 1-2
test -f components.json
test -f src/lib/utils.ts
grep -q "tailwind-merge" src/lib/utils.ts

# 3-4
grep -q "tailwindcss-animate" tailwind.config.ts
grep -q "^@layer base" src/app/globals.css
grep -q "\-\-background:" src/app/globals.css

# 5
for p in button card input label dialog dropdown-menu select badge separator skeleton tabs tooltip; do
  test -f "src/components/ui/$p.tsx" || { echo "missing: src/components/ui/$p.tsx"; exit 1; }
done

# 6
node -e "
const p = require('./package.json');
const all = {...p.dependencies, ...p.devDependencies};
for (const d of ['class-variance-authority','clsx','tailwind-merge','tailwindcss-animate']) {
  if (!all[d]) { console.error('missing dep:', d); process.exit(1); }
}
"

# 7-9
bunx tsc --noEmit
bun lint
bun run build

# 10 — no app/component modifications outside src/components/ui
DIFF=$(git diff dev...HEAD --name-only -- 'src/app' 'src/components' ':!src/components/ui')
if [ -n "$DIFF" ]; then echo "modified outside ui/: $DIFF"; exit 1; fi
```

---

## Risk register

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| `shadcn add` also rewrites `tailwind.config.ts` or `globals.css` | Low (only `init` does this) | Check `git diff` immediately after; revert unwanted hunks |
| macOS case-insensitive FS collapses `button.tsx` → `Button.tsx` | Certain if stubs not removed | Step 6 removes stubs first |
| `require('tailwindcss-animate')` fails in ESM config | Medium (depends on Next 16 config format) | Use ESM import syntax as shown in Step 8 fallback |
| shadcn CLI prompts interactively despite `--yes` | Low | `components.json` already exists — CLI reads it and skips init prompts |
| Radix peer dep version conflict with React 19 | Low (Radix supports React 19) | Check `bun install` output; if conflict, try `bun add --force` |
