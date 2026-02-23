# Redux & State Management Standards

## Redux Toolkit Patterns
- Use `createSlice` for all reducers
- Use Redux Saga for async operations (not createAsyncThunk)
- Follow existing naming: `entityActions`, `entitySlice`
- Use `useAppSelector` and `useDispatch` hooks

## Saga Patterns
- Use Redux Saga for all async flows
- Follow existing saga naming: `entitySaga.ts`
- Use `takeLatest` for most actions, `takeLeading` for sign-in flows
- Handle errors in sagas with try/catch
- Use `call` for async operations, `put` for dispatching actions

## State Structure
- Keep state normalized when possible
- Use `items` array for lists (following existing pattern)
- Include loading and error states
- Use selectors for computed state

## Cross-Slice Dependencies
- Use `extraReducers` for listening to actions from other slices
- Check `extraReducers` sections when tracing action effects
- Look for imported actions (e.g., `import { otherActions }`)

## Saga Query Functions
- Define GraphQL query/mutation functions in their domain saga file
- Export query functions for reuse by other sagas
- Example: `getAdminUsers()` in `userListSaga.ts`, imported by `boxRequestSaga.ts`
- Keep query logic with the domain that owns the data
