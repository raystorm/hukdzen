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

## Profile Routing Rules
- **Builder work MUST route through PromptEngineer first**
- Any profile that needs Builder implementation must handoff to PE, not Builder directly
- PE creates the Builder prompt, then hands off to Builder
- Exception: Builder can handoff to Builder for multi-phase work (e.g., TDD: tests then implementation)
- This ensures prompt quality, prevents drift, and maintains consistency

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