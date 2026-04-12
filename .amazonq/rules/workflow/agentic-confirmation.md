# Agentic Changes Confirmation

## Change Approval Process
- Before making any agentic modifications to any workflow artifact, show what will be changed
- Use code diffs to clearly display proposed modifications
- Ask for explicit confirmation before modifying any workflow artifacts
- Wait for user approval before proceeding with any modifications

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

## Examples of Persistent Workflow Artifacts
- All source code files (.ts, .tsx, .js, .jsx, etc.)
- Configuration files (package.json, tsconfig.json, etc.)
- Application settings and environment files
- Build and deployment configuration files
- Documentation files (README.md, docs/, etc.)
- Rule files (.amazonq/rules/)
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
- Rule file modifications (.amazonq/rules/)
- Prompt file modifications (.amazonq/prompts/)
- Profile guideline changes
- Workflow mechanic changes

## Confirmation Format
- Show file path and purpose of changes
- Display code diff with clear before/after comparison
- Ask: "Should I proceed with these changes?"
- Only execute changes after receiving explicit user approval