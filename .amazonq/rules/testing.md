# Testing Standards

## Test Requirements
- **MANDATORY**: Create tests for all logic changes, presentation changes, and new components
- **MANDATORY**: Tests must be created alongside the implementation, not as a separate task
- All new components require corresponding test files
- All business logic functions require unit tests
- All Redux sagas and reducers require tests

## Test Structure
- Use Vitest for unit tests (existing setup)
- Name test files with `.test.` extension: `Component.test.tsx`, `utils.test.ts`
- Place tests in `__tests__` directories
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## Testing Patterns
- Use `@testing-library/react` for component tests
- Use `redux-saga-test-plan` for saga tests
- Mock external dependencies properly
- Test user interactions, not implementation details

## Coverage
- Aim for meaningful test coverage
- Focus on critical business logic
- Test error scenarios and edge cases