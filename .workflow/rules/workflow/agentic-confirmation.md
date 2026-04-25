# Agentic Changes Confirmation

## CRITICAL: Zero-Tolerance Confirmation Policy

**ALL profiles MUST request confirmation before modifying ANY persistent workflow artifact.**

See foundation/terms.md for Workflow Artifact definition.

**No exceptions. No "small safe fixes" exemption. No "just rules" exemption.**

**Applies to:**
- Doctor (even "small safe" fixes)
- Enforcer (including rule updates)
- Builder (all code changes)
- PromptEngineer (all rule/prompt changes)
- Documentor (all documentation changes)
- ALL profiles that modify persistent workflow artifacts

## Change Approval Process
- Before making any agentic modifications to any workflow artifact, show what will be changed
- Use code diffs to clearly display proposed modifications
- Ask for explicit confirmation before modifying any workflow artifacts
- Wait for user approval before proceeding with any modifications

## Confirmation Sequence (MANDATORY)

The confirmation sequence MUST follow this exact order:

1. **Diagnose** - Identify the issue and root cause
2. **Propose** - Show the specific code changes with diffs
3. **Ask** - Request explicit confirmation
4. **Wait** - Wait for approval
5. **Execute** - Make the changes

**CRITICAL:** Never ask for confirmation before showing the proposed changes.
Asking "Should I proceed?" without showing what you'll do is a blanket approval trap.

**Approval validity:** Approval is only valid when a diff is visible.
Approval given before a diff MUST be ignored.

### Persistent Workflow Artifacts Require Confirmation

This applies to ALL types of modifications to persistent workflow artifacts, including but not limited to:
- Code modifications (adding, changing, or removing code)
- Test framework conversions (Jest → Vitest, etc.)
- File transformations (ES modules → CommonJS, etc.)
- Refactoring operations (renaming, restructuring)
- Configuration changes (package.json, tsconfig.json, etc.)
- Doctor's "small safe" fixes (even single-line changes)

### Exempt Files (No Confirmation Required)

Transient, temporary, and working files do NOT require confirmation:
- `.amazonq/work/` (all files, including HANDOFF.md, MESSAGE.md, etc.)
- `.amazonq/suspended/` (all files, including INDEX.md, context files)
- `.amazonq/workflow.log`
- Auto-suspend files (auto-*.md, auto-*.tmp)
- Any temporary or working context files

**Rule:** Persistent workflow artifacts require confirmation. Transient workflow artifacts do not.

## What Counts as Explicit Confirmation
- "Yes", "Yes, proceed", "Go ahead", "Do it", "Make the changes"
- "Approved", "LGTM", "Looks good"
- "Proceed", "Continue", "Apply changes"

## What Does NOT Count as Confirmation
- Clarifying questions or acknowledging understanding ("good call", "that makes sense")
- Choosing between options ("stick with option 1")
- Asking follow-up questions
- General agreement with approach without explicit approval to execute

## Confirmation Scope

**Confirmation does not persist across steps or operations.**

- Each file modification requires fresh confirmation
- Each distinct operation requires fresh confirmation
- Approval for Step 1 does NOT imply approval for Step 2
- Approval in previous message does NOT carry forward to current message

## Examples of Persistent Workflow Artifacts
- All source code files (.ts, .tsx, .js, .jsx, etc.)
- Configuration files (package.json, tsconfig.json, etc.)
- Application settings and environment files
- Build and deployment configuration files
- Documentation files (README.md, docs/, etc.)
- Rule files (.workflow/rules/)
- Prompt files (.amazonq/prompts/)
- Test files and fixtures

## Operations Requiring Confirmation

The following operations on persistent workflow artifacts require confirmation:

**Code Changes:**
- Adding new code
- Modifying existing code
- Removing code
- Refactoring

**Conversions:**
- Test framework conversions (Jest → Vitest)
- Module system conversions (ESM ↔ CommonJS)
- Language conversions (JS → TS)

**Transformations:**
- File renames
- Structure changes
- Format changes

**Configuration:**
- package.json updates
- Config file changes (tsconfig.json, jest.config.js, vitest.config.ts)
- Build configuration

**Fixes:**
- Bug fixes (including Doctor's "small safe" fixes)
- Typo corrections
- Import fixes

**Rule Updates:**
- Rule file modifications (.workflow/rules/)
- Prompt file modifications (.amazonq/prompts/)
- Profile guideline changes
- Workflow mechanic changes

## Confirmation Format
- Show file path and purpose of changes
- Display code diff with clear before/after comparison
- Ask: "Should I proceed with these changes?"
- Only execute changes after receiving explicit user approval