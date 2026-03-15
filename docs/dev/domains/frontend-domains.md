# Frontend Domains

Frontend domains live in `src/` and manage client-side concerns including UI state, business logic, and user interactions.

---

## Frontend Domain Types

### 1. Entity Domains (PascalCase)

Entity domains represent **real business objects** with persistent data, relationships, and lifecycle management.

**Characteristics:**
- Represent nouns in the business domain
- Have GraphQL schema definitions
- Contain Redux state management
- Have CRUD operations
- May have authorization rules
- Use **PascalCase** naming
- Singular form

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
- `BoxUser/` - Box membership and permissions
- `User/` - System users and authentication

---

### 2. Feature Domains (lowercase)

Feature domains represent **user-facing workflows** or application features that orchestrate multiple entities.

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
    featureSlice.ts         — UI state (optional)
    featureSaga.ts          — Workflow orchestration (optional)
    featureTypes.ts         — Feature-specific types
    __tests__/              — Feature tests
```

**Current Feature Domains:**
- `browse/` - Document browsing and discovery workflow
- `collections/` - Collection management feature
- `docs/` - Document management feature
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

Minimal domains that define **shared interfaces** used across multiple domains.

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
**Purpose:** Manages content creators and contributors.

**Location:** `src/Author/`

**Responsibilities:**
- Author CRUD operations
- Author list management
- Author form handling
- Author selection

---

#### Box (Xbiis)
**Purpose:** Permission containers that group content and control access.

**Location:** `src/Box/`

**Responsibilities:**
- Box detail display
- Box membership management
- Permission level handling
- Box purpose management (PUBLIC, PRIVATE, SHARED)

**Business Rules:**
- Default box for public content
- Owner-based permissions
- Purpose-based behavior

---

#### BoxRequest
**Purpose:** Manages access requests to boxes.

**Location:** `src/BoxRequest/`

**Responsibilities:**
- Request creation
- Request approval/denial workflow
- Request list management
- Request detail display

**Workflow:**
1. User requests access to box
2. Box owner reviews request
3. Owner approves/denies
4. BoxUser created on approval

---

#### BoxUser
**Purpose:** Represents box membership and user permissions within a box.

**Location:** `src/BoxUser/`

**Responsibilities:**
- Box membership management
- Permission level assignment
- User access control
- Membership list display

**Relationships:**
- Links User to Box
- Defines AccessLevel (READ, WRITE, ADMIN)

---

#### User
**Purpose:** System users with authentication and profile management.

**Location:** `src/User/`

**Responsibilities:**
- User profile management
- Email preferences
- Admin role detection
- Current user state
- User list (admin only)

**Special Features:**
- Email notification preferences
- Admin role detection
- Current user state management

---

### Feature Domains

#### browse
**Purpose:** Document browsing and discovery workflow.

**Location:** `src/browse/`

**Features:**
- Grid/list view toggle
- Filtering by metadata
- Sorting options
- Sidebar navigation

**State:** Browse preferences, filters, view mode

---

#### collections
**Purpose:** Collection management feature.

**Location:** `src/collections/`

**Features:**
- Collection creation/editing
- Item management
- Collection display
- Modal forms

---

#### docs
**Purpose:** Document management feature.

**Location:** `src/docs/`

**Features:**
- Document list views
- Document detail pages
- Document operations
- Document metadata management

---

#### error
**Purpose:** Error handling and display.

**Location:** `src/error/`

**Features:** Error state management

---

### Infrastructure Domains

#### AlertBar
**Purpose:** Global notification system.

**Location:** `src/AlertBar/`

**Features:**
- Success/error/info/warning alerts
- Auto-dismiss
- Queue management

**State:** Alert messages, visibility

---

#### FileUploader
**Purpose:** File upload service.

**Location:** `src/FileUploader/`

**Features:**
- S3 upload orchestration
- Progress tracking
- Metadata collection
- Document creation

**State:** Upload progress, status

---

#### UI
**Purpose:** Global UI state.

**Location:** `src/UI/`

**State:**
- Loading indicators
- Blocking overlays
- Processing flags
- Global banners

---

#### Search
**Purpose:** Full-text search via OpenSearch.

**Location:** `src/Search/`

**Features:**
- Keyword search
- Field-specific search
- Permission filtering
- Pagination
- Relevance ranking

**Backend Integration:** searchRunner Lambda

---

#### Unsubscribe
**Purpose:** Email unsubscribe workflow.

**Location:** `src/Unsubscribe/`

**Features:**
- Token-based unsubscribe
- Email preference updates

---

### Shared Type Domains

#### Content
**Purpose:** Shared interface for content items.

**Location:** `src/Content/`

**Implemented By:**
- Document
- Collection

**Structure:**
- Multilingual titles/descriptions (eng, bc, ak)
- Owner relationship
- Box relationship
- Timestamps

**Utilities:**
- Content display helpers
- Summary builders
- Content comparison

---

#### Gyet
**Purpose:** Clan affiliation types.

**Location:** `src/Gyet/`

**Used By:**
- Author
- User

**Cultural Context:** Smalgyax clan system

---

#### Role
**Purpose:** System roles and permissions.

**Location:** `src/Role/`

**Usage:** Authorization and access control

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
