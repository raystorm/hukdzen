# Domain Definition Rules

## Domain Definition

A domain is a boundary of responsibility — a grouping of related logic, data,
or behavior that changes together.

Domains help:
- isolate change
- reduce cascade effects
- structure impact analysis
- validate changes in smaller units
- maintain clear boundaries

This workflow does not prescribe any specific domain methodology.  
Projects may define domains using DDD, modular monolith patterns, microservices,
frontend/backend modules, CLI command groups, or any other boundary‑oriented structure.

---

## CRITICAL: Domain Reference Documentation

**Architect MUST check domain reference docs before making domain
changes.**

**Location:** `docs/dev/domains/`

**Files:**
- `domains.md` - Domain overview and principles
- `frontend-domains.md` - All frontend domains (src/)
- `backend-domains.md` - All backend domains (amplify/data/)
- `lambda-domains.md` - All Lambda domains (amplify/functions/)

**When to check:**
- Before adding new domains
- Before modifying existing domains
- Before analyzing domain relationships
- Before making architectural decisions about domains

**Purpose:**
- Understand existing domain inventory
- Verify domain type classification
- Avoid duplicate domains
- Maintain consistency with existing patterns
- Prevent documentation drift

**Architect responsibility:**
- Check docs before domain changes
- Update docs when adding/modifying domains
- Ensure domain matches documentation
- Ensure domain type matches documentation

---

## CRITICAL: Domain Folder Structure

### UI Domain Requirements

All UI domains in `src/` **MUST** follow this structure:

```
DomainName/
    DomainSlice.ts          — REQUIRED
    DomainSaga.ts           — REQUIRED
    DomainTypes.ts          — REQUIRED
    Domain.helpers.ts       — optional
    DomainUtilities.ts      — optional
    __tests__/              — REQUIRED for all logic
```

**Examples:**
- `Author/AuthorSlice.ts`, `Author/AuthorSaga.ts`, `Author/AuthorTypes.ts`
- `Box/BoxSlice.ts`, `Box/BoxSaga.ts`, `Box/BoxTypes.ts`

### Prohibited Patterns

**NEVER create `selectors.ts` files** — use inline selectors or helpers instead.

### Domain Hooks Location

**IMPORTANT:** Domain hooks should live **inside the domain folder**, not in `components/hooks/`.

Current state: Some hooks are in `components/hooks/` (migration in progress).

Target state: Move domain-specific hooks to their domains.

Examples:
- `docs/useIfDocumentExists.ts` (target location)
- `Author/useAuthorForm.ts` (target location)

Shared, domain-agnostic hooks stay in `components/hooks/`.

---

## CRITICAL: No Premature Abstraction

**Do not create folders for single files.**
**Do not create structural abstractions until they are justified.**

If only one file exists, keep it at the parent level
until a second related file justifies the folder.

Premature abstraction increases:
- cognitive load
- unnecessary indirection
- maintenance cost

Bad:
```
utils/
    stringHelpers/
        capitalize.ts       — only file in folder
```

Good:
```
utils/
    capitalize.ts           — stays flat until more string helpers exist
```

---

## Folder Naming Guidelines

### PascalCase = Domain Objects/Concepts (guideline)

Domain objects typically use PascalCase:

```
Author/
Box/
BoxRequest/
BoxUser/
Gyet/
Role/
User/
```

Used for:
- Core domain entities
- Stable business concepts
- Modules representing real-world objects or responsibilities

Characteristics:
- Represent real entities in the system
- Contain domain logic (sagas, slices, types, rules)
- Singular, not plural
- Change infrequently

### lowercase = Features/Flows (guideline)

Application features typically use lowercase:

```
browse/
collections/
docs/
error/
```

Used for:
- User-facing flows
- Operational processes
- Infrastructure or utility modules

Characteristics:
- Represent user flows or infrastructure
- Contain pages, components, or supporting logic
- Often plural
- Change more frequently

