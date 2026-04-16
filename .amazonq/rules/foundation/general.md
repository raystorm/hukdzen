# General Code Quality Standards

## Profile Stability
- Once a profile is activated, stay in that profile until explicitly told to switch
- **Profiles NEVER auto-switch to another profile**
- **Profiles ONLY handoff work, they do not activate the next profile**
- Profile switches require explicit commands:
  - "Act as [Profile]"
  - "As [Profile]"
  - "Switch to [Profile]"
  - "@start" (reads handoff)
- Mentioning another profile in conversation does NOT trigger a switch
- Discussing work for another profile does NOT trigger a switch
- Preparing handoffs or messages for other profiles does NOT trigger a switch

## PROFILE Activation
- When a Profile is activated it MUST execute `@hello`
- When a Profile is activated it MUST display:
  'CANARY: Profile activation block executed.'

## Profile Routing Rules
- **work for Builder MUST route through PromptEngineer first**
- Any profile that needs Builder implementation must changeover to PE, not Builder directly
- PE creates the Builder prompt, then hands off to Builder
- **Exception: Builder can handoff to Builder for multi-phase work when splitting development and testing**
  - Example: TDD workflow (Phase 1: tests, Phase 2: implementation)
  - Both phases are implementation work, no new prompt needed
- This ensures prompt quality, prevents drift, and maintains consistency

## Profile scoping
Profiles do not perform out‑of‑domain work,
but must still complete their own responsibilities
and communicate via standard workflow mechanics.
When a request is outside a profile’s domain but within its worldview,
the profile must reinterpret the request into its own domain and produce its defined outputs.

## Batching File Operations

### Batch Multiple Files in Single fsRead Call

When reading multiple files for read-only inspection, batch them into single fsRead calls to reduce user confirmation clicks.

**Pattern:**

❌ **Don't do this (one file at a time):**
```typescript
fsRead({paths: ["/path/to/file1.ts"]})  // Click 1
fsRead({paths: ["/path/to/file2.ts"]})  // Click 2
fsRead({paths: ["/path/to/file3.ts"]})  // Click 3
// ... 100 more files = 100 more clicks
```

✅ **Do this (batch multiple files):**
```typescript
fsRead({paths: [
  "/path/to/file1.ts",
  "/path/to/file2.ts",
  "/path/to/file3.ts",
  "/path/to/file4.ts",
  "/path/to/file5.ts",
  // ... up to 10-20 files per batch
]})  // Single click for all files
```

**Batch Size Guidelines:**
- **10-20 files per batch** for read-only inspection
- Smaller batches if files are very large (>50KB each)
- Larger batches acceptable for small files (<10KB each)
- Balance between efficiency and avoiding timeout/memory issues

**When to Batch:**
- Reading multiple files to check for references
- Reading multiple files to verify patterns
- Reading multiple test files
- Reading multiple domain files
- Any read-only operation across multiple files

**When NOT to Batch:**
- Writing/modifying files (use appropriate write tools)
- Files are unrelated and may not all be needed
- Single file operations

## Code Organization
- Follow existing directory structure
- Group related files in feature directories
- Use consistent file naming conventions
- Keep components focused and single-purpose

## Pattern Application
- Patterns must be earned, not applied by default
- Partial pattern implementation is acceptable when full pattern isn't justified
- Apply patterns only when they solve actual problems
- Don't add pattern infrastructure "just in case" or for consistency alone
- Examples:
  - Don't add Request/Success/Failure if only Request is needed
  - Don't add error state if errors are handled elsewhere
  - Don't add loading state if operation is synchronous or instant
  - Don't create abstractions until second use case appears

## Naming Conventions
- Follow existing patterns in the codebase
- When adding new features, match the naming style of similar existing features
- **Redux Saga Patterns**: `getEntity()`, `handleActionName()`, `watchEntitySaga()`
- **Redux Slice Patterns**: `entitySlice`, `entityActions`
- **File Naming**: PascalCase for components, camelCase for utilities
- **Function Naming**: `handleEventName`, `isCondition`, descriptive verbs for async operations

## Rule File Organization
- Add new rules to existing rule files when they fit the same category
- Only create new rule files when the rule doesn't fit any existing category
- Check existing rule files before creating new ones

## Saved Prompts
- Saved prompts MUST be created in BOTH locations:
  - `~/.aws/amazonq/prompts/` - Global user prompts (for immediate use)
  - `.amazonq/prompts/` - Project prompts (for version control and team sharing)
- Creating in both ensures prompts work immediately AND are shared with the team
- Project prompts directory is version controlled with the repository

## Error Handling
- Use proper error boundaries for React components
- Handle async errors in sagas
- Provide meaningful error messages
- Log errors appropriately for debugging

## Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Follow existing patterns for data fetching

## Documentation
- Use JSDoc for complex functions
- Keep comments focused on "why" not "what"
- Update README when adding new features
- Document API changes and breaking changes
- **Line length**: Use natural line breaks, wrap lines between 80-100
  characters for readability in text editors and version control
  - Apply to: documentation, commit messages, user stories, architecture
    documents, rule files, handoff files, message files, suspend contexts
  - Exceptions: code files (follow tech/formatting.md), log files
    (workflow.log JSONL), generated files, JSON/YAML config files

## Workflow Step Communication

Don't describe next steps until current step is complete.

Wait for user to trigger the next step, don't pre-explain it.

## Workflow Logging

Profiles that reference `workflow/logging.md` MUST follow its MANDATORY logging requirements.

## Documentation Reference Dependencies

- Rules files MUST NOT contain `docs/` references that load, see, or reference content
- Documentation reference files are for human reference only
- Operational content belongs in rules files or saved prompts
- Examples belong in docs files, not rules files (unless absolutely necessary)
- **Exception:** Architecture rules MAY reference `docs/` for anchoring to existing patterns