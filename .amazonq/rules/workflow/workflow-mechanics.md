# Workflow Mechanics

## Purpose

Define workflow mechanics in one central reference:
- Standard handoffs (linear workflow progression)
- Side trips (parallel work with send/receive)
- Reviewable handoffs (prevent incomplete information)
- Standard workflow steps (expectations for all profiles)

---

## Standard Handoffs

### What Are Handoffs?

Linear workflow progression where one profile completes work and passes to the next profile.

**Pattern:**
```
Profile A completes work
  ↓
Profile A creates HANDOFF.md
  ↓
User approves handoff
  ↓
Profile B activates with @start
  ↓
Profile B reads HANDOFF.md
  ↓
Profile B continues work
```

### HANDOFF.md Location

`.amazonq/work/HANDOFF.md`

### HANDOFF.md Format

```markdown
# Handoff to [Profile]

## From
[Source Profile]

## Task
[What needs to be done]

## Context
[Background and decisions made]

## Artifacts
[Files created or modified]

## Expected Outcome
[What the receiving profile should produce]
```

### When to Use Handoffs

- Profile completes its responsibility
- Next profile needs context to continue
- Linear workflow progression
- Example: Architect → Tactician → PE → Builder → Enforcer → Documentor

### Handoff Confirmation

**CRITICAL:** User must approve handoffs before next profile activates.

**Why:**
- Catches incomplete information
- Validates handoff quality
- Prevents cascade of incomplete work

**How:**
1. Profile creates HANDOFF.md
2. Profile shows what's being passed
3. Profile requests user confirmation
4. User reviews and approves
5. Next profile activates

---

## Reviewable Handoffs

### Problem

Incomplete handoffs propagate through workflow. Example: TestDesigner passes only test scenarios to PE, but PE needs full story requirements (schema, guards, wiring).

### Solution

Make handoffs explicit and reviewable.

### Reviewable Handoff Pattern

**Profile creating handoff:**
1. Create HANDOFF.md
2. **Show summary of what's being passed:**
   - "Passing to PE: test scenarios + story requirements (schema, guards, wiring)"
3. Request user confirmation
4. Wait for approval

**User reviewing handoff:**
1. Check HANDOFF.md content
2. Verify completeness
3. Ask: "Is everything needed for next profile included?"
4. Approve or request additions

**Example:**
```
TestDesigner: "Created handoff to PE with:
- 27 test scenarios for guards
- Story requirements: schema creation, guard implementation, wiring
- Validation checklist

Should I proceed with handoff?"

User: [Reviews HANDOFF.md]
User: "Yes, proceed"
```

### What to Check in Handoffs

**From Architect to Tactician:**
- [ ] Impact analysis complete
- [ ] Change classification clear
- [ ] Phase recommendations included

**From Tactician to PE:**
- [ ] Execution strategy defined
- [ ] Profile sequence clear
- [ ] Validation checkpoints identified

**From TestDesigner to PE:**
- [ ] Test scenarios complete
- [ ] Story requirements included (not just test scenarios)
- [ ] All acceptance criteria covered

**From PE to Builder:**
- [ ] All story requirements in prompt
- [ ] Anchoring to existing patterns
- [ ] Validation checklist included
- [ ] Confirmation requirement specified

**From Builder to Enforcer:**
- [ ] All changes made
- [ ] Tests created alongside
- [ ] Validation checklist provided

**From Enforcer to Documentor:**
- [ ] Validation results
- [ ] Files modified
- [ ] Context for commit message

---

## Side Trips (Send/Receive)

### What Are Side Trips?

Parallel work where current profile needs another profile to do work in isolation, then return to original context.

**Pattern:**
```
Profile A working
  ↓
Profile A needs Profile B for side task
  ↓
Profile A creates MESSAGE.md with @send
  ↓
User opens new tab
  ↓
User types @receive in new tab
  ↓
Profile B reads MESSAGE.md
  ↓
Profile B does work in isolation
  ↓
User closes tab
  ↓
User returns to Profile A tab
  ↓
Profile A continues with results
```

### MESSAGE.md Location

`.amazonq/work/MESSAGE.md`

### MESSAGE.md Format

```markdown
# Message to [Profile]

## From
[Source Profile]

## Task
[What needs to be done]

## Context
[Background]

## Artifact Location
[Files to review]

## Expected Outcome
[What should be produced]
```

### When to Use Side Trips

- Current profile needs another profile's expertise
- Work can be done in isolation
- Non-blocking, parallel work
- Example: Retrospective creates rule draft, sends to PE for integration

### Side Trip vs Handoff

**Handoff:**
- Linear progression
- Original profile done
- Next profile continues main workflow

**Side Trip:**
- Parallel work
- Original profile paused
- Returns to original profile after

---

