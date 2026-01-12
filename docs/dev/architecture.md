# **Smalgyax‑Files Architecture Guide**

## **1. Overview**

Smalgyax‑Files is a domain‑driven React + Amplify application.

Core principles:

- **Domains are first‑class** — each domain is a top‑level folder in `src/`.
- **The GraphQL schema is the contract** — 
  all frontend and backend logic aligns with `schema.graphql`.
- **UI layers are explicit** — 
  pages, components, global UI, and domain UI are separate.
- **Backend and local tools are aligned** — 
  ingestion and orthography conversion logic exist both in Amplify and Local‑Utilities.
- **Folders exist only when they earn their existence** — no unnecessary hierarchy.

This guide documents the entire repository structure, backend, frontend, ingestion pipeline, and domain conventions.

---

# **2. Full Repository Structure**

```
/
├── amplify/
│   ├── backend/
│   │   ├── api/
│   │   │   └── hukdzen/
│   │   │       ├── schema.graphql
│   │   │       └── parameters.json
│   │   └── function/
│   │       └── ingestTrigger/
│   ├── #current-cloud-backend/
│   └── team-provider-info.json
│
├── Local-Utilities/
│   ├── localUtil.js
│   ├── package.json
│   ├── package-lock.json
│   └── ReadMe.md
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   └── hooks.ts
│   │
│   ├── UI/
│   ├── FileUploader/
│   │
│   ├── Author/
│   ├── Box/
│   ├── BoxUser/
│   ├── collections/
│   ├── docs/
│   ├── Gyet/
│   ├── Role/
│   ├── Search/
│   ├── User/
│   │
│   ├── Translator/
│   │   ├── translator.js
│   │   ├── translator.cjs
│   │   ├── useTranslator.ts
│   │   └── useTranslationHandler.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── widgets/
│   │   ├── misc/
│   │   ├── useSkipRender.ts
│   │   └── FileUploader/
│   │
│   ├── globalUI/
│   │   └── AlertBar/
│   │
│   ├── pages/
│   │
│   ├── utils/
│   │   └── data/
│   │
│   ├── graphql/
│   ├── types/
│   ├── __utils__/
│   ├── __mocks__/
│   └── assets/
│
├── docs/
│   ├── dev/
│   ├── product/
│   └── architecture.md
│
├── patches/
│
├── testFiles/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

---

# **3. Backend Architecture (Amplify)**

## **3.1 Amplify API: `hukdzen`**

Your GraphQL API is named:

```
hukdzen
```

It defines the data model used by:

- AppSync
- DynamoDB
- frontend domains (via generated operations)

---

## **3.2 GraphQL Schema**

Location:

```
amplify/backend/api/hukdzen/schema.graphql
```

This file is the **source of truth** for:

- models
- relationships
- enums
- auth rules
- ingestion output shape
- domain boundaries

Schema changes propagate to:

- Amplify-generated code (`src/graphql/`)
- domain slices and sagas
- ingestion logic
- Local‑Utilities
- UI expectations

---

## **3.3 Generated GraphQL Artifacts**

Amplify generates:

```
src/graphql/
    mutations.ts
    queries.ts
    subscriptions.ts

src/types/AmplifyTypes.ts
```

These are:

- auto-generated
- overwritten on each push
- consumed by sagas and domains
- never manually edited

---

## **3.4 Ingestion Trigger Lambda**

Location:

```
amplify/backend/function/ingestTrigger/
```

This Lambda contains **two logical functions**:

### **1. Extraction Function**
- triggered by S3 upload
- extracts text from documents
- normalizes metadata
- computes hashes
- prepares ingestion payload

### **2. Indexing Function**
- writes extracted content to OpenSearch
- updates search index
- ensures schema alignment
- handles retries and errors

The ingestion pipeline must stay aligned with:

- the docs domain
- duplicate prevention logic
- translator (orthography converter)
- Local‑Utilities
- schema changes

---

# **4. Local‑Utilities**

## **4.1 Purpose**

`Local-Utilities/` is a standalone Node project used for:

- running content extraction logic locally
- running orthography conversion locally
- debugging ingestion and conversion without redeploying Lambdas
- verifying that ingestion + conversion outputs match frontend expectations

It directly uses production code to ensure parity.

---

## **4.2 Layout**

```
Local-Utilities/
    localUtil.js
    package.json
    package-lock.json
    ReadMe.md
