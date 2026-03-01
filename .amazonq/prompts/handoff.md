Write handoff for {{next}} to `.amazonq/work/HANDOFF.md`.

Include:
- From: [your current profile]
- To: {{next}}
- Task: [one-line description]
- Files: [list]
- Context: [what was done]
- Action: [what next profile should do]

Any additional files needed should be created in `.amazonq/work/` directory only.

After writing handoff, display the contents of HANDOFF.md and any supporting files created in `.amazonq/work/` for user review.

Ask user to confirm handoff is correct.

If approved, remove all old files from `.amazonq/work/` except:
- HANDOFF.md
- README.md
- Files listed in the current handoff

Do not change your current profile. Stay as the profile you are.
