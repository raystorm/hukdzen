# Frontend Domains

Frontend domains live in `src/` and manage client-side concerns including UI state,
business logic, and user interactions.

---

## Frontend Domain Types

### 1. Entity Domains

Entity domains represent **real business objects** with persistent data,
relationships, and lifecycle management.

**Identifying characteristic:** Has Slice/Saga/Types structure.

**Characteristics:**
- Represent nouns in the business domain
- Have GraphQL schema definitions
- Contain Redux state management
- Have CRUD operations
- May have authorization rules
- Typically use **PascalCase** naming (singular)

**Required Structure:**
```
DomainName/
    DomainSlice.ts          — Redux state management (REQUIRED)
    DomainSaga.ts           — Async operations, business logic (REQUIRED)
    DomainTypes.ts          — Type definitions (REQUIRED)
    Domain.helpers.ts       — Optional utilities
    DomainUtilities.ts      — Optional utilities
    __tests__/              — Domain tests (REQUIRED)
```

**Current Entity Domains:**
- `Author/` - Content creators and contributors
- `Box/` - Permission containers (Xbiis in Smalgyax)
- `BoxRequest/` - Access request workflow
- `BoxUser/` - Link entity between Box and User
- `User/` - System users and authentication
- `docs/` - Document management (legacy lowercase naming)
- `collections/` - Collection management (legacy lowercase naming)

**Note:** `docs/` and `collections/` are entity domains with legacy
lowercase/plural naming. They have Slice/Saga/Types structure but
don't follow PascalCase convention. Not renamed due to refactoring cost.

---

### 2. Feature Domains

Feature domains represent **user-facing workflows** or application
features that orchestrate multiple entities.

**Identifying characteristic:** No Slice/Saga/Types structure.

**Characteristics:**
- Represent user flows or features
- May not have persistent data models
- Coordinate multiple entity domains
- Contain pages and UI components
- Use **lowercase** naming
- Often plural

**Typical Structure:**
```
featureName/
    FeaturePage.tsx         — Page components
    components/             — Feature-specific components
    __tests__/              — Feature tests
```

**Current Feature Domains:**
- `browse/` - Document browsing and discovery workflow
- `error/` - Error handling

---

### 3. Infrastructure Domains

Infrastructure domains provide **cross-cutting concerns** and global application services.

**Characteristics:**
- Support application-wide functionality
- Not tied to specific business entities
- Provide services to other domains
- May use PascalCase or lowercase

**Current Infrastructure Domains:**
- `AlertBar/` - Global notification system
- `FileUploader/` - File upload service
- `UI/` - Global UI state management
- `Search/` - Search functionality
- `Unsubscribe/` - Email unsubscribe workflow

---

### 4. Shared Type Domains

Minimal domains that define **shared interfaces** used across multiple
domains.

**Characteristics:**
- Define shared data structures
- No state management
- No business logic
- Only type definitions

**Structure:**
```
DomainName/
    DomainType.ts           — Type definitions only
    __tests__/              — Type tests (optional)
```

**Current Shared Type Domains:**
- `Content/` - Content interface (implemented by Document, Collection)
- `Role/` - Role types
- `Gyet/` - Clan types

---

### 5. List Subdomains

List subdomains provide **list views and management** for entity
domains.

**Characteristics:**
- Subdomain of parent entity
- Manage list display and operations
- Contain list-specific UI components
- May have list-specific state

**Naming Pattern:** `entityList` (camelCase)

**Current List Subdomains:**
- `authorList/` - Author list views and management
- `docList/` - Document list views and management
- `boxList/` - Box list views and management
- `userList/` - User list views and management (admin only)

**Purpose:**
- List display components
- Filtering and sorting UI
- Bulk operations
- List-specific state management

---

## Frontend Domain Rules

### CRITICAL: Domain Structure Requirements

All entity domains **MUST** follow the Slice/Saga/Types pattern:
- `DomainSlice.ts` - REQUIRED
- `DomainSaga.ts` - REQUIRED
- `DomainTypes.ts` - REQUIRED
- `__tests__/` - REQUIRED for all logic

**Prohibited:**
- ❌ `selectors.ts` files (use inline selectors or helpers)
- ❌ Folders for single files (no premature abstraction)

---

### Domain Boundaries

**1. Domain Types Stay in Domains**

Domain-specific types **MUST** live in `DomainTypes.ts` within the domain folder.

Global shared types go in `src/types/`.

**2. No Domain Logic in `app/`**

The `app/` folder contains only:
- Redux store configuration
- Root reducer
- Root saga
- Middleware
- Typed Redux hooks
- Auth event processor

**3. Domain UI Placement**

- **Tightly coupled UI** → Lives inside domain folder
- **Shared UI** → Lives in `components/`

When in doubt, start in the domain. Move to `components/` only when reused by multiple domains.

---

### Domain Hooks Location

**IMPORTANT:** Domain hooks should live **inside the domain folder**, not in `components/hooks/`.

**Current state:** Some hooks are in `components/hooks/` (migration in progress).

**Target state:** Move domain-specific hooks to their domains.

Shared, domain-agnostic hooks stay in `components/hooks/`.

---

## Current Frontend Domains

### Entity Domains

#### Author
**Purpose:** Content creators and contributors.

**Location:** `src/Author/`

---

#### Box (Xbiis)
**Purpose:** Permission containers for content access control.

**Location:** `src/Box/`

---

#### BoxRequest
**Purpose:** Access request workflow.

**Location:** `src/BoxRequest/`

---

#### BoxUser
**Purpose:** Link entity between Box and User.

**Location:** `src/BoxUser/`

---

#### User
**Purpose:** System users with authentication and profile management.

**Location:** `src/User/`

**User ID:** User.id is always the Cognito `sub` UUID.

**Why `sub` is used:**
- Cognito uses `sub` as the unique identifier for all authentication operations
- AppSync owner authorization compares the `sub` claim from JWT tokens with User.id
- Using `sub` as User.id enables direct ID matching without additional lookups or mapping logic

**Authentication:**
- For native Cognito users: username = email, User.id = Cognito `sub` UUID
- For social login users: username = provider ID (e.g., `google_123456`), User.id = Cognito `sub` UUID

**Important:** The username and User.id differ for social logins. Always use the `sub` claim for User.id.

---

#### docs (Document)
**Purpose:** Document management entity domain.

**Location:** `src/docs/`

**Note:** Entity domain with legacy lowercase naming.

---

#### collections (Collection)
**Purpose:** Collection management entity domain.

**Location:** `src/collections/`

**Note:** Entity domain with legacy lowercase naming.

---

### Feature Domains

#### browse
**Purpose:** Document browsing and discovery workflow.

**Location:** `src/browse/`

---

#### error
**Purpose:** Error handling and display.

**Location:** `src/error/`

---

### Infrastructure Domains

#### AlertBar
**Purpose:** Global notification system.

**Location:** `src/AlertBar/`

---

#### FileUploader
**Purpose:** File upload service.

**Location:** `src/FileUploader/`

---

#### UI
**Purpose:** Global UI state.

**Location:** `src/UI/`

---

#### Search
**Purpose:** Full-text search via OpenSearch.

**Location:** `src/Search/`

---

#### Unsubscribe
**Purpose:** Email unsubscribe workflow.

**Location:** `src/Unsubscribe/`

---

### Shared Type Domains

#### Content
**Purpose:** Shared interface for content items.

**Location:** `src/Content/`

---

#### Gyet
**Purpose:** Clan affiliation types.

**Location:** `src/Gyet/`

---

#### Role
**Purpose:** System roles and permissions.

**Location:** `src/Role/`

---

### List Subdomains

#### authorList
**Purpose:** Author list views and management.

**Location:** `src/authorList/`

---

#### docList
**Purpose:** Document list views and management.

**Location:** `src/docList/`

---

#### boxList
**Purpose:** Box list views and management.

**Location:** `src/boxList/`

---

#### userList
**Purpose:** User list views and management (admin only).

**Location:** `src/userList/`

---

## Frontend Domain Patterns

### Redux State Management
All entity domains use Redux Toolkit with:
- Slice for state management
- Saga for async operations
- Typed selectors
- Action creators

### Saga Patterns
- Async operations (API calls)
- Business logic orchestration
- Error handling
- Side effects

### Type Safety
- Generated types from GraphQL schema
- Domain-specific type definitions
- Strict TypeScript configuration

---

## Frontend Domain Anti-Patterns

### ❌ Don't Create `selectors.ts` Files
Use inline selectors or helpers instead.

### ❌ Don't Create Premature Abstractions
Don't create folders for single files.

### ❌ Don't Mix Domain Logic with App Infrastructure
Keep domain logic in domain folders, not in `app/`.

---

## Frontend Domain Best Practices

### ✅ Follow Slice/Saga/Types Pattern
All entity domains use consistent structure.

### ✅ Test All Logic
All sagas, reducers, and business logic require tests.

### ✅ Use Generated Types
Import types from `src/graphql/` for schema-defined data.

### ✅ Keep Hooks with Domains
Domain-specific hooks belong in domain folders.

### ✅ Minimal Dependencies
Domains should depend on as few other domains as possible.
