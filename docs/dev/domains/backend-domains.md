# Backend Domains

Backend domains live in `amplify/data/` and define the data layer including GraphQL schema,
authorization rules, and custom resolvers.

---

## Backend Domain Types

### 1. Model Domains

Model domains represent **persistent data types** stored in DynamoDB
with full CRUD operations.

**Characteristics:**
- Use `@model` directive in GraphQL schema
- Auto-generate DynamoDB table
- Auto-generate basic CRUD operations
- Support authorization rules via `@auth`
- Support relationships via `@hasOne`, `@hasMany`, `@belongsTo`
- Support indexes via `@index`

**Structure:**
```
amplify/data/DomainName/
    DomainName.graphql      — Schema definition with @model
    createDomainGuarded.js  — Custom create resolver (optional)
    updateDomainGuarded.js  — Custom update resolver (optional)
    resource.ts             — CDK wiring for custom resolvers
    __tests__/              — Guard resolver tests
```

**Current Model Domains:**
- `Author/` - Content creators
- `Box/` - Permission containers (Xbiis)
- `BoxRequest/` - Access requests
- `BoxUser/` - Box membership
- `User/` - System users
- `Document/` - Content items
- `Collection/` - Grouped content
- `CollectionItem/` - Collection members

**Guard Resolvers:**
Some model domains use guard resolvers to validate input before
database operations.

**Pattern:** `createDomainGuarded`, `updateDomainGuarded`

**Purpose:**
- Required field enforcement
- Conditional field validation
- Business rule enforcement
- Input sanitization

---

### 2. Custom Query Domains

Custom query domains define **query/mutation operations and response
types** without `@model` storage.

**Characteristics:**
- Define custom query or mutation operations
- Define response types (not stored in DynamoDB)
- Backed by Lambda functions
- No auto-generated CRUD operations

**Structure:**
```
amplify/data/
    DomainName.graphql      — Query/mutation definitions and types
```

**Current Custom Query Domains:**
- `Search` - OpenSearch queries with SearchResults/SearchResultItem
  types

---

### 3. Interface Domains

Interface domains define **shared contracts** implemented by multiple
model types.

**Characteristics:**
- Use `interface` keyword in GraphQL
- Define common fields across types
- Implemented by model types
- No table of their own

**Structure:**
```
amplify/data/
    InterfaceName.graphql   — Interface definition only
```

**Current Interface Domains:**
- `Content` - Implemented by Document and Collection
- `Gyet` - Implemented by Author and User

---

### 4. Enum Domains

Enum domains define **fixed sets of values** used across the schema.

**Characteristics:**
- Use `enum` keyword in GraphQL
- Provide type safety for constrained values
- Used in model fields
- No table or resolvers

**Structure:**
```
amplify/data/
    EnumName.graphql        — Enum definition only
```

**Current Enum Domains:**
- `AccessLevel` - Permission levels (NONE, READ, WRITE)
- `Clan` - Smalgyax clans (GANHADA, LAXSGIIK, GITSBUTWADA, LAXGIBU)

---

## Backend Domain Structure Patterns

### Minimal Domain (Enum/Type)
```
amplify/data/
    DomainName.graphql      — Definition only
```

### Standard Model Domain
```
amplify/data/DomainName/
    DomainName.graphql      — Schema with @model
```

### Model with Guards
```
amplify/data/DomainName/
    DomainName.graphql      — Schema with @model
    createDomainGuarded.js  — Create validation
    updateDomainGuarded.js  — Update validation
    resource.ts             — CDK wiring
    __tests__/              — Guard tests
```

### Model with Guards and Custom Queries
```
amplify/data/DomainName/
    DomainName.graphql      — Schema with @model + custom queries
    createDomainGuarded.js  — Create validation
    updateDomainGuarded.js  — Update validation
    resource.ts             — CDK wiring
    __tests__/              — Tests
```

---

## Backend Domain Authorization Patterns

### Private Access (Default)
Only authenticated users can access.

### Private + IAM Access
Authenticated users + Lambda functions (via IAM) can access.

### Custom Query Authorization
Specific authorization directives for custom queries.

---

## Backend Domain Relationships

### One-to-One (@hasOne)
One entity references another entity.

**Example:** Document has one Author