### Special Cases

Global UI or cross-cutting concerns:

```
AlertBar/
FileUploader/
UI/
Search/
```

Follows the naming of the conceptual domain they represent.

**Note:** These are guidelines, not hard rules. Use judgment based on what the folder represents.

---

## Domain Boundaries

### `app/` — Application Infrastructure Only

Infrastructure code (framework setup, configuration, adapters, glue code)

Contains:
- Redux store
- root reducer
- root saga
- middleware
- typed Redux Hooks
- Auth event processor

**CRITICAL:** No domain logic lives here.

### Domain Types Stay in Domains

Global shared types go in `src/types/`.

Domain-specific types **MUST** stay in `DomainTypes.ts` within the domain folder.

### Domain UI Placement

**Tightly coupled UI:** Lives inside the domain folder.

**Shared UI:** Lives in `components/`.

When in doubt, start in the domain. Move to `components/` only when reused by multiple domains.

When in doubt:
- Place code inside the domain
- Move to `components/` only when reused by multiple domains.

---

## Backend Domain Structure

Backend domains in `amplify/data/` follow a different pattern:

```
amplify/data/
    DomainName/
        schema.graphql      — domain-specific schema fragment
        guards.ts           — authorization guards (optional)
```

**Note:** The UI domain file pattern (Slice/Saga/Types) does **NOT** apply to `amplify/` folders.

---

## Lambda Function Domains

Lambda functions in `amplify/functions/` are part of the backend architecture and **MUST** be considered during cross-cutting changes.

### Lambda Function Structure

```
amplify/functions/functionName/
    infra/                  — CDK infrastructure
    src/                    — handler and logic
    src/__tests__/          — unit tests
    package.json
    tsconfig.json
    jest.config.js
```

### Lambda Domains by Purpose

**Data Hydrators:**
- `BoxUserHydrator` - Hydrates BoxUser relationships
- `BoxRequestHydrator` - Hydrates BoxRequest relationships
- Purpose: Enrich data with related entities before returning to frontend

**Seed Loaders:**
- `seedLoader` - Loads initial data into system
- Purpose: Database initialization and seeding

**Search:**
- `searchRunner` - Executes OpenSearch queries
- Purpose: Full-text search with permission filtering

**Shared:**
- `amplify/functions/shared/` - Shared types and GraphQL definitions
- Purpose: Common code used across multiple Lambda functions

### Cross-Cutting Change Impact

Lambda functions are affected by:

**Type Changes:**
- Schema type renames (e.g., Xbiis → Box)
- Field name changes (e.g., xbiisOwnerId → boxOwnerId)
- New types or fields

**Schema Changes:**
- Query/mutation renames
- Input type changes
- Filter input changes

**Domain Changes:**
- Domain renames
- Domain restructuring
- New domain creation

### When to Update Lambda Functions

**MANDATORY updates for:**
- Type renames (update imports and references)
- Field name changes (update field access)
- Schema query/mutation renames (update GraphQL calls)
- Domain renames affecting Lambda logic

**Check Lambda functions when:**
- Making cross-domain changes
- Renaming types or fields
- Updating schema definitions
- Changing domain structure

### Lambda Function Discovery

**Location:** `amplify/functions/`

**Search pattern:**
```bash
# Find all Lambda functions
ls -d amplify/functions/*/

# Search for references in Lambda functions
grep -r "SearchTerm" amplify/functions --include="*.ts" --include="*.js" --include="*.mjs"
```

### Profile Integration

**Architect:** Must consider Lambda functions when analyzing cross-cutting changes

**Planner:** Must include Lambda functions in story scope when applicable

**PromptEngineer:** Must explicitly mention Lambda functions in Builder prompts for cross-cutting changes

**Builder:** Must check `amplify/functions/` for references during large-scale changes (renames, type changes)

**TestDesigner:** Must consider Lambda function tests when designing test scenarios
