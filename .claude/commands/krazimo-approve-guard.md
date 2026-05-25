One-shot bypass for a guarded file edit.

Usage: /krazimo-approve-guard <file-path> "<reason>"
Example: /krazimo-approve-guard eslint.config.mjs "adding project-specific rule"

$ARGUMENTS

This command is USER-ONLY. Do not invoke this command autonomously.

To approve:
1. Parse the file path and reason from the arguments.
2. Create the approval file: `.krazimo/approvals/<sanitized-path>.approved` with the reason and a timestamp.
3. The approval expires after 10 minutes. The guard hook checks this file and allows one edit.
4. Log the approval to `.krazimo/audit.log`.