### One-to-Many (@hasMany)
One entity has multiple related entities.

**Example:** Collection has many CollectionItems

### Many-to-One (@belongsTo)
Multiple entities reference one parent entity.

**Example:** CollectionItem belongs to one Collection

---

## Backend Domain Indexes

Indexes enable efficient queries by non-primary-key fields.

**Common Index Patterns:**
- `byOwner` - Query by owner user ID
- `byBox` - Query by box ID
- `byAuthor` - Query by author ID
- `byUser` - Query by user ID
- `byEmail` - Query by email address
- `byCollection` - Query by collection ID

---

## Current Backend Domains

### Model Domains

**Note:** Some model domains include guard resolvers for validation.
See "Guard Resolvers" section under Model Domains type definition.

#### Author
**Schema:** `amplify/data/Author/Author.graphql`

Content creators. Implements Gyet interface.

---

#### Box (Xbiis)
**Schema:** `amplify/data/Box/Box.graphql`

Permission containers for content access control.

---

#### BoxRequest
**Schema:** `amplify/data/BoxRequest/BoxRequest.graphql`

Access requests for boxes requiring approval.

---

#### BoxUser
**Schema:** `amplify/data/BoxUser/BoxUser.graphql`

Box membership and user access levels.

---

#### User
**Schema:** `amplify/data/User/User.graphql`

System users. Implements Gyet interface.

---

#### Document
**Schema:** `amplify/data/Document/Document.graphql`

Content items with multilingual metadata. Implements Content interface.

---

#### Collection
**Schema:** `amplify/data/Collection/Collection.graphql`

Grouped content items. Implements Content interface.

---

#### CollectionItem
**Schema:** `amplify/data/Collection/Collection.graphql`

Collection members (documents or nested collections).

---

### Interface Domains

#### Content
**Schema:** `amplify/data/Content.graphql`

Shared structure for content items with multilingual metadata.
Implemented by Document and Collection.

---

#### Gyet
**Schema:** `amplify/data/Gyet.graphql`

Shared structure for people with cultural clan affiliation.
Implemented by Author and User.

---

### Enum Domains

#### AccessLevel
**Schema:** `amplify/data/AccessLevel.graphql`

Permission levels: NONE, READ, WRITE.

---

#### Clan
**Schema:** `amplify/data/Gyet.graphql`

Smalgyax clans: GANHADA (Raven), LAXSGIIK (Eagle), GITSBUTWADA
(Killer Whale), LAXGIBU (Wolf).

---

### Custom Query Domains

#### Search
**Schema:** `amplify/data/Search.graphql`

OpenSearch queries with permission filtering. Defines SearchResults
and SearchResultItem types. Backed by searchRunner Lambda.

---

## Backend Domain Rules

### Schema-First Development
**CRITICAL:** When adding new domain types that will be stored/queried:

1. Define the type in GraphQL schema first
2. Run codegen to generate TypeScript types
3. Use generated types from `src/graphql/`

**Never create TypeScript types independently for data that will be stored/queried.**

---

### Generated Code Protection
**CRITICAL:** Never edit `src/graphql/` files.

These files are:
- Auto-generated by Amplify
- Overwritten on each codegen
- Consumed by sagas and domains

If you need to modify GraphQL operations:
1. Update the schema in `amplify/data/`
2. Run codegen to regenerate
3. Use the generated operations

---

### Modular Schema Structure
The GraphQL schema is modular - domain-specific files are composed.

The root schema file is an empty shell that imports domain files.

When adding a new domain:
1. Create domain schema file
2. Import it in root schema
3. Run codegen

---

## Backend Domain Anti-Patterns

### ❌ Don't Edit Generated Files
Never manually edit `src/graphql/` files.

### ❌ Don't Create Types Outside Schema
For stored data, schema is source of truth.

### ❌ Don't Skip Guard Resolver Tests
All guard resolvers require tests.

---

## Backend Domain Best Practices

### ✅ Schema-First Development
Define data models in GraphQL schema first.

### ✅ Guard Resolvers for Validation
Use guard resolvers for complex validation logic.



### ✅ Test All Resolvers
All custom resolvers require tests.

### ✅ Modular Schema Organization
Keep domain schemas in separate files.
