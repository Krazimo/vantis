Run adversarial validation on the current mission.

$ARGUMENTS

Use the `Skill` tool to invoke `krazimo-next-standards:krazimo-validate`. The skill dispatches the validator subagent (defined in `.claude/agents/validator.md`) with restricted tool access — it cannot read source code or test files.
