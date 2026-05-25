#!/usr/bin/env bash
# krazimo-phase-announce.sh — UserPromptSubmit hook
# Deterministic enforcement: inject phase-announcement requirement into every prompt.
# Claude cannot ignore this because the output becomes part of the prompt.
set -euo pipefail

# Detect active mission, if any
ACTIVE_MISSION=""
ACTIVE_PHASE=""
for status_file in .krazimo/missions/*/status.md; do
  [ -f "$status_file" ] || continue
  PHASE=$(grep -m1 'current_phase:' "$status_file" 2>/dev/null | sed 's/current_phase: *//')
  case "$PHASE" in
    passed|failed|abandoned) continue ;;
    *)
      ACTIVE_MISSION=$(basename "$(dirname "$status_file")")
      ACTIVE_PHASE="$PHASE"
      break ;;
  esac
done

# Compose the injected reminder
if [ -n "$ACTIVE_MISSION" ]; then
  cat <<EOF

---
[Krazimo Harness — active mission: $ACTIVE_MISSION, current phase: $ACTIVE_PHASE]

Before responding, you MUST start your response with the appropriate phase header:
- 🔵 Phase 1: Decisions
- 🟢 Phase 2: Planning
- 🟡 Phase 3: Execution
- 🟠 Phase 4: AI Review
- ✅ Phase 5: Human Review (PR ready)
- 🟦 No mission needed (trivial work — typo, comment, single-line config)

If you do not announce your phase, the user does not know what's happening and you have failed the harness contract. This is non-negotiable.
---
EOF
else
  cat <<EOF

---
[Krazimo Harness — no active mission]

If the user is asking for a non-trivial change (feature, bug fix, debug investigation, refactor, schema change, or anything touching src/, db/, or multiple files), you MUST:
1. Start your response with: "🔵 Phase 1: Decisions — [what you're investigating]"
2. Read the codebase first (never guess), reproduce the issue if it's a bug
3. Write a validation contract to .krazimo/missions/<slug>/contract.md
4. Present it for user approval

If the request is trivial (typo, comment, single-line config) or conversational (a question, an explanation request), start with: "🟦 No mission needed — [brief reason]"

Do NOT silently start working. The user must see your phase announcement.
---
EOF
fi

exit 0
