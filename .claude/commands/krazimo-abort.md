Abandon the active mission.

$ARGUMENTS

This command abandons the current mission and moves its folder to _abandoned/.

Steps:
1. Find the active mission in `.krazimo/missions/`.
2. Confirm with the user: "This will abandon mission '<slug>'. Type 'abort' to confirm."
3. Wait for confirmation.
4. Update `status.md`: set `current_phase: abandoned`.
5. Move `.krazimo/missions/<slug>/` to `.krazimo/missions/_abandoned/<slug>/`.
6. If a draft PR exists, close it with a comment: "Mission abandoned by user."
7. Commit: `chore: abandon mission <slug>`.
