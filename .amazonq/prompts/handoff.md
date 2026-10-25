## Guard

If `{{to}}` is empty, unresolved, or literal "{{to}}":
- Ask user: "Which profile should receive this handoff?"
- Wait for response before proceeding.

## Execution

Generate handoff content for {{to}}.
Follow the canonical shape defined in
`.workflow/rules/workflow/changeover-format.md`.

- Write HANDOFF.md to `.amazonq/work/current/HANDOFF.md` immediately
- Write any additional supporting files to `.amazonq/work/current/` directory only
- Clean `.amazonq/work/current/` per Change invariant
  (remove stale files, keep HANDOFF.md and listed artifacts)
- Display: "---\n**Next**: Open a new tab and run `@start` to continue as [Profile Name from the To field]"

Do NOT switch profiles.
Do NOT start the next profile.
Do NOT run @start.
Do NOT infer any next action, after displaying the user message.

Do not auto-activate next profile. Stay as current profile. User will run `@start`.

---

## Error Handling

**Profile not found:**
- List available profiles from _PROFILES.md
- Suggest correct spelling or alias

**File not found:**
- Report missing file path
- Continue with available files
- Warn user about incomplete rule set
