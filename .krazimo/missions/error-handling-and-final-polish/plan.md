# Implementation Plan: error-handling-and-final-polish

## Objective
Fix 5 silent catch blocks and 3 `alert()` calls across `src/`. Install sonner and mount
`<Toaster />` app-wide. Leave all other code untouched.

## Scope (files touched)
```
package.json               ← sonner dependency
bun.lock                   ← updated by bun add
src/app/providers.tsx      ← NEW: client component that renders <Toaster />
src/app/layout.tsx         ← import + mount <Providers />
src/app/govern/layout.tsx  ← fix 2 silent catches
src/app/govern/settings/page.tsx ← fix 2 silent catches
src/lib/divya-villas-pdfs.ts    ← add import, fix alert() + catch
src/lib/divya-villas-images.ts  ← add import, fix alert()
```
No other files modified.

---

## Step 1 — Install sonner

```bash
bun info sonner version   # confirm 2.0.7 (or whatever latest is at build time)
bun add sonner@latest
```

This updates `package.json` (`"sonner": "^2.x.x"`) and `bun.lock`.

**Verify:**
```bash
node -e "const p=require('./package.json'); const v=({...p.dependencies,...p.devDependencies}).sonner; if(!v){process.exit(1)}; console.log('sonner',v)"
```

**Commit:**
```
chore: install sonner@latest for toast notifications
```
Files: `package.json`, `bun.lock` only.

---

## Step 2 — Create `<Providers />` and mount `<Toaster />`

### 2a. Create `src/app/providers.tsx` (new file, ~10 lines)

```tsx
'use client'

import { Toaster } from 'sonner'

export default function Providers() {
  return <Toaster />
}
```

This file is a client component so it can render the Toaster. Root layout is a server
component and cannot directly render client-only interactive components.

Line count: ~8 lines — well under 150.

### 2b. Edit `src/app/layout.tsx`

**Current (line 3):**
```tsx
import VantisIntelligence from '@/components/shared/VantisIntelligence'
```

**New (add one import after line 3):**
```tsx
import VantisIntelligence from '@/components/shared/VantisIntelligence'
import Providers from './providers'
```

**Current body JSX (lines 34-38):**
```tsx
      <body className="bg-background text-off-white font-sans antialiased">
        {children}
        <VantisIntelligence />
      </body>
```

**New body JSX:**
```tsx
      <body className="bg-background text-off-white font-sans antialiased">
        {children}
        <VantisIntelligence />
        <Providers />
      </body>
```

After changes, `src/app/layout.tsx` will be ~43 lines — under 150.

**Verify:**
```bash
grep -q "Toaster\|Providers" src/app/layout.tsx src/app/providers.tsx
```

**Commit:**
```
feat(layout): mount sonner Toaster via Providers client component
```
Files: `src/app/providers.tsx`, `src/app/layout.tsx`.

---

## Step 3 — Fix silent `localStorage` catches in Govern layout

### File: `src/app/govern/layout.tsx`

**Violation 1 (line 21):** The try block reads `localStorage` for officer session and demo
mode on mount. Private browsing / iOS Safari can throw on localStorage access.

Old:
```tsx
    } catch { /* ignore */ }
```

New:
```tsx
    } catch (error) { console.warn('vantis localStorage read unavailable:', error) }
```

**Violation 2 (line 28):** Inside the keyboard shortcut handler, the try writes demo mode
to localStorage.

Old (inside the `setDemoMode` callback):
```tsx
          try { localStorage.setItem('vantis_demo_mode', String(next)) } catch { /* ignore */ }
```

New:
```tsx
          try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode localStorage write unavailable:', error) }
```

Use the Edit tool with the exact old_string for each replacement. The file is 95 lines —
safe to read in full before editing.

After edits: 95 lines → 95 lines (replacements, no additions). Still under 150.

---

## Step 4 — Fix silent `localStorage` catches in Settings page

### File: `src/app/govern/settings/page.tsx`

**Violation 3 (line 26):** The try block in `useEffect` reads both localStorage keys.

Old:
```tsx
    } catch { /* ignore */ }
```

New:
```tsx
    } catch (error) { console.warn('vantis localStorage read unavailable:', error) }
```

**Violation 4 (line 32):** `toggleDemoMode` function writes demo mode to localStorage.

