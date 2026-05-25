#!/usr/bin/env bash
# krazimo-touch-tracker.sh — PostToolUse hook for Edit|Write|NotebookEdit
# Logs touched files to .krazimo/missions/<active>/touched-files.log
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // empty')
[ -z "$FILE_PATH" ] && exit 0

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
FILE_PATH="${FILE_PATH#"$REPO_ROOT/"}"

# Find active mission
for status_file in .krazimo/missions/*/status.md; do
  [ -f "$status_file" ] || continue
  PHASE=$(grep -m1 'current_phase:' "$status_file" 2>/dev/null | sed 's/current_phase: *//')
  case "$PHASE" in
    passed|failed|abandoned) continue ;;
    *)
      MISSION_DIR=$(dirname "$status_file")
      echo "$(date -u +%Y-%m-%dT%H:%M:%SZ)	$FILE_PATH" >> "$MISSION_DIR/touched-files.log"
      exit 0 ;;
  esac
done

exit 0
