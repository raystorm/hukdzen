# **Smalgyax‑Files Architecture Guide**

## **1. Overview**

Smalgyax‑Files is a domain‑driven React + Amplify application.

Core principles:

* **Domains are first‑class** — each domain is a top‑level folder in `src/`.
* **The GraphQL schema is the contract** — all frontend and backend logic aligns with modular schema files.
* **UI layers are explicit** — pages, components, global UI, and domain UI are separate.
* **Backend and local tools are aligned** — ingestion and orthography conversion logic exist both in Amplify and Local‑Utilities.
* **Folders exist only when they earn their existence** — no unnecessary hierarchy.
* **Amplify Gen2 architecture** — modular backend with CDK-based infrastructure.

This guide documents the entire repository structure, backend, frontend, ingestion pipeline, and domain conventions.

---

# **2. Full Repository Structure**

```
/
├── amplify/                    — Gen2 backend (CDK-based)
│   ├── auth/
│   ├── data/                   — GraphQL schema (modular)
│   │   └── [Domains]/          — Domain-specific schema files and resolvers
│   ├── email/
│   ├── functions/
│   │   ├── data/               — custom AppSync resolvers
│   │   ├── shared/             — reusable Lambda utilities
│   │   └── [lambdas]/          — individual Lambda functions
│   ├── monitoring/
│   ├── sandbox/
│   ├── search/
│   ├── storage/
│   └── backend.ts
│
├── amplify-gen1/               — archived Gen1 config
│
├── amplifyTests/               — backend integration tests,
│                                 for data domain authorization guards
├── Local-Utilities/            — local extraction/conversion tools
│
├── src/
│   ├── app/                    — Redux store, root saga
│   │
│   ├── [Domains]/              — PascalCase domain objects
│   │   ├── Author/
│   │   ├── Box/
│   │   ├── BoxRequest/
│   │   ├── BoxUser/
│   │   ├── Gyet/
│   │   ├── Role/
│   │   ├── Search/
│   │   ├── Unsubscribe/
│   │   └── User/
│   │
│   ├── [features]/             — lowercase feature flows
│   │   ├── browse/
│   │   ├── collections/
│   │   ├── docs/
│   │   └── error/
│   │
│   ├── [global UI]/
│   │   ├── AlertBar/
│   │   ├── FileUploader/
│   │   └── UI/
│   │
│   ├── components/
│   │   ├── FileUploader/
│   │   ├── forms/
│   │   ├── hooks/              — shared React hooks
│   │   ├── pages/              — page-level components
│   │   ├── shared/
│   │   └── widgets/
│   │
│   ├── utils/                  — domain-agnostic helpers
│   ├── data/                   — system constants
│   ├── graphql/                — Amplify-generated
│   ├── types/                  — global types
│   ├── __utils__/              — test utilities
│   └── __mocks__/              — Vitest mocks
│
├── docs/
│   ├── dev/
│   └── gen2-infrastructure/
│
├── patches/                    — patch-package overrides
│
├── testFiles/                  — document fixtures
│
└── [config files]
```

> [NOTE!]
> Full Lambda Function definition in
[Amplify Backend Development Guide](../docs/dev/contributing/backend-development.md).

---

# **3. Backend Architecture (Amplify Gen2)**

## **3.1 Gen2 Overview**

Amplify Gen2 provides:

* CDK-based infrastructure as code
* TypeScript-first configuration
* Modular resource definitions
* Local sandbox mode
* Better separation of concerns

Backend entry point: `amplify/backend.ts`

---

## **3.2 Backend Resource Modules**

### **auth/**
Cognito user pools, identity pools, OAuth configuration.

### **data/**
GraphQL API schema and AppSync configuration.

**Schema is modular** — domain-specific `.graphql` files are composed:

```
amplify/data/
    Author/
    Box/
    BoxRequest/
    BoxUser/
    Collection/
    Document/
    User/
    resolvers/
    schema.graphql          — empty shell, imports domain files
    AccessLevel.graphql
    Clan.graphql
    Email.graphql
    filters.graphql
    Gyet.graphql
    Search.graphql
    resource.ts
```

