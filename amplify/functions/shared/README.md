# Shared Lambda Utilities

This directory contains code shared across multiple Lambda functions.

## Purpose and Boundaries

- Code here exists only to support Lambda functions.
- No handlers, business logic, or deployable artifacts belong in this folder.
- Utilities must remain single‑file, self‑contained, and safe to reference in multiple Lambdas.
- Importing external libraries is allowed.
- A utility may import from within this folder, but imported files must have zero dependencies.

## How It Works

Amplify Gen 2 uses esbuild to bundle Lambda functions.
When a Lambda imports from this directory,
the bundler automatically includes the referenced files
in that Lambda's deployment package.

Each Lambda gets its own bundled copy at deploy time,
so they remain independent while sharing the same source code.

## Benefits

- Shared utilities live in one place instead of being duplicated across Lambdas.
- Utilities are copied and bundled with each Lambda at build time, without relying on a shared location.
- Updating a utility updates all Lambdas on their next deploy.


## Utilities

### `logger.ts`
Sanitized logging utility used by all Lambda functions.

**Required Libraries:**
- NONE

**Usage:**
```ts
import { logger } from '../shared/logger';

logger.info('Message');
logger.error('Error', error);
```

---

### `graphql.ts`
Minimal server‑side GraphQL client for Lambda → AppSync calls using IAM + SigV4.

**Required Libraries:**
- `@aws-sdk/signature-v4`
- `@aws-sdk/protocol-http`
- `@aws-sdk/credential-provider-node`
- `@aws-crypto/sha256-js`

**Usage:**
```ts
import { graphql } from '../shared/graphql';

const result = await graphql(query, variables);
```
