# Git Management

## Automatic Git Add

When creating new **persistent workflow artifacts**,
automatically stage them with: `git add`.

(See terms: Workflow Artifact)

### Decision Criteria

**Add to git when the file is a Persistent Workflow Artifact.**  
**Do NOT add to git when the file is a Transient Workflow Artifact.**

**Do NOT add to git when file is:**
- Temporary or transient (will be deleted soon)
- Working context (workflow state, handoffs, messages)
- Generated (will be regenerated from source)
- Environment-specific (secrets, local config)
- Personal tracking (TODO lists, status tracking)

### Specific Patterns

**Always add:**
- Source code: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.java`, etc.
- Tests: `.test.ts`, `.spec.ts`, test fixtures
- Configuration: `package.json`, `tsconfig.json`, `jest.config.js`
- Schemas: `.graphql`, `.sql` files
- Documentation in `docs/` directory
- Rules: `.amazonq/rules/` files
- Prompts: `.amazonq/prompts/` files

**Never add:**
- Temporary files: `.tmp`, build artifacts, `node_modules/`
- Working files: `.amazonq/work/`, `.amazonq/workflow.log`, `.amazonq/suspended/`
- Generated files: `src/graphql/` (Amplify-generated)
- Secrets: `.env` files (use `.env.example` instead)
- Tracking files: Files with STATUS, TODO, or TRACKING in name
- Working directories: `gh/`, `gen2-infrastructure/` (temporary, will be removed)

### File Classification

- Any Files created must immediately be classified as:
  - persistent, to be added to git
  - transient, not to be added to git
- When classification is unclear the user MUST be asked.

### Implementation

After creating a persistent file:

```bash
git add <file-path>
```

**Example:**
```bash
# Created new domain file
git add src/NewDomain/NewDomainSlice.ts

# Created new rule file
git add .amazonq/rules/workflow/new-rule.md

# Created new test
git add src/NewDomain/__tests__/NewDomain.test.ts
```

### When to Skip Git Add

- File is in `.gitignore`
- The file is a Transient Workflow Artifact
- The file is System‑Owned (see glossary Excludes)
- File is transient, temporary or working context
- File is generated (will be regenerated)
- File contains secrets or environment-specific data
- File name contains STATUS, TODO, or TRACKING
- File is in working directory (gh/, gen2-infrastructure/)
- User explicitly requests not to add

### Verification

After `git add`, profiles should confirm:
```
Added to git: <file-path>
```

If file should not be added:
```
Created <file-path> (not added to git - temporary/working file)
```

## Rationale

- Ensures persistent artifacts are always versioned
- Prevents accidental staging of workflow state
- Prevents forgetting to stage new files
- Makes commits more complete
- Reduces manual git management
- Clear distinction between persistent and temporary files
- Aligns with version control best practices