## Standard Workflow Steps

### Profile Activation

1. Profile receives handoff or message
2. Profile reads context (HANDOFF.md or MESSAGE.md)
3. Profile gathers additional context if needed:
   - Workflow log (for Dr/Enforcer)
   - Git diff (for Dr/Enforcer)
   - Existing patterns (for Builder)

### Work Execution

1. Profile performs its responsibility
2. Profile follows its rules and boundaries
3. Profile creates artifacts (code, docs, prompts, etc.)

### Confirmation Requirements

**Profiles requiring confirmation before file changes:**
- Builder
- Doctor
- Enforcer

**Pattern:**
1. Show what will be changed (code diffs)
2. Explain why
3. Request explicit confirmation
4. Wait for approval
5. Execute changes

See `workflow/agentic-confirmation.md` for detailed confirmation rules.

### Validation Checkpoints

**After implementation:**
- Builder hands off to Enforcer
- Enforcer validates against checklist
- Enforcer approves or escalates

**After validation:**
- Enforcer hands off to Documentor
- Documentor creates commit message

### Handoff/Completion

1. Profile completes work
2. Profile creates handoff (if continuing workflow)
3. Profile shows what's being passed
4. Profile requests user confirmation
5. User approves
6. Next profile activates

---

## Workflow Logging

All profiles that reference `workflow/logging.md` MUST log:
- Workflow start on activation
- Key events (file changes, handoffs, validations)
- Use fsWrite append to `.amazonq/workflow.log`
- Follow JSONL format

See `workflow/logging.md` for detailed logging specification.

---

## Commands Reference

### User Commands

- `@handoff` - Trigger current profile to create HANDOFF.md for linear workflow progression
- `@send [Profile]` - Trigger current profile to create MESSAGE.md for side trip work
- `@start` - Read HANDOFF.md and activate profile
- `@receive` - Read MESSAGE.md and activate profile
- `@suspend [name]` - Save workflow context for later
- `@resume [name]` - Load saved workflow context
- `@list` - Show all suspended contexts
- `@note [text]` - Log user observation to workflow log

See `workflow/user-commands.md` for detailed command documentation.

### Profile Activation

- `Act as [Profile]` - Explicit profile activation
- `As [Profile]` - Shorthand activation
- `@[Profile]` - Mention (does NOT activate)

---

## File Locations

### Workflow Files

- `.amazonq/work/HANDOFF.md` - Standard handoffs
- `.amazonq/work/MESSAGE.md` - Side trip messages
- `.amazonq/workflow.log` - Workflow event log (JSONL)

### Context Preservation

- `.amazonq/suspended/` - Suspended workflow contexts
- `.amazonq/suspended/INDEX.md` - List of suspended contexts
- `.amazonq/suspended/README.md` - Folder documentation

---

## Examples

### Example 1: Standard Handoff

```
Architect completes feature analysis
  ↓
Architect creates HANDOFF.md:
  "Handoff to Tactician with:
   - Feature breakdown (3 stories)
   - Impact analysis (cross-domain, 50+ files)
   - Phase recommendations
   Should I proceed?"
  ↓
User reviews HANDOFF.md
User: "Yes, proceed"
  ↓
User opens new tab: "As Tactician, @start"
  ↓
Tactician reads HANDOFF.md
Tactician sequences stories
```

### Example 2: Side Trip

```
Retrospective analyzing workflows
  ↓
Retrospective creates rule draft
  ↓
Retrospective: "@send PE"
  ↓
Retrospective creates MESSAGE.md:
  "Message to PE: Review and integrate rule draft"
  ↓
User opens new tab: "@receive"
  ↓
PE reads MESSAGE.md
PE integrates rule draft
PE closes tab
  ↓
User returns to Retrospective tab
Retrospective continues analysis
```

### Example 3: Reviewable Handoff Catches Issue

```
TestDesigner creates test scenarios
  ↓
TestDesigner creates HANDOFF.md:
  "Handoff to PE with:
   - 27 test scenarios for guards
   Should I proceed?"
  ↓
User reviews HANDOFF.md
User: "Wait, this is missing story requirements. PE needs schema, guards, AND wiring requirements, not just test scenarios."
  ↓
TestDesigner updates HANDOFF.md with full requirements
  ↓
User: "Yes, proceed"
  ↓
PE receives complete requirements
```

---

## Rationale

- Centralized workflow mechanics documentation
- Clear distinction between handoffs and side trips
- Reviewable handoffs prevent incomplete information
- Standard workflow steps ensure consistency
- Reduces confusion and improves workflow quality

## Impact

- All profiles follow consistent workflow patterns
- Handoffs are explicit and reviewable
- Incomplete information caught early
- Clear reference for workflow mechanics
- Reduces workflow errors and rework
