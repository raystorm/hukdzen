# TypeScript Coding Standards

## Type Safety
- Use strict TypeScript configuration (already enabled)
- Prefer explicit return types for functions
- Use interfaces over types for object shapes
- Avoid `any` type - use specific types or `unknown`
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## Imports & Exports
- Use named exports over default exports for utilities
- Group imports: React first, then third-party, then local
- Use relative imports consistently (following existing pattern)
- Import types separately: `import type { SomeType } from './types'`

## Naming Conventions
- Use PascalCase for components, interfaces, types, enums
- Use camelCase for variables, functions, methods
- Use UPPER_SNAKE_CASE for constants
- Prefix interfaces with descriptive names (not `I`)