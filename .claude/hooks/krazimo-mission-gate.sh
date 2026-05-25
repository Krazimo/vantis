#!/usr/bin/env bash
# krazimo-mission-gate.sh — PreToolUse hook for Edit|Write|NotebookEdit
# Enforces: active missions require a worktree, not the primary checkout.
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // empty')
[ -z "$FILE_PATH" ] && exit 0

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
FILE_PATH="${FILE_PATH#"$REPO_ROOT/"}"

# Only gate src/ edits (non-src files like .krazimo/ are allowed anywhere)
case "$FILE_PATH" in
  src/*|db/*|public/*) ;;
  *) exit 0 ;;
esac

# Check if any active mission exists
ACTIVE_MISSION=""
for status_file in .krazimo/missions/*/status.md; do
  [ -f "$status_file" ] || continue
  PHASE=$(grep -m1 'current_phase:' "$status_file" 2>/dev/null | sed 's/current_phase: *//')
  case "$PHASE" in
    passed|failed|abandoned) continue ;;
    *) ACTIVE_MISSION=$(basename "$(dirname "$status_file")"); break ;;
  esac
done

# No active mission → allow freely
[ -z "$ACTIVE_MISSION" ] && exit 0

# Active mission exists — check we're in a worktree, not primary checkout
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)

if [ "$GIT_DIR" = "$GIT_COMMON" ]; then
  echo "{\"decision\":\"block\",\"reason\":\"Active mission '$ACTIVE_MISSION' detected. Edit code in a worktree, not the primary checkout. Run /krazimo-open-mission to set up.\"}"
  exit 0
fi

exit 0
