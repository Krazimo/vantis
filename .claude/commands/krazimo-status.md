Print the current mission's status.

$ARGUMENTS

Read and display the contents of the active mission's status file:

1. Find the active mission: look for `.krazimo/missions/*/status.md` where `current_phase` is not `passed`, `failed`, or `abandoned`.
2. If found, read and display the full `status.md` file.
3. If no active mission, check `ACTIVE_MISSIONS.md` at the repo root for a cross-mission overview.
4. If neither exists, report "No active missions."
