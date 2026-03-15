# Architecture Overview

## Full Architecture Guide

Complete architecture documentation: `docs/dev/architecture.md`

This folder contains AI-consumable rule extracts focused on enforcement and guidance.

---

## Rule Files

### CRITICAL Rules

**domain-structure.md**
- UI domain folder structure (Slice/Saga/Types pattern)
- No premature abstraction (no folders for single files)
- Domain boundaries and type placement

**generated-code.md**
- Never edit `src/graphql/` (Amplify-generated)
- Schema-first for new domain types
- Modular schema structure

**change-impact-analysis.md**
- Pre-implementation impact analysis (MANDATORY for type/schema/cross-domain changes)
- Change classification (structure, rename, cross-domain)
- Phase splitting for high-risk changes (5+ files, multiple domains)
- Validation strategy per change type

### IMPORTANT Rules

**domain-structure.md** (Domain Hooks section)
- Domain hooks should live in domain folders (migration in progress)
- Currently some hooks are in `components/hooks/`

### GUIDANCE

**local-utilities-alignment.md**
- Keep Local-Utilities in sync with backend
- Orthography converter alignment
- testFiles/ fixture management

---

## Amplify Gen2 Architecture

Backend uses **Amplify Gen2**:
- CDK-based infrastructure as code
- TypeScript-first configuration
- Modular resource definitions
- Local sandbox mode

Backend entry point: `amplify/backend.ts`

---

## Key Architectural Principles

1. **Domains are first-class** — each domain is a top-level folder in `src/`
2. **GraphQL schema is the contract** — all frontend and backend logic aligns with modular schema files
3. **UI layers are explicit** — pages, components, global UI, and domain UI are separate
4. **Backend and local tools are aligned** — ingestion and orthography conversion logic exist both in Amplify and Local-Utilities
5. **Folders exist only when they earn their existence** — no unnecessary hierarchy
6. **Amplify Gen2 architecture** — modular backend with CDK-based infrastructure

---

## Quick Reference

### UI Domain Structure
```
DomainName/
    DomainSlice.ts          — REQUIRED
    DomainSaga.ts           — REQUIRED
    DomainTypes.ts          — REQUIRED
    __tests__/              — REQUIRED
```

### Backend Domain Structure
```
amplify/data/DomainName/
    schema.graphql          — domain schema fragment
    guards.ts               — authorization guards (optional)
```

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

---

## Special Folders

### Read-Only
- `src/graphql/` — Amplify-generated, never edit manually
- `amplify-gen1/` — Archived Gen1 config, do not modify

### Test-Only
- `__utils__/` — Test utilities
- `__mocks__/` — Vitest manual mocks
- `__tests__/` — Test files
- `testFiles/` — Document fixtures (root level)
- `amplifyTests/` — Backend integration tests

### Infrastructure
- `patches/` — patch-package overrides (never edit patches directly)
- `Local-Utilities/` — Local extraction/conversion tools