Schema changes propagate to:

* Amplify-generated code (`src/graphql/`)
* domain slices and sagas
* Lambda functions
* Local‑Utilities
* UI expectations

### **storage/**
S3 bucket configuration for document uploads.

### **search/**
OpenSearch domain for full-text search.

### **email/**
SES configuration for transactional emails.

### **monitoring/**
CloudWatch dashboards and alarms.

---

## **3.3 Lambda Functions**

Location: `amplify/functions/`

All Lambda functions are written in **TypeScript** (Gen2 pattern).

Each function has:

```
functionName/
    infra/              — CDK infrastructure code
    src/                — function handler and logic
    src/__tests__/      — unit tests
    package.json
    tsconfig.json
    jest.config.js
```

Full Lambda Function definition in
[Amplify Backend Development Guide](../docs/dev/contributing/backend-development.md).

### **Shared Lambda Code**

`amplify/functions/shared/` contains reusable utilities:

* GraphQL client and operations
* Logger
* Type definitions
* Common helpers

Ensures DRY principle, consistent error handling, and shared type safety.

### **Custom AppSync Resolvers**

`amplify/functions/data/` contains Lambda-backed custom resolvers for complex queries requiring:

* cross-table joins
* computed fields
* permission-aware hydration
* complex business logic

---

## **3.4 Generated GraphQL Artifacts**

Amplify generates:

```
src/graphql/
    API.ts
    mutations.ts
    queries.ts
    subscriptions.ts
```

These are:

* auto-generated
* overwritten on each codegen
* consumed by sagas and domains
* never manually edited

---

# **4. Local‑Utilities**

## **4.1 Purpose**

`Local-Utilities/` is a standalone Node project used for:

* running content extraction logic locally
* running orthography conversion locally
* debugging ingestion and conversion without redeploying Lambdas
* verifying that ingestion + conversion outputs match frontend expectations

It directly uses production code to ensure parity.

---

## **4.2 Translator (Orthography Converter) — bidirectional**

Even though the folder is named **Translator**, the behavior is:

### **BC Orthography ↔ AK Orthography**

* same language
* no semantic translation
* deterministic
* reversible
* rule‑based

Local‑Utilities must support:

* BC → AK
* AK → BC

This ensures:

* frontend translator hooks
* backend ingestion
* Local‑Utilities
* docs domain

…all stay aligned.

---

## **4.3 Alignment with ingestTrigger and domains**

Local‑Utilities mirrors:

* extraction logic
* orthography conversion logic
* document normalization rules
* duplicate detection rules

It directly imports production code to ensure functional parity.

---

# **5. Frontend Architecture (`src/`)**

## **5.1 `app/` — Application Infrastructure**

Contains:

* Redux store
* root reducer
* root saga
* middleware
* typed Redux Hooks
* Auth event processor

No domain logic lives here.

---

## **5.2 Domain Folder Capitalization Rules**

Capitalization distinguishes **domain objects** from **application features**.

### **Capitalized folders = Domain Objects**

Nouns in the business domain with types, slices, sagas, rules, or relationships.

Examples:

```
Author/
Box/
BoxRequest/
BoxUser/
Gyet/
Role/
User/
```

Characteristics:

* Represent real entities in the system
* Contain domain logic (sagas, slices, types, rules)
* Use **PascalCase**
* Singular, not plural

### **Lowercase folders = Features/Flows**

Workflows, pages, or application-level features.

Examples:

```
browse/
collections/
docs/
error/
```

Characteristics:

* Represent user flows or infrastructure
* Contain pages, components, or supporting logic
* Use **lowercase**
* Often plural

### **Special-case domain slices**

Global UI or cross-cutting concerns:

```
AlertBar/
FileUploader/
UI/
Search/
```

---

## **5.3 `UI/` — UI Domain**

Manages global UI state:

* loading
* blocking
* processing
* banners
* global flags

Files:

```
uiSlice.ts
uiTypes.ts
```

Rendering lives in `AlertBar/`.

---

## **5.4 `FileUploader/` — File Upload Domain**

Owns:

* upload slice
* upload saga
* upload types

