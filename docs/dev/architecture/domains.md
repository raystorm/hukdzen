# Domain Reference Guide

## What is a Domain?

A **domain** represents a distinct area of business logic, data,
and behavior in the Smalgyax-Files application.
Domains are first-class architectural units that encapsulate related functionality
and provide clear boundaries for code organization.

Domains exist across three layers:
- **Frontend** (`src/`) - UI state, business logic, user interactions
- **Backend** (`amplify/data/`) - Data models, authorization, persistence
- **Lambda** (`amplify/functions/`) - Async processing, integrations, workflows

---

## Domain Principles

### Schema-First Development
The GraphQL schema is the source of truth for data models.
Frontend types are generated from backend schema definitions.

### Domain Boundaries
Each domain owns its data, logic, and rules. Domains should depend on as few other domains as possible.

### Folder Existence
Folders exist only when they earn their existence. No premature abstraction or unnecessary hierarchy.

### Consistent Structure
All domains of the same type follow consistent structural patterns for predictability and maintainability.

---

## Domain Types

### Frontend Domains
Frontend domains live in `src/` and manage client-side concerns.

**Types:**
- **Entity Domains** (PascalCase) - Business objects with state and logic
- **Feature Domains** (lowercase) - User workflows and features
- **Infrastructure Domains** - Cross-cutting services
- **Shared Type Domains** - Common interfaces

See [Frontend Domains](./domains/frontend-domains.md) for details.

---

### Backend Domains
Backend domains live in `amplify/data/` and define the data layer.

**Types:**
- **Model Domains** - Persistent data with DynamoDB tables
- **Interface Domains** - Shared contracts across types
- **Enum Domains** - Fixed value sets
- **Type Domains** - Embedded data structures
- **Custom Resolver Domains** - Validation and permission logic

See [Backend Domains](./domains/backend-domains.md) for details.

---

### Lambda Domains
Lambda domains live in `amplify/functions/` and handle async processing.

**All Lambdas are, by definition, their own domain.**

**Types:**
- **Event-Driven Lambdas** - Triggered by AWS events
- **Custom Resolver Lambdas** - AppSync query/mutation handlers
- **Scheduled Lambdas** - Periodic tasks
- **Integration Lambdas** - External service connections

See [Lambda Domains](./domains/lambda-domains.md) for details.

---

## Current Domains

### Entity Domains (Frontend + Backend)
- **Author** - Content creators and contributors
- **Box** (Xbiis) - Permission containers for content grouping
- **BoxRequest** - Access request workflow
- **BoxUser** - Box membership and permissions
- **User** - System users and authentication
- **Document** - Core content items (uploaded files)
- **Collection** - Curated groups of documents
- **CollectionItem** - Collection membership links

### Feature Domains (Frontend)
- **browse** - Document browsing and discovery
- **collections** - Collection management
- **docs** - Document management
- **error** - Error handling

### Infrastructure Domains (Frontend)
- **AlertBar** - Global notifications
- **FileUploader** - File upload service
- **UI** - Global UI state
- **Search** - Full-text search

### Shared Type Domains
- **Content** - Interface for content items (Document, Collection)
- **Gyet** - Interface for people with clan affiliation (Author, User)
- **Role** - System roles and permissions

### Lambda Domains (Backend)
- **ingestTrigger** - Document ingestion and processing
- **searchRunner** - OpenSearch query execution
- **emailNotifier** - Transactional email delivery
- **emailPreferenceManager** - Email opt-out handling
- **indexInit** - OpenSearch index initialization
- **seedLoader** - Database seeding for development
- **BoxRequestHydrator** - BoxRequest relationship hydration
- **BoxUserHydrator** - BoxUser relationship hydration

---

## Domain Interactions

### Cross-Domain Relationships

**Document Relationships:**
- Document → Author (content creator)
- Document → Box (permission container)
- Document → User (owner)

**Collection Relationships:**
- Collection → CollectionItem (members)
- CollectionItem → Document (referenced content)
- CollectionItem → Collection (nested collections)

**Permission Relationships:**
- BoxUser → Box + User (membership)
- BoxRequest → Box + User (access request)

**Search Integration:**
- Search → Document (indexed content)
- Search → Box (permission filtering)

**Email Integration:**
- emailNotifier → User (recipient)
- emailNotifier → BoxRequest (notifications)
- emailPreferenceManager → User (opt-out management)

### Domain Dependencies

**High-level domains depend on low-level domains:**
```
browse → docs → Document → Box, Author, User
collections → Collection → Document → Box, Author, User
FileUploader → Document → Box, Author, User
Search → Document, Collection → Box, User
```

**Lambda domains depend on data domains:**
```
ingestTrigger → Document → Box, Author, User
searchRunner → Document, Collection → Box, User
emailNotifier → User, BoxRequest
```

**Infrastructure domains are independent:**
```
AlertBar (no dependencies)
UI (no dependencies)
```

---

## Domain Naming Conventions

### PascalCase = Domain Objects
Domain objects representing business entities use PascalCase:
- `Author/`
- `Box/`
- `BoxRequest/`
- `BoxUser/`
- `User/`

### lowercase = Features/Flows
Application features and workflows use lowercase:
- `browse/`
- `collections/`
- `docs/`
- `error/`

### camelCase = Lambda Functions
Lambda functions use camelCase:
- `ingestTrigger/`
- `searchRunner/`
- `emailNotifier/`

### Special Cases
Global UI or cross-cutting concerns may use PascalCase:
- `AlertBar/`
- `FileUploader/`
- `UI/`
- `Search/`

---

## Adding a New Domain

### Entity Domain Checklist

1. **Define GraphQL schema** in `amplify/data/DomainName/`
2. **Run codegen** to generate TypeScript types
3. **Create frontend domain folder** `src/DomainName/`
4. **Wire up Redux** (add slice and saga to app)
5. **Create tests** for all logic
6. **Update documentation** (add to this file and domain type files)

### Feature Domain Checklist

1. **Create feature folder** `src/featureName/`
2. **Wire up routing** (if page-based)
3. **Create tests**
4. **Update documentation**

### Lambda Domain Checklist

1. **Create Lambda folder** `amplify/functions/lambdaName/`
2. **Define infrastructure** in `infra/`
3. **Implement handler** in `src/`
4. **Create tests** in `src/__tests__/`
5. **Wire up triggers** (event sources, schedules, etc.)
6. **Update documentation**

---

## Domain Anti-Patterns

### ❌ Don't Create Premature Abstractions
Don't create folders for single files or add patterns until second use case appears.

### ❌ Don't Mix Domain Logic with UI Infrastructure
Keep domain logic in domain folders, UI infrastructure in `components/`.

### ❌ Don't Create Types Outside Schema
For stored data, schema is source of truth. Use generated types.

### ❌ Don't Edit Generated Files
Never edit `src/graphql/` files. Update schema and regenerate instead.

---

## Domain Best Practices

### ✅ Schema-First Development
Define data models in GraphQL schema before creating frontend types.

### ✅ Clear Domain Boundaries
Each domain owns its data, logic, and rules.

### ✅ Minimal Dependencies
Domains should depend on as few other domains as possible.

### ✅ Test Coverage
All domain logic requires tests.

### ✅ Consistent Naming
Follow naming conventions for predictability.

### ✅ Domain Hooks in Domain Folders
Keep domain-specific hooks with their domains (migration in progress).

---

## Summary

**Domains are the primary organizational unit in Smalgyax-Files.**

- **Frontend domains** manage UI state and user interactions
- **Backend domains** define data models and authorization
- **Lambda domains** handle async processing and integrations

All domains follow consistent structure rules and maintain clear boundaries.
The GraphQL schema is the source of truth for data models,
and domains encapsulate all related logic, state, and behavior.

---

## See Also

- [Frontend Domains](./domains/frontend-domains.md) - Frontend domain types and structure
- [Backend Domains](./domains/backend-domains.md) - Backend domain types and structure
- [Lambda Domains](./domains/lambda-domains.md) - Lambda domain types and structure
- [Architecture Overview](./architecture.md) - Full system architecture
- [Backend Development Guide](./contributing/backend-development.md) - How to add and configure backend resources