```

---

## **4.3 Translator (Orthography Converter) — bidirectional**

Even though the folder is named **Translator**, the behavior is:

### **BC Orthography ↔ AK Orthography**

- same language
- no semantic translation
- deterministic
- reversible
- rule‑based

Local‑Utilities must support:

- BC → AK
- AK → BC

This ensures:

- frontend translator hooks
- backend ingestion
- Local‑Utilities
- docs domain

…all stay aligned.

---

## **4.4 Alignment with ingestTrigger and domains**

Local‑Utilities mirrors:

- extraction logic
- orthography conversion logic
- document normalization rules
- duplicate detection rules

It directly imports production code to ensure functional parity.

---

# **5. Frontend Architecture (`src/`)**

## **5.1 `app/` — Application Infrastructure**

Contains:

- Redux store
- root reducer
- root saga
- middleware
- typed Redux Hooks

No domain logic lives here.

---

## **5.2 `UI/` — UI Domain**

Manages global UI state:

- loading
- blocking
- processing
- banners
- global flags

Files follow your naming:

```
UISlice.ts
UISaga.ts
UITypes.ts
UI.helpers.ts
UIUtilities.ts
```

Rendering lives in `globalUI/`.

---

## **5.3 `FileUploader/` — File Upload Domain**

Owns:

- upload slice
- upload saga
- upload types
- upload helpers
- domain-specific UI

Eventually replaces legacy Amplify uploader.

---

# **6. Domain Folders**

Domains include:

```
Author/
Box/
BoxUser/
collections/
docs/
Gyet/
Role/
Search/
User/
Translator/
```

Each domain uses:

```
DomainSlice.ts
DomainSaga.ts
DomainTypes.ts
Domain.helpers.ts
DomainUtilities.ts
```

### **Domain hooks live in domains**

Examples:

```
docs/useIfDocumentExists.ts
Translator/useTranslator.ts
Translator/useTranslationHandler.ts
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
    layout/
    widgets/
    misc/
    useSkipRender.ts
    FileUploader/