Domain-specific UI lives in `components/FileUploader/`.

---

# **6. Domain Folders**

Each domain uses:

```
DomainSlice.ts
DomainSaga.ts
DomainTypes.ts
Domain.helpers.ts (optional)
DomainUtilities.ts (optional)
```

### **Domain hooks live in `components/hooks/`**

Examples:

```
components/hooks/useIfDocumentExists.ts
components/hooks/useTranslator.ts
components/hooks/useTranslationHandler.ts
```

### **No selectors files**

You do not use `selectors.ts`.

### **Domain UI lives inside domains when tightly coupled**

Shared UI lives in `components/`.

---

# **7. Components Architecture**

## **7.1 `components/` — Shared, Domain-Agnostic UI**

```
components/
    FileUploader/   — File uploader UI - imported AWS code - legacy
    forms/          — reusable form components
    hooks/          — shared React hooks
    pages/          — page-level components
    shared/         — layout, theme, routing
    widgets/        — reusable UI widgets
```

---

# **8. AlertBar/**

Global visual components driven by domain state.

Files:

```
AlertBarNotifier.tsx
AlertBarSlice.ts
AlertBarTypes.ts
AlertView.tsx
```

No domain logic.

---

# **9. pages/ (in components/)**

**Pages are UI screens mapped to URLs.**

They are not reusable and may contain composition and base UI logic.

Pages may include:

* widgets
* shared components
* domain UI
* static content
* layout
* simple UI logic
* error handling
* landing/donation flows

Pages should **not** contain domain business logic, slices, sagas, or domain rules.

Pages are the top‑level UI entrypoints for the router.

---

# **10. utils/**

Contains:

* domain‑agnostic helpers
* translator utilities (orthography conversion)
* keyboard utilities
* logger
* saga utilities

---

# **11. data/**

System-level constants and default entities:

```
DefaultBox.js
SystemUser.js
UnknownAuthor.js
```

---

# **12. graphql/**

Amplify-generated operations.

Never edited manually.

---

# **13. types/**

Global shared type helpers, and types that didn't come from Amplify.

Domain types stay in domains.

---

# **14. `__utils__/` — Test Utilities**

Contains:

* test helpers
* fixtures
* builders
* domain‑aware mock data

Wrapped in `__` to mark as non‑runtime.

---

# **15. `__mocks__/` — Vitest Manual Mocks**

Vitest supports Jest‑style manual mocks.

This folder is optional and test‑only.

---

# **16. patches/**

**patch‑package overrides for `node_modules`**

This folder contains patch files generated by **patch-package**.

### **Never edit patch files directly.**

Patch files are diffs — not source code.

### **Correct workflow:**

1. Edit the actual file inside `node_modules`
2. Generate/update the patch: `npx patch-package @package-name`
3. Run the `try-again` script from `package.json` to clear caches and reinstall

Detailed patch explanations live in `docs/dev/patch-Appendix.md`.

---

# **17. Double‑underscore folder convention**

`__name__` folders mark **non‑runtime namespaces**:

* `__utils__/`
* `__mocks__/`
* `__tests__/`

They keep runtime architecture clean.

---

# **18. testFiles/**

Real document fixtures used for:

* ingestion testing  
* extraction validation  
* hashing and duplicate‑detection tests  
* Local‑Utilities  
* ingestTrigger parity tests  

Rules:

* do not move or rename this folder  
* do not add unrelated files  
* do not delete existing fixtures  
* do not import these files into runtime code  

It exists at the root so ingestion tools can access it without involving the frontend build system.

---

# **19. amplify-gen1/**

Legacy Amplify Gen1 configuration, archived for reference.

Do not modify. All new work uses Gen2 (`amplify/`).

---

# **20. amplifyTests/**

Tests authorization guards in `amplify/data/<Domain>/` folders.

---

# **21. Sandbox Mode**

Amplify Gen2 provides local sandbox environments for development.

```
amplify/sandbox/
    start-sandbox.sh
    seed-users.sh
```

Sandbox mode:

* runs a personal cloud environment
* isolated from production
* supports rapid iteration
* auto-deploys on file changes