Old:
```tsx
    try { localStorage.setItem('vantis_demo_mode', String(next)) } catch { /* ignore */ }
```

New:
```tsx
    try { localStorage.setItem('vantis_demo_mode', String(next)) } catch (error) { console.warn('vantis_demo_mode localStorage write unavailable:', error) }
```

The file is 90 lines — safe to read in full before editing. Use the Edit tool with exact
old_string for each replacement.

**Commit (steps 3+4 together):**
```
fix(govern): replace silent localStorage catches with console.warn
```
Files: `src/app/govern/layout.tsx`, `src/app/govern/settings/page.tsx`.

---

## Step 5 — Fix `alert()` calls and catch in `divya-villas-pdfs.ts`

> **WARNING:** This file is ~512 KB and cannot be read in full. Use Bash `sed` for all
> edits. Do NOT use the Edit tool (it requires reading the full file first).

The function body starts at line 24 (`export function openPDF`). Lines 1–2 are:
```
// @ts-nocheck
// Divya Villas PDFs — base64 encoded from real PDF files
```

### 5a. Add import for toast (line 3, before the export const)

```bash
sed -i '' '2a\\
import { toast } from '"'"'sonner'"'"'
' src/lib/divya-villas-pdfs.ts
```

This inserts `import { toast } from 'sonner'` as the new line 3, shifting all subsequent
lines down by 1.

### 5b. Fix the "Document not found" alert (was line 26, now line 27 after import insert)

Exact old string (use grep to confirm):
```
  if (!base64Data) { alert("Document not found: " + key); return }
```

Replace with:
```
  if (!base64Data) { console.error('openPDF: document not found:', key); toast.error('Document not found.'); return }
```

Bash sed command:
```bash
sed -i '' 's/if (!base64Data) { alert("Document not found: " + key); return }/if (!base64Data) { console.error('\''openPDF: document not found:'\'', key); toast.error('\''Document not found.'\''); return }/g' src/lib/divya-villas-pdfs.ts
```

### 5c. Fix the catch block (was lines 44–45, now lines 45–46 after import insert)

Exact old text:
```
  } catch(e) {
    alert("Error: " + e)
```

Replace with:
```
  } catch (error) {
    console.error('PDF download failed:', error); toast.error('Failed to download document.')
```

Bash sed commands (two separate replacements to keep them clean):
```bash
sed -i '' 's/} catch(e) {/} catch (error) {/g' src/lib/divya-villas-pdfs.ts
sed -i '' 's/    alert("Error: " + e)/    console.error('\''PDF download failed:'\'', error); toast.error('\''Failed to download document.'\'')/g' src/lib/divya-villas-pdfs.ts
```

**Verify:**
```bash
grep -n 'alert\|catch' src/lib/divya-villas-pdfs.ts
# Must show: no alert(), catch block uses 'error', lines reference console.error and toast.error
```

---

## Step 6 — Fix `alert()` call in `divya-villas-images.ts`

> **WARNING:** This file is ~5.1 MB and cannot be read in full. Use Bash `sed` for all
> edits.

Lines 1–2:
```
// @ts-nocheck
// Divya Villas images — base64 encoded from real files
```

### 6a. Add import for toast (after line 2)

```bash
sed -i '' '2a\\
import { toast } from '"'"'sonner'"'"'
' src/lib/divya-villas-images.ts
```

### 6b. Fix the "Image not found" alert (was line 23, now line 24 after import insert)

Exact old string:
```
  if (!dataUrl) { alert("Image not found: " + key); return }
```

Replace with:
```
  if (!dataUrl) { console.error('openImage: image not found:', key); toast.error('Image not found.'); return }
```

Bash sed command:
```bash
sed -i '' 's/if (!dataUrl) { alert("Image not found: " + key); return }/if (!dataUrl) { console.error('\''openImage: image not found:'\'', key); toast.error('\''Image not found.'\''); return }/g' src/lib/divya-villas-images.ts
```

**Verify:**
```bash
grep -n 'alert\|catch' src/lib/divya-villas-images.ts
# Must show: no alert() remaining
```

**Commit (steps 5+6 together):**
```
fix(lib): replace alert() with toast.error and log errors in pdf/image helpers
```
Files: `src/lib/divya-villas-pdfs.ts`, `src/lib/divya-villas-images.ts`.

---

## Step 7 — Run all CI gates

Run in this exact order to catch failures early:

```bash
# TypeScript check
bunx tsc --noEmit

# Lint
bun lint

# Build (includes static export)
bun run build

# Unit tests
bun test
```

All four must exit 0. Fix any failures before committing the final state.

---

## Step 8 — Run contract verification script

```bash
# 1-2. No silent catches
SILENT=$(grep -rEn 'catch\s*(\([^)]*\))?\s*\{\s*(/\*[^*]*\*/)?\s*\}' src/ 2>/dev/null || true)
if [ -n "$SILENT" ]; then echo "silent catches remain:"; echo "$SILENT"; exit 1; fi
echo "✓ No silent catches"

# 5. No alert() calls
ALERTS=$(grep -rn 'alert(' src/ --include='*.ts' --include='*.tsx' 2>/dev/null || true)
if [ -n "$ALERTS" ]; then echo "alert() still present:"; echo "$ALERTS"; exit 1; fi
echo "✓ No alert() calls"

# 6. sonner installed and Toaster mounted
node -e "const p=require('./package.json'); if (!({...p.dependencies,...p.devDependencies}).sonner) { console.error('sonner not installed'); process.exit(1); }"
grep -q "Toaster\|Providers" src/app/layout.tsx
echo "✓ Toaster wired"

# 7. No files over 150 lines (excluding ui/ components and large data libs)
OVER=$(find src/app src/components -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -exec wc -l {} + 2>/dev/null \
  | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "files over 150 lines:"; echo "$OVER"; exit 1; fi
echo "✓ No files over 150 lines"

# 8. No any type
ANY=$(grep -rEn ':\s*any[^a-zA-Z_]|<any>' src/ --include='*.ts' --include='*.tsx' 2>/dev/null || true)
if [ -n "$ANY" ]; then echo "any type used:"; echo "$ANY"; exit 1; fi
echo "✓ No any types"
```

---

## Commit sequence summary

| # | Message | Files |
|---|---------|-------|
| 1 | `chore: install sonner@latest for toast notifications` | `package.json`, `bun.lock` |
| 2 | `feat(layout): mount sonner Toaster via Providers client component` | `src/app/providers.tsx` (new), `src/app/layout.tsx` |
| 3 | `fix(govern): replace silent localStorage catches with console.warn` | `src/app/govern/layout.tsx`, `src/app/govern/settings/page.tsx` |
| 4 | `fix(lib): replace alert() with toast.error and log errors in pdf/image helpers` | `src/lib/divya-villas-pdfs.ts`, `src/lib/divya-villas-images.ts` |

After commit 4, run step 7 (CI gates) and step 8 (contract verification) before pushing.

---

## Architectural decisions

### Why `console.warn` for localStorage, not `console.error`
localStorage failures in private browsing or under storage quota are non-critical — the
app degrades gracefully (officer session just won't persist). `console.warn` signals
"something is off, worth knowing" without implying a bug. `console.error` is reserved for
actual errors that break functionality.

### Why `console.error` + `toast.error` for the PDF catch
The catch block wraps `atob()` + `URL.createObjectURL()` + DOM manipulation. Failure here
means the user clicked a document link and nothing opened — that IS broken functionality,
not a graceful degradation. Both signals are needed: `console.error` for developer
visibility in devtools and server logs, `toast.error` for user feedback.

### Why not throw in the localStorage catches
The localStorage reads/writes are fire-and-forget (reading cached session, persisting a
toggle). Throwing would crash the component tree. Logging and continuing is correct.

### Why `<Providers />` as a separate file
`src/app/layout.tsx` is a Next.js server component (no `'use client'`). sonner's `<Toaster />`
is interactive and requires client-side JavaScript. Mixing them in the same file would
require adding `'use client'` to the root layout, which is bad practice (forces the entire
layout to be client-side). A thin `providers.tsx` keeps the server/client boundary clean.

### Why sed for the large lib files
`divya-villas-pdfs.ts` and `divya-villas-images.ts` contain megabytes of base64 data. The
Edit tool requires reading the file first, which fails at this size. The `sed` approach
uses exact string matching on the 3 target lines without loading the rest of the file into
context. All replacement strings are confirmed unique via grep.
