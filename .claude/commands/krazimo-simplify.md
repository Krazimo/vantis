Run the pre-validator simplify pass on the current mission's diff.

$ARGUMENTS

Use the `Skill` tool to invoke `krazimo-next-standards:krazimo-simplify`. The skill dispatches the simplifier subagent (defined in `.claude/agents/simplifier.md`) to check and fix code smells before the validator sees the diff.
