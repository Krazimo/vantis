#!/usr/bin/env bash
# krazimo-role-shield.sh — PreToolUse hook for Bash
# Fallback enforcement for subagent role restrictions.
# Covers known Claude Code bugs where subagent permissions are bypassed.
set -euo pipefail

ROLE="${KRAZIMO_ROLE:-}"
[ -z "$ROLE" ] && exit 0

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$CMD" ] && exit 0

# Validator: must not read source code via shell commands
if [ "$ROLE" = "validator" ]; then
  case "$CMD" in
    *cat\ src/*|*head\ src/*|*tail\ src/*|*less\ src/*)
      echo '{"decision":"block","reason":"Validator cannot read source files. Verify via running app, not source inspection."}'
      exit 0 ;;
    *grep\ *src/*|*find\ src*)
      echo '{"decision":"block","reason":"Validator cannot search source files. Use contract assertions and the running app."}'
      exit 0 ;;
  esac
fi

# Orchestrator: must not run dependency-modifying commands
if [ "$ROLE" = "orchestrator" ]; then
  case "$CMD" in
    *bun\ add*|*bun\ remove*|*npm\ install*|*npm\ uninstall*)
      echo '{"decision":"block","reason":"Orchestrator cannot modify dependencies. Dispatch a worker for implementation."}'
      exit 0 ;;
  esac
fi

exit 0