```

### layout/
Domain‑agnostic layout primitives.

### widgets/
Reusable UI widgets (e.g., `AWSFileUploader`).

### misc/
Rare shared components.

### useSkipRender.ts
The only UI‑layer hook.

### FileUploader/
Legacy imported Amplify UI code.

---

# **8. globalUI/**

Contains global visual components driven by domain state.

Example:

```
AlertBar/
```

No domain logic.

---

# **9. pages/**

## **Pages are UI screens mapped to URLs.
They are not reusable and may contain composition and base UI logic.**

Pages may include:

- widgets
- shared components
- domain UI
- static content
- layout
- simple UI logic
- error handling
- landing/donation flows

Pages should **not** contain domain business logic, slices, sagas, or domain rules.

Examples:

- `ErrorPage`
- `LandingPage`
- `DonationPage`
- `SearchPage`
- `DocumentPage`

Pages are the top‑level UI entrypoints for the router.

---

# **10. utils/**

Contains:

- domain‑agnostic helpers
- shared data

---

# **11. graphql/**

Amplify-generated operations.

Never edited manually.

---

# **12. types/**

Global shared types.

Domain types stay in domains.

---

# **13. `__utils__/` — Test Utilities**

Contains:

- test helpers
- fixtures
- builders
- domain‑aware mock data

Wrapped in `__` to mark as non‑runtime.

---

# **14. `__mocks__/` — Vitest Manual Mocks**

Vitest supports Jest‑style manual mocks.

This folder is optional and test‑only.

---

# **15. assets/**

Static files:

- images
- icons
- fonts
- PDFs

---

Got it, Tom — and this is exactly the kind of architectural tightening that pays dividends later.  
Let’s handle both things cleanly:

1. **Add capitalization rules to your Architecture doc** (in your voice, consistent with your repo’s reality)
2. **Fold the file‑rename normalization into the existing `docs → Document` story**, not as a separate story

No new story.  
No duplication.  
Just one unified, correct migration story.

---

# 🟦 1. Capitalization Rules for Your Architecture Doc
*(Written in your style, grounded in your actual tree)*

You can drop this directly into your Architecture Guide under “Naming Conventions” or “Folder Structure.”

---

## **Domain Folder Capitalization Rules**

Your repository uses capitalization to distinguish between **domain objects** and **application features**. These rules keep the folder structure intention‑revealing and predictable.

### **1. Capitalized folders represent Domain Objects**
These are nouns in the business domain. They typically have types, slices, sagas, rules, or relationships.

Examples from the repo:

```
Author/
Box/
BoxUser/
Gyet/
Role/
User/
Document/   (after rename)
```

Characteristics:

- Represent real entities in the system
- Contain domain logic (sagas, slices, types, rules)
- Use **PascalCase**
- Singular, not plural

### **2. Lowercase folders represent Features, Flows, or UI Routes**
These are workflows, pages, or application-level features.

Examples:

```
browse/
collections/
docs/        (before rename)
error/
graphql/
utils/
app/
```

Characteristics:

- Represent user flows or infrastructure
- Contain pages, components, or supporting logic
- Use **lowercase**
- Often plural because they represent lists or flows

### **3. Special-case domain slices**
Some folders represent global UI or cross-cutting concerns:

```
AlertBar/
FileUploader/
UI/
Search/
```

These follow the naming of the conceptual domain they represent.

### **4. New domains follow the same rule**
If it’s a domain object → **PascalCase**  
If it’s a feature/flow → **lowercase**


---

# **16. patches/**

## **patches/** — patch‑package overrides for `node_modules`

This folder contains patch files generated by **patch-package**.

### **Never edit patch files directly.**
Patch files are diffs — not source code.

### **Correct workflow:**

1. **Edit the actual file inside `node_modules`**  
   Example:
   ```
   node_modules/@aws-amplify/storage/dist/esm/providers/s3/index.js
   ```

2. Generate/update the patch:
   ```
   npx patch-package @aws-amplify/storage
   ```

3. patch-package writes the diff into:
   ```
   patches/@aws-amplify+storage+<version>.patch
   ```

4. **Run the `try-again` command**  
   Because Node aggressively caches patched modules, you must:

  - delete `node_modules`
  - reinstall dependencies
  - re-apply patches
  - clear all caches

   The `try-again` script, from `package.json` performs this entire sequence.

### **Paths to patched files (example)**

```
node_modules/@aws-amplify/storage/dist/esm/providers/s3/index.js
node_modules/@aws-amplify/storage/dist/esm/providers/s3/index.d.ts
node_modules/@aws-amplify/storage/src/providers/s3/index.ts
node_modules/@aws-amplify/storage/dist/esm/providers/s3/index.js.map
```

### **Appendix**

Detailed patch explanations live in patch-Appendix.

---

# **17. Double‑underscore folder convention**

`__name__` folders mark **non‑runtime namespaces**:

- `__utils__/`
- `__mocks__/`
- `__tests__/`

They keep runtime architecture clean.

---

# **18. testFiles/**

`testFiles/` contains real document fixtures used for:

- ingestion testing  
- extraction validation  
- hashing and duplicate‑detection tests  
- Local‑Utilities  
- ingestTrigger parity tests  

Rules:

- do not move or rename this folder  
- do not add unrelated files  
- do not delete existing fixtures  
- do not import these files into runtime code  

It exists at the root so ingestion tools can access it without involving the frontend build system.
