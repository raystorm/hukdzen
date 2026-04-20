# Large-Scale Rename Prompt Documentation

## Purpose

The `@_rename` prompt provides comprehensive patterns for large-scale rename operations across the codebase.

Large-scale renames affect multiple domains, file types, and layers (backend schema, guards, Lambda functions, frontend domains, tests).

## When to Use

Load this prompt when:
- Implementing type renames across codebase (e.g., Xbiis → Box)
- Implementing field renames across domains (e.g., xbiisOwnerId → boxOwnerId)
- Need reference search patterns
- Need scope identification guidance
- Need implementation order guidance
- Need verification patterns

## What It Contains

The prompt provides:
- Initial reference search command (grep pattern)
- What to search (type names, field names, variations, function names)
- Where to search (src/, amplify/data/, amplify/functions/)
- What to exclude (node_modules/, generated code)
- Scope identification steps
- Implementation order (schema → codegen → guards → Lambda → frontend → tests)
- Verification command (grep to check for remaining references)

## What It Does NOT Contain

- Purpose/rationale (in this doc)
- Why reference search first (in this doc)
- Examples of rename operations (in reference docs if needed)

## Why Reference Search First

Reference search identifies full scope before implementation:
- Prevents missing references
- Identifies all affected areas (backend, frontend, Lambda functions)
- Enables accurate scope reporting to user
- Reduces rework and fixes

## Search Scope

**What to search:**
- Type names (e.g., "Xbiis")
- Field names (e.g., "xbiisOwnerId", "boxXbiisId")
- Related variations (e.g., "createdBoxXbiisId")
- Function names (e.g., "createXbiis", "getXbiis")

**Where to search:**
- `src/` - Frontend code
- `amplify/data/` - Backend schema and guards
- `amplify/functions/` - Lambda functions

**Exclude:**
- `node_modules/` - Dependencies
- `src/graphql/` or `amplify/functions/shared/graphql/` - Generated code (will be regenerated)

## Related Files

- **Rule:** `.workflow/rules/profiles/builder.md` - References this prompt for large-scale renames
- **Prompt:** `.amazonq/prompts/_rename.md` - Implementation patterns (load on-demand)
