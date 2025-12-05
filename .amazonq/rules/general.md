# General Code Quality Standards

## Code Organization
- Follow existing directory structure
- Group related files in feature directories
- Use consistent file naming conventions
- Keep components focused and single-purpose

## Naming Conventions
- Follow existing patterns in the codebase
- When adding new features, match the naming style of similar existing features
- **Redux Saga Patterns**: `getEntity()`, `handleActionName()`, `watchEntitySaga()`
- **Redux Slice Patterns**: `entitySlice`, `entityActions`
- **File Naming**: PascalCase for components, camelCase for utilities
- **Function Naming**: `handleEventName`, `isCondition`, descriptive verbs for async operations

## Rule File Organization
- Add new rules to existing rule files when they fit the same category
- Only create new rule files when the rule doesn't fit any existing category
- Check existing rule files before creating new ones

## Error Handling
- Use proper error boundaries for React components
- Handle async errors in sagas
- Provide meaningful error messages
- Log errors appropriately for debugging

## Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders with useCallback/useMemo
- Follow existing patterns for data fetching

## Documentation
- Use JSDoc for complex functions
- Keep comments focused on "why" not "what"
- Update README when adding new features
- Document API changes and breaking changes