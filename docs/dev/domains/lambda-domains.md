# Lambda Domains

**All Lambdas are, by definition, their own domain.**

Lambda domains live in `amplify/functions/` and handle async processing, integrations, and workflows that don't fit in synchronous GraphQL operations.

---

## Standard Lambda Structure

All Lambda functions follow this consistent structure:

```
amplify/functions/lambdaName/
    infra/
        resource.ts       — Lambda definition
        backend.ts        — Configuration (IAM, env vars, data sources)
        monitoring.ts     — Optional alarms and resource monitoring
    src/
        index.ts          — Lambda handler entry point
        __tests__/        — Unit tests
    package.json          — Dependencies
    tsconfig.json         — TypeScript configuration
    jest.config.js        — Test configuration
```

**Meaning:**
- `infra/` owns everything required for the Lambda to exist (definition, IAM, environment, data sources, monitoring)
- `src/` owns everything required for the Lambda to run (handler, helpers, tests)

This structure ensures each Lambda owns everything it needs to exist, run, and be monitored — without depending on other domains.

---

## Lambda Domain Organization

Lambdas are organized by the domain they serve:

**Data Domain Lambdas** (`amplify/functions/data/`)
- Custom resolvers for GraphQL operations
- Relationship hydration
- Complex query logic
- Future: guards, validators, computed fields

**Search Domain Lambdas** (`amplify/functions/searchRunner/`, `amplify/functions/ingestTrigger/`, `amplify/functions/indexInit/`)
- OpenSearch query execution
- Document indexing
- Index initialization

**Email Domain Lambdas** (`amplify/functions/email*/`)
- Email delivery
- Preference management
- Bounce/complaint handling

**Utility Lambdas** (`amplify/functions/`)
- Infrastructure setup
- Data seeding
- Administrative tasks

---

## Lambda Domain Types

### 1. Data Domain Lambdas

Data domain Lambdas handle **GraphQL custom resolvers** for complex operations beyond auto-generated resolvers.

**Location:** `amplify/functions/data/`

**Characteristics:**
- Invoked by GraphQL operations
- Handle complex queries requiring joins or computed fields
- Apply permission-aware filtering
- Return GraphQL-compatible responses

**Current Data Domain Lambdas:**
- `BoxRequestHydrator` - Hydrates BoxRequest relationships
- `BoxUserHydrator` - Hydrates BoxUser relationships

**Future Capabilities:**
- Guard resolvers (validation)
- Computed field resolvers
- Cross-domain aggregations

---

### 2. Search Domain Lambdas

Search domain Lambdas handle **OpenSearch integration** for full-text search.

**Location:** `amplify/functions/searchRunner/`, `amplify/functions/ingestTrigger/`, `amplify/functions/indexInit/`

**Characteristics:**
- Query execution with permission filtering
- Document indexing on upload
- Index initialization and configuration

**Current Search Domain Lambdas:**
- `searchRunner` - OpenSearch query execution with permission filtering
- `ingestTrigger` - Document processing and indexing
- `indexInit` - OpenSearch index initialization

---

### 3. Email Domain Lambdas

Email domain Lambdas handle **email delivery and preference management**.

**Location:** `amplify/functions/email*/`

**Characteristics:**
- Integrate with SES
- Handle email events (bounces, complaints)
- Manage user preferences
- Track delivery status

**Current Email Domain Lambdas:**
- `emailNotifier` - Transactional email delivery via SES
- `emailPreferenceManager` - Email opt-out and bounce handling

---

### 4. Utility Lambdas

Utility Lambdas handle **infrastructure setup and administrative tasks**.

**Location:** `amplify/functions/`

**Characteristics:**
- Run on-demand or on schedule
- Handle setup and maintenance
- Support all environments
- Not part of user workflows

**Current Utility Lambdas:**
- `indexInit` - OpenSearch index initialization
- `seedLoader` - Database seeding for all environments

---

## Lambda Domain Structure

See "Standard Lambda Structure" above. All Lambda functions follow this consistent pattern.

### Shared Lambda Code
```
amplify/functions/shared/
    graphql.ts          — GraphQL client for Lambda → AppSync
    logger.ts           — Sanitized logging utility
    types/              — Shared type definitions
    graphql/            — GraphQL operation definitions
    __tests__/          — Shared utility tests
```

**Purpose:** Code shared across multiple Lambda functions to ensure DRY principle and consistent patterns.

**How It Works:** Amplify Gen2 uses esbuild to bundle Lambda functions. When a Lambda imports from shared, the bundler includes referenced files in that Lambda's deployment package.

---

## Current Lambda Domains

### Data Domain Lambdas

#### BoxRequestHydrator
**Location:** `amplify/functions/data/BoxRequestHydrator/`

Hydrates BoxRequest relationships for detailed GraphQL queries.
Fetches related User and Box records and applies permission filtering.

---

#### BoxUserHydrator
**Location:** `amplify/functions/data/BoxUserHydrator/`

Hydrates BoxUser relationships for detailed GraphQL queries.
Fetches related User and Box records and applies permission filtering.

---

### Search Domain Lambdas

#### searchRunner
**Location:** `amplify/functions/searchRunner/`

Executes OpenSearch queries with permission-based filtering.
Admin users search all boxes, non-admin users are filtered to accessible boxes only.

---

#### ingestTrigger
**Location:** `amplify/functions/ingestTrigger/`

Triggered by DynamoDB Stream events. Processes document metadata, extracts text content,
converts orthography (BC ↔ AK), generates content hash for deduplication,
and indexes document in OpenSearch with keywords.

---

#### indexInit
**Location:** `amplify/functions/indexInit/`

Initializes OpenSearch indexes on first deployment. Creates indexes,
configures mappings, and sets up analyzers for multilingual search.

---

### Email Domain Lambdas

#### emailNotifier
**Location:** `amplify/functions/emailNotifier/`

Sends transactional emails via SES. Handles box request notifications,
collaboration invitations, and system notifications. Generates JWT-based unsubscribe URLs.

---

#### emailPreferenceManager
**Location:** `amplify/functions/emailPreferenceManager/`

Processes SES bounce and complaint events. Updates user email preferences and tracks soft bounce counts.
Hard bounces and complaints result in permanent opt-out.

---

### Utility Lambdas

#### seedLoader
**Location:** `amplify/functions/seedLoader/`

Seeds required environment data for all environments.
Creates System User, Unknown Author, and Default Box records needed for proper application operation.

---

## Lambda Domain Patterns

### Shared Utilities
All Lambdas use shared utilities from `amplify/functions/shared/`:
- GraphQL client for Lambda → AppSync communication
- Logger for sanitized logging
- Shared type definitions
- Common GraphQL operations

### Error Handling
All Lambdas implement consistent error handling:
- Try/catch blocks for async operations
- Sanitized error logging
- Appropriate error responses
- CloudWatch logging

### Testing
All Lambdas require unit tests:
- Handler tests
- Business logic tests
- Integration tests (where applicable)
- Mock external dependencies

### Infrastructure as Code
All Lambdas define infrastructure in CDK:
- Event sources
- Permissions (IAM roles)
- Environment variables
- Resource dependencies

---

## Lambda Domain Rules

### CRITICAL: Lambda Structure Requirements

All Lambda domains **MUST** follow the standard structure:
- `infra/` - CDK infrastructure (REQUIRED)
- `src/` - Handler and logic (REQUIRED)
- `src/__tests__/` - Unit tests (REQUIRED)
- `package.json` - Dependencies (REQUIRED)
- `tsconfig.json` - TypeScript config (REQUIRED)
- `jest.config.js` - Test config (REQUIRED)

---

### Shared Code Usage

**Use shared utilities for:**
- GraphQL client (Lambda → AppSync)
- Logging
- Common type definitions
- Shared GraphQL operations

**Benefits:**
- DRY principle
- Consistent patterns
- Easier maintenance
- Type safety

---

### Testing Requirements

All Lambda functions require:
- Unit tests for handler
- Unit tests for business logic
- Mock external dependencies
- Test coverage for error paths

---

### Infrastructure Definition

All Lambda infrastructure must be defined in CDK:
- Event sources (S3, EventBridge, etc.)
- IAM permissions
- Environment variables
- Resource dependencies
- Timeout and memory configuration

---

## Lambda Domain Integration

### Lambda → AppSync
Lambdas use shared GraphQL client to query/mutate AppSync API:
- IAM authentication
- SigV4 signing
- Type-safe operations

### Lambda → DynamoDB
Lambdas access DynamoDB via:
- IAM permissions
- AWS SDK
- Direct table access (not through AppSync)

### Lambda → OpenSearch
Lambdas access OpenSearch via:
- IAM permissions
- OpenSearch client
- Direct index access

### Lambda → S3
Lambdas access S3 via:
- IAM permissions
- AWS SDK
- Event triggers (for ingestTrigger)

### Lambda → SES
Lambdas access SES via:
- IAM permissions
- AWS SDK
- Event notifications (for emailPreferenceManager)

---

## Lambda Domain Anti-Patterns

### ❌ Don't Put Business Logic in Infrastructure
Keep business logic in `src/`, infrastructure in `infra/`.

### ❌ Don't Duplicate Shared Code
Use `amplify/functions/shared/` for common utilities.

### ❌ Don't Skip Tests
All Lambda functions require unit tests.

### ❌ Don't Hardcode Configuration
Use environment variables for configuration.

---

## Lambda Domain Best Practices

### ✅ Use Shared Utilities
Leverage shared code for consistency.

### ✅ Sanitize Logs
Use shared logger to avoid leaking sensitive data.

### ✅ Test All Paths
Test success paths, error paths, and edge cases.

### ✅ Define Infrastructure in CDK
All infrastructure as code in `infra/`.

### ✅ Handle Errors Gracefully
Implement proper error handling and logging.

### ✅ Keep Handlers Thin
Move business logic to separate modules for testability.

---

## Adding a New Lambda Domain

### Lambda Domain Checklist

1. **Create Lambda folder** `amplify/functions/lambdaName/`
2. **Define infrastructure** in `infra/resource.ts`
   - Event sources
   - IAM permissions
   - Environment variables
3. **Implement handler** in `src/index.ts`
4. **Create tests** in `src/__tests__/`
5. **Add dependencies** to `package.json`
6. **Configure TypeScript** in `tsconfig.json`
7. **Configure tests** in `jest.config.js`
8. **Wire up triggers** (event sources, schedules, API routes)
9. **Update documentation** (add to this file)

---

## Lambda Domain Dependencies

### Lambda → Data Domains
Lambdas depend on data domains for:
- GraphQL operations
- Type definitions
- Business rules

### Lambda → Lambda
Some Lambdas may invoke other Lambdas:
- Async workflows
- Event chains
- Service orchestration

### Lambda → External Services
Lambdas integrate with external services:
- OpenSearch (search)
- SES (email)
- S3 (storage)

---

## Summary

**Lambda domains handle async processing and integrations.**

Lambdas are organized by domain:
- **Data domain Lambdas** implement custom GraphQL resolvers
- **Search domain Lambdas** handle OpenSearch integration (query, indexing, initialization)
- **Email domain Lambdas** manage email delivery and preferences
- **Utility Lambdas** handle infrastructure and administrative tasks

All Lambda domains follow consistent structure, use shared utilities, and require comprehensive testing.
