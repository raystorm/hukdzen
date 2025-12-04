# Redux Saga Testing Standards

## Testing Approach
- Use `expectSaga` from `redux-saga-test-plan` for saga testing
- Avoid manual generator testing with `gen.next()` calls

## Migration Strategy
- Migrate problematic tests to `expectSaga` incrementally
- Start with tests that have function reference comparison issues