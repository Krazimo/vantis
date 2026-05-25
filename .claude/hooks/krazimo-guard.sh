#!/usr/bin/env bash
# krazimo-guard.sh — PreToolUse fallback for Edit|Write|NotebookEdit
# Mirrors the hard-deny patterns from .claude/settings.json permissions.deny.
# Belt-not-suspenders: covers known Claude Code bugs where subagent
# permissions are bypassed (anthropics/claude-code#25000).
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // empty')
[ -z "$FILE_PATH" ] && exit 0

# Normalize to repo-relative path
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
FILE_PATH="${FILE_PATH#"$REPO_ROOT/"}"

# Hard-deny patterns (immutable after commit — no legitimate edit workflow)
case "$FILE_PATH" in
  db/migrations/*)
    echo '{"decision":"block","reason":"Committed migrations are immutable (Rule 4g). Write a NEW migration to fix forward."}'
    exit 0 ;;
  .krazimo/missions/*/validator-*.md)
    echo '{"decision":"block","reason":"Validator reports are immutable. Only the validator subagent writes these."}'
    exit 0 ;;
esac

exit 0
