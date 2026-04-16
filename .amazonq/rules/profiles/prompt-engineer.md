# Prompt Engineering Rules

## Prompt Structure (Grammar)

### Required Format
```
Act as <Profile>.

<Task description in imperative form>

<Context and constraints>

<Examples from codebase when anchoring is needed>
```

### Profile Activation
- **ALWAYS** start with explicit profile activation: `Act as <Profile>`
- Use single profile per prompt for clarity
- `Act as <Profile>` is always used for maximum clarity and compatibility

### Task Description
- Write in imperative mood (command form)
- Be specific about what to create/modify/analyze
- State the goal, not the implementation steps
- Keep focused on single responsibility

### Context Commands
- Use `@workspace` to analyze project structure, patterns, or usage across the codebase
- Use `@folder` or `@file` for tasks scoped to specific files/folders

---

## Prompt Constraints

### Context Awareness
- Check if `.amazonq/work/FEATURE.md` exists
- If multi-story feature, reference current story context in prompt
- Include story number and dependencies when relevant

### Brevity
- Write complete instructions, but minimal
- Omit unnecessary context
- Don't repeat what rules already cover
- Don't specify output format unless it matters for the task

### Rule References
- Prompts activate profiles, profiles bring their rules
- Don't embed rule content in prompts
- Only restate CRITICAL rules when essential for task clarity
- Trust that profile rules are followed

### Confirmation
- Prompts must request confirmation for all file changes
- Include: "Show diffs and request confirmation before modifying any workflow artifact"
- Alternative: "Request confirmation before proceeding"

---

## Drift Prevention

### Anchoring to Codebase
- Reference existing implementations when available
- Format: "Follow the pattern in `path/to/file.ts`"
- List specific examples: "Like `AuthorSlice.ts`, `BoxSlice.ts`"
- Specify what NOT to do when preventing anti-patterns

### Prohibited Behaviors
Prompts must prevent:
- Inventing new patterns not in codebase
- Ignoring existing conventions
- Adding unnecessary abstractions
- Creating folders for single files
- Editing `src/graphql/` files

### Anchoring Techniques
- "Follow existing pattern in `<file>`"
- "Match structure of `<domain>`"
- "Use same naming convention as `<example>`"
- "Don't create new patterns, use existing `<pattern>`"

---

## Architecture Rule Integration

### Domain Structure
- Prompts creating domains must mention: Slice/Saga/Types/\_\_tests\_\_ structure
- Reference: "Follow domain structure (Slice/Saga/Types pattern)"

### Generated Code
- Prompts touching GraphQL must state: "Schema-first, never edit `src/graphql/`"
- For new types: "Define in `amplify/data/` schema first, then run codegen"

### Testing
- All implementation prompts must include: "Create tests alongside implementation"
- Reference test data: "Use mock data from `src/__utils__/__fixtures__/`"

---



---

## Output Structure

### Response Ordering (when specified)
- Explanation of approach (brief)
- Code diffs
- Confirmation request

### Verbosity Control
- Prompts should include: "Be concise"
- Or: "Minimal explanation"
- Or: "Focus on implementation"

### Format Specification
- Only specify when it matters
- Examples:
```
  "Generate commit message following commit-style-guide.md"  
  "Output as user story format"  
  "Provide as markdown documentation"
```

---

## Legacy Code Handling

### Current State vs Target State
- Prompts use target state (desired patterns)
- Don't reference deprecated patterns
- Migration of legacy code is separate task

### When Legacy Exists
- Prompt uses new pattern
- Don't mention legacy location
- Migration happens via separate migration prompt

---

## Invariants

### Always True
- Profile must be stated
- Confirmation required for file changes
- Follow minimal code principle
- Anchor to existing patterns
- Schema-first for new types
- Never edit generated files

### Never True
- Multiple profiles in single prompt
- Embedded rule content
- Inventing new patterns
- Unnecessary abstractions
- Verbose explanations when not needed
