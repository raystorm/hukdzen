# Shared Lambda Utilities

This directory contains code shared across multiple Lambda functions.

## Purpose and Boundaries

- Code here exists only to support Lambda functions.
- No handlers, business logic, or deployable artifacts belong in this folder.
- Files must stay simple, pure, and safe to reference in multiple Lambdas.
- If a utility file has its own dependency chain,
  it no longer belongs in this library.

## How It Works

Amplify Gen 2 uses esbuild to bundle Lambda functions.
When a Lambda imports from this directory,
the bundler automatically includes the referenced files
in that Lambda's deployment package.

Each Lambda gets its own bundled copy at deploy time,
so they remain independent while sharing the same source code.

## Usage

From any Lambda function:

```javascript
const { logger } = require('../shared/logger');

logger.info('Message');
logger.error('Error', error);
```

## Benefits

- Single source of truth for shared utilities
- No Lambda Layers needed
- Update once, all Lambdas get the change on next deploy
- Each Lambda remains independently deployable
- No runtime dependencies between Lambdas

## Files

- `logger.js` - Sanitized logging utility used by all Lambda functions
