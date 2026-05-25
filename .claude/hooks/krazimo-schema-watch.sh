#!/usr/bin/env bash
# krazimo-schema-watch.sh — PostToolUse hook for Edit|Write
# Auto-runs db:generate + db:migrate when db/schema.ts is edited.
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // empty')
[ -z "$FILE_PATH" ] && exit 0

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
FILE_PATH="${FILE_PATH#"$REPO_ROOT/"}"

case "$FILE_PATH" in
  db/schema.ts|db/schema.tsx|prisma/schema.prisma) ;;
  *) exit 0 ;;
esac

echo "📦 Schema changed — generating migration and applying..."

if [ -f "drizzle.config.ts" ] || [ -f "drizzle.config.mjs" ]; then
  bun run db:generate 2>&1 || echo "⚠️ db:generate failed"
  bun run db:migrate 2>&1 || echo "⚠️ db:migrate failed"
  git add db/migrations/ 2>/dev/null || true
elif [ -f "prisma/schema.prisma" ]; then
  bunx prisma migrate dev --name auto 2>&1 || echo "⚠️ prisma migrate failed"
  git add prisma/migrations/ 2>/dev/null || true
fi

echo "✅ Migration generated and staged."
exit 0
