#!/usr/bin/env bash
# krazimo-integrity-warn.sh — SessionStart hook
# Compares hook file hashes against manifest. Warning only (not blocking).
set -euo pipefail

MANIFEST=".claude/hooks/manifest.sha256"
[ -f "$MANIFEST" ] || exit 0

MISMATCHES=""
while IFS='  ' read -r expected_hash file_path; do
  [ -f "$file_path" ] || { MISMATCHES="$MISMATCHES\n  MISSING: $file_path"; continue; }
  actual_hash=$(shasum -a 256 "$file_path" | cut -d' ' -f1)
  if [ "$actual_hash" != "$expected_hash" ]; then
    MISMATCHES="$MISMATCHES\n  MODIFIED: $file_path"
  fi
done < "$MANIFEST"

if [ -n "$MISMATCHES" ]; then
  echo "⚠️ Krazimo hook integrity warning — files differ from manifest:$MISMATCHES"
  echo "This may indicate hook tampering. Server-side CI will block if hooks are modified."
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) INTEGRITY_WARN: $MISMATCHES" >> .krazimo/audit.log 2>/dev/null || true
fi

exit 0
