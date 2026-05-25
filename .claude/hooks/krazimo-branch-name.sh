#!/usr/bin/env bash
# krazimo-branch-name.sh — PreToolUse hook for Bash
# Validates branch names match: ^(feat|fix|refactor|chore|docs|test|perf|release|hotfix)/[a-z0-9-]+$
set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$CMD" ] && exit 0

BRANCH_REGEX='^(feat|fix|refactor|chore|docs|test|perf|release|hotfix)/[a-z0-9-]+$'
BRANCH=""

# Extract branch name from git checkout -b or git worktree add
if [[ "$CMD" =~ git[[:space:]]+checkout[[:space:]]+-b[[:space:]]+([^[:space:]]+) ]]; then
  BRANCH="${BASH_REMATCH[1]}"
elif [[ "$CMD" =~ git[[:space:]]+worktree[[:space:]]+add[[:space:]]+[^[:space:]]+[[:space:]]+-b[[:space:]]+([^[:space:]]+) ]]; then
  BRANCH="${BASH_REMATCH[1]}"
fi

[ -z "$BRANCH" ] && exit 0

# Skip validation for worktree- prefixed branches (created by Claude Code harness)
[[ "$BRANCH" == worktree-* ]] && exit 0

if ! [[ "$BRANCH" =~ $BRANCH_REGEX ]]; then
  echo "{\"decision\":\"block\",\"reason\":\"Branch name '$BRANCH' doesn't match pattern: type/slug (e.g. feat/add-login, fix/auth-bug). Valid types: feat, fix, refactor, chore, docs, test, perf, release, hotfix.\"}"
  exit 0
fi

exit 0
