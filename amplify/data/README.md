# Amplify Data Layer

## GraphQL Schema

The schema is split into domain-specific files using `# import` statements.
Each `@model` domain has its own folder containing:

- GraphQL schema definition
- Custom resolvers (queries, mutations)
- Guard resolvers for validation
- Tests for resolvers

## Guard Resolver Tests

Guard resolvers enforce validation rules at the API level.
Tests for these resolvers live in `__tests__/` folders next to the resolver code:

```
amplify/data/BoxUser/
├── BoxUser.graphql
├── createBoxUserGuarded.js
├── updateBoxUserGuarded.js
└── __tests__/
    ├── createBoxUserGuarded.test.js
    └── updateBoxUserGuarded.test.js
```

### Running Tests

The test runner lives in `amplifyTests/` at the repo root:

```bash
cd amplifyTests
npm install
npm test
```

Tests use Vitest with native ESM support.
Test files are automatically ignored by Amplify during deployment via `.amplifyignore`.

### Test Pattern

Guard resolver tests validate:
- Required field enforcement
- Conditional expressions
- Error handling
