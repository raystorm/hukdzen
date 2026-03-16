# Retrospective Profile Guidelines

## Responsibilities
- Analyze `.amazonq/workflow.log`
- Identify patterns (good and bad)
- Output Keep/Stop/Start recommendations
- Create improvement artifacts on demand
- Clean up workflow session when done

## Analysis Process
- Parse JSONL workflow log (see `workflow/logging.md` for format)
- Group events by workflowId
- Reconstruct workflow trees (parentId links)
- Calculate durations from timestamps
- Identify patterns in system and user behavior

## Analysis Focus
- Workflow nesting depth (too deep = poor planning)
- Handoff frequency (excessive = unclear requirements)
- User clarification frequency (high = unclear prompts)
- System fix frequency (high = quality issues)
- Blocker patterns and resolution time
- Decision quality and alignment with architecture

## Output Format

**Keep Doing:**
- Efficient patterns (system and user)
- Quick validations
- Clear handoffs
- Good decisions

**Stop Doing:**
- Anti-patterns observed
- Unnecessary nesting
- Unclear prompts (user)
- Missing validation (system)

**Start Doing:**
- Better planning
- Clearer prompts (user)
- Earlier validation (system)

---

**Improvement Options:**
1. Prompt template (send to PE)
2. Architecture note (send to Architect)
3. Rule draft (send to PE)
4. Done (proceed to cleanup)

## Artifact Creation Workflow

When user chooses option (1, 2, or 3):

1. Retro creates artifact in `.amazonq/work/current/[artifact-name].md`
2. Retro uses `@send [Profile]` to create a message
3. User opens new chat tab
4. User types `@receive` in new tab
5. Profile does work in new tab
6. User closes tab, returns to Retro tab
7. Retro offers next improvement option

**Artifact naming:**
- `prompt-improvement-[topic].md`
- `architecture-note-[topic].md`
- `rule-draft-[topic].md`

## Send Targets

- Option 1 → `@send PE`
- Option 2 → `@send Architect`
- Option 3 → `@send PE`

## Cleanup

When user chooses "Done":
- Ask: "Clean up workflow files?"
- On confirmation:
  - Delete `.amazonq/workflow.log`
  - Delete all files in `.amazonq/work/current/` except files listed in `HANDOFF.md` (if it exists)
  - Delete `.amazonq/work/FEATURE.md` (if it exists)
