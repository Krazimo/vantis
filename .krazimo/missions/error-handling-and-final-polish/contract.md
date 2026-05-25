# Mission: error-handling-and-final-polish

## Goal
Bring every `catch` block in Vantis into compliance with Krazimo's error-handling rules (`CLAUDE.md` → "NEVER silently catch errors. Every catch block must either re-throw or log the FULL error..."). Replace user-facing `alert()` calls with toast notifications using shadcn primitives. Re-run all CI gates to confirm vantis is fully standards-compliant.

## Why
- Five `catch { /* ignore */ }` blocks currently swallow errors silently — a direct violation of Krazimo's "Errors should be LOUD" principle.
- `alert()` for missing assets is poor UX and not how a production React app surfaces errors.
- This is the **final mission** for "Make vantis next-standard-level." After merge, vantis should be fully aligned with Krazimo Next.js standards across: package manager (bun), Next/React versions (latest), src/ layout, shadcn primitives, test infrastructure, file-size compliance, error handling, and lint cleanliness.

## Context
- Stack post-Mission 6: Next 16, React 19, bun, shadcn primitives, vitest infra, all files ≤150 lines
- shadcn already includes `sonner` (or can add it) — install if not present to replace `alert()`
- All 5 silent catches are around `localStorage` reads/writes (browser private-mode / quota failures) and one PDF blob conversion
- No use of `any` type detected
- `bun lint` already passes — this mission must keep it passing, not introduce new violations

## Violations to fix

### Silent catch blocks (5 sites)
```
src/app/govern/layout.tsx:21       try { localStorage.getItem(...) } catch { /* ignore */ }
src/app/govern/layout.tsx:28       try { localStorage.setItem(...) } catch { /* ignore */ }
src/app/govern/settings/page.tsx:26 try { localStorage.getItem(...) } catch { /* ignore */ }
src/app/govern/settings/page.tsx:32 try { localStorage.setItem(...) } catch { /* ignore */ }
src/lib/divya-villas-pdfs.ts:44    catch(e) { alert("Error: " + e) }   // wrong: alerts but never logs the error object
```

### `alert()` calls (3 sites)
```
src/lib/divya-villas-images.ts:23  alert("Image not found: " + key)
src/lib/divya-villas-pdfs.ts:26    alert("Document not found: " + key)
src/lib/divya-villas-pdfs.ts:45    alert("Error: " + e)
```

## Contract

1. Every `catch` block under `src/` either:
   - Re-throws (`throw error`), OR
   - Calls `console.error('<context>:', error)` where `error` is the typed catch variable AND the message includes the call site context, OR
   - Both
2. **No empty catch blocks** (`catch {}`, `catch { /* ignore */ }`, `catch (e) {}`) remain anywhere under `src/`.
3. For the `localStorage` catches in `src/app/govern/layout.tsx` and `src/app/govern/settings/page.tsx`: each becomes `} catch (error) { console.warn('vantis_officer localStorage unavailable:', error) }` (or similar context-specific message). `console.warn` is acceptable here because localStorage failures are non-critical (private browsing / quota); the error must still be visible in dev tools.
4. For `src/lib/divya-villas-pdfs.ts:44`: the catch block becomes `} catch (error) { console.error('PDF download failed:', error); toast.error('Failed to download document.') }` — both logs the full error AND surfaces a user-friendly toast.
5. `alert()` is removed from `src/lib/divya-villas-images.ts` and `src/lib/divya-villas-pdfs.ts`. Each is replaced with a `toast.error(...)` call (using `sonner`, the shadcn-recommended toast library) OR `console.error` if the call site is not user-triggered. Use `toast.error` for user-triggered actions like "document not found on click"; `console.error` for truly background paths.
6. `sonner` is installed as a dependency if not already present. The `<Toaster />` from sonner is mounted in `src/app/layout.tsx` (the root layout) so toasts work app-wide.
7. **No new files over 150 lines** are created. If the root layout grows over 150 lines after adding the Toaster, extract a `<Providers />` component to wrap it.
8. No `any` types introduced (typed catch variables: `catch (error)` where `error` defaults to `unknown` in strict mode — type-narrow before use).
9. `bunx tsc --noEmit` passes.
10. `bun lint` passes (zero warnings, zero errors).
11. `bun run build` succeeds.
12. `bun test` passes.
13. Diff scope: only `src/lib/divya-villas-*.ts`, `src/app/govern/layout.tsx`, `src/app/govern/settings/page.tsx`, `src/app/layout.tsx`, `package.json`, `bun.lock`, and one new file for `<Providers />` if needed. No other files modified.

## Out of scope

- Refactoring `divya-villas-images.ts` or `divya-villas-pdfs.ts` beyond the `alert()` and catch fixes (those files contain large base64 blobs — leave them alone otherwise)
- Replacing existing Vantis custom UI components with shadcn primitives (separate per-surface missions)
- Adding error-handling tests
- Migrating any other UI to use toast notifications proactively (only the cases that currently call `alert()`)
- Wiring up Sentry or any external error-monitoring service
- Audit of `console.log` / `console.warn` removal — those aren't violations; only silent catches and `alert()` are
- Modifying the data files in `_data/` directories

## Verify by

```bash
# 1-2. No silent catches anywhere in src/
SILENT=$(grep -rEn 'catch\s*(\([^)]*\))?\s*\{\s*(/\*[^*]*\*/)?\s*\}' src/ 2>/dev/null || true)
if [ -n "$SILENT" ]; then echo "silent catches remain:"; echo "$SILENT"; exit 1; fi

# 3-4. Every catch in src/ either re-throws or calls console.error/warn
# (manual review — grep for catch blocks and confirm)
grep -rEn '} catch' src/ 2>/dev/null

# 5. No alert() calls in src/
ALERTS=$(grep -rn 'alert(' src/ --include='*.ts' --include='*.tsx' 2>/dev/null || true)
if [ -n "$ALERTS" ]; then echo "alert() still present:"; echo "$ALERTS"; exit 1; fi

# 6. sonner installed and Toaster mounted
node -e "const p=require('./package.json'); if (!({...p.dependencies,...p.devDependencies}).sonner) { console.error('sonner not installed'); process.exit(1); }"
grep -q "Toaster" src/app/layout.tsx || grep -rq "Toaster" src/app/ 2>/dev/null

# 7. No new files over 150 lines
OVER=$(find src/app src/components -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/components/ui/*" -exec wc -l {} + 2>/dev/null \
  | awk '$1 > 150 && $2 != "total" {print}')
if [ -n "$OVER" ]; then echo "files over 150 lines:"; echo "$OVER"; exit 1; fi

# 8. No `any` type
ANY=$(grep -rEn ':\s*any[^a-zA-Z_]|<any>' src/ --include='*.ts' --include='*.tsx' 2>/dev/null || true)
if [ -n "$ANY" ]; then echo "any type used:"; echo "$ANY"; exit 1; fi

# 9-12. CI gates
bunx tsc --noEmit
bun lint
bun run build
bun test
```

## Notes for worker

- For TypeScript's strict mode, `catch (error)` makes `error` typed as `unknown`. When passing to `console.error`/`console.warn`, that's fine (they accept `unknown`). If you need to read `error.message`, type-narrow with `error instanceof Error ? error.message : String(error)`.
- Install sonner with `bun add sonner` (verify latest version via `bun info sonner version` first).
- The shadcn `<Toaster />` from sonner: `import { Toaster } from 'sonner'` and place it in the root layout JSX. If the root layout is a server component, the Toaster needs to be in a separate client component (`<Providers />`).
- Toast usage: `import { toast } from 'sonner'; toast.error('Document not found.')`.
- Do NOT change the semantic behavior of `localStorage` reads/writes — they currently fail silently (which is correct UX for private browsing); just add a `console.warn` so dev tools see the issue. Do not throw or block the UI on these.
- For `src/lib/divya-villas-pdfs.ts:44` (the `try { ... } catch(e) { alert(...) }` block): the try wraps PDF blob conversion + URL.createObjectURL + click. The catch should log AND toast. Don't change the try body.
- The `if (!dataUrl)` and `if (!base64Data)` early-returns are guards for missing assets (not thrown errors). Replace `alert()` with `toast.error()` and add a `console.error` so dev visibility is preserved.
- Commit the sonner install separately from the catch/alert fixes for clean history.
- `_data/` directories contain pure types/constants — no catch blocks live there, ignore them.
