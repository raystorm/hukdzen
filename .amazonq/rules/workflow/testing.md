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

## Test Data Standards
- **ALWAYS** use JSON files from `src/data/` directory for test mocking
- Available mock files:
  - `docList.json` - Document mock data
  - `userList.json` - User mock data  
  - `authorList.json` - Author mock data
  - `boxList.json` - Box (Xbiis) mock data
  - `ErrorDocList.json` - Error state mock data
  - `ErrorAdvancedSearch.json` - Search error mock data
- Import mock data: `import mockDocuments from '../../data/docList.json'`
- Use actual IDs and structure from mock files
- Maintain consistency across all tests
- Do not create inline mock objects when JSON files exist
- Use correct Redux state paths that match the application
- Example: `documentList: mockDocuments` not `documents: { items: mockDocuments }`

## Redux Saga Testing
- Use `expectSaga` from `redux-saga-test-plan` for saga testing
- Avoid manual generator testing with `gen.next()` calls
- Migrate problematic tests to `expectSaga` incrementally
- Start with tests that have function reference comparison issues