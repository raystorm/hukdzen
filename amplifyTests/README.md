# amplifyTests

Vitest environment for Amplify guard resolvers.

## Purpose

This folder contains the Vitest test runner and dependencies for testing Amplify AppSync JavaScript resolvers. Test files live next to their resolvers inside `amplify/data/<Domain>/__tests__/` but are ignored by Amplify during deployment.

## Structure

```
amplifyTests/
├── package.json       # Vitest and test dependencies
├── vitest.config.js   # Vitest configuration
├── node_modules/      # Test dependencies (gitignored)
└── README.md          # This file

amplify/data/          # amplify data folder
└── <Domain>/          # each domain(Author, Box, etc) has its own folder
    ├── <Domain>.graphql
    ├── <operation>Guarded.js
    └── __tests__/
        └── <operation>Guarded.test.js
```

## Running Tests

```bash
cd amplifyTests
npm install
npm test
```

## Watch Mode

```bash
npm run test:watch
```

## Coverage

```bash
npm run test:coverage
```

## Why Vitest?

- Native ESM support (no Babel transforms needed)
- Fast and lightweight
- Compatible with Jest API
- Better error messages
- Built-in coverage with v8

## Why Separate?

- Keeps test dependencies isolated from Amplify backend
- Prevents Amplify from uploading test files during deployment
- Allows different Node.js versions for tests vs Lambda runtime
- Clean ESM environment without build complexity
