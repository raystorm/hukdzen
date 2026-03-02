# Reference Patterns

Canonical implementations of common patterns. Reference these in prompts to anchor to existing codebase patterns.

---

## Error Handling in Sagas

**Reference:** `User/userSaga.ts`, `error/index.ts`

### Pattern

```typescript
catch (error)
{
   logger.error(error);
   const message = buildFriendlyErrorAlert('Failed to GET User:', error);
   yield put(userActions.getUserByIdFailure(printErrorMessage(error)));
   yield put(alertBarActions.DisplayAlertBox(message));
}
finally { yield put(uiActions.setProcessing(false)); }
```

### Key Points

- `error` is type `unknown` in catch blocks
- Never access `error.message` directly
- Use `printErrorMessage(error)` from `error/index.ts` for failure actions
- Use `buildFriendlyErrorAlert(context, error)` for user-facing alerts (handles error internally)
- Always log the error: `logger.error(error)`
- Use try/catch/finally with `setProcessing()` for async operations

### Why

TypeScript catch blocks receive `unknown` type. The `message` property is not guaranteed to exist. `printErrorMessage()` handles all error types safely (Error objects, strings, objects, nested causes).

---

## Redux Saga File Structure

**Reference:** `User/userSaga.ts`, `Box/boxSaga.ts`, `BoxUser/boxUserSaga.ts`

### File Organization Pattern

```typescript
// 1. Imports
import { call, put, takeLatest } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

// 2. GraphQL Wrapper Functions (exported for reuse by other sagas)
export function getEntity(id: string) {
  return client.graphql({ query: queries.getEntity, variables: {id} });
}

export function createEntity(entity: Entity) {
  const createMe: EntityInput = { /* map fields */ };
  return client.graphql({ 
    query: mutations.createEntity, 
    variables: { input: createMe } 
  });
}

// 3. Handler Functions (generator functions)
export function* handleGetEntity(action: PayloadAction<string>): any {
  try {
    yield put(uiActions.setProcessing(true));
    
    const response = yield call(getEntity, action.payload);
    const entity = validateResponse(response, r => r.data.getEntity, 'Entity');
    yield put(entityActions.getEntitySuccess(entity));
  }
  catch(error) {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to GET Entity:', error);
    yield put(entityActions.getEntityFailure(printErrorMessage(error)));
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

// 4. Watcher Function (exported, called by root saga)
export function* watchEntitySaga() {
  yield takeLatest(entityActions.getEntity.type, handleGetEntity);
  yield takeLatest(entityActions.createEntity.type, handleCreateEntity);
}
```

### Key Points

- **GraphQL wrappers** are plain functions, exported for reuse
- **Handlers** are generator functions, call wrappers via `yield call()`
- **Watcher** uses `takeLatest`, `takeLeading`, or `takeEvery`
- All GraphQL calls get a wrapper function (never inline `client.graphql()`)
- Wrappers can be imported and reused by other sagas

---

## Async Action Lifecycle (Request/Success/Failure)

**Reference:** `User/userSlice.ts`, `BoxUser/BoxUserSlice.ts`

### Pattern

For async operations, define three actions:

```typescript
const entitySlice = createSlice({
  name: 'entity',
  initialState: initialEntity,
  reducers: {
    // Request action - triggers saga
    getEntity: (state, action: PayloadAction<string>) => state,
    
    // Success action - saga dispatches on success
    getEntitySuccess: (state, action: PayloadAction<Entity>) => action.payload,
    
    // Failure action - saga dispatches on error
    getEntityFailure: (state, action: PayloadAction<string>) => state,
  }
});
```

### Saga Handler

```typescript
export function* handleGetEntity(action: PayloadAction<string>): any {
  try {
    const response = yield call(getEntity, action.payload);
    const entity = validateResponse(response, r => r.data.getEntity, 'Entity');
    
    // Dispatch Success action
    yield put(entityActions.getEntitySuccess(entity));
  }
  catch(error) {
    logger.error(error);
    
    // Dispatch Failure action with error message
    yield put(entityActions.getEntityFailure(printErrorMessage(error)));
    
    const message = buildFriendlyErrorAlert('Failed to GET Entity:', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}
```

### Key Points

- **Request action** (`getEntity`) - Component dispatches, saga watches
- **Success action** (`getEntitySuccess`) - Saga dispatches on successful API call
- **Failure action** (`getEntityFailure`) - Saga dispatches on error, receives error message string
- Use `printErrorMessage(error)` for failure action payload
- Failure actions can be used by other sagas (e.g., `race()` pattern)

---

## Domain Slice Pattern

**Reference:** `Box/boxSlice.ts`, `User/userSlice.ts`

### File Structure

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptyEntity, initialEntity, Entity } from './entityTypes';

const entitySlice = createSlice({
  name: 'entity',
  initialState: initialEntity,
  reducers: {
    getEntity:       (state, action: PayloadAction<string>) => state,
    getEntitySuccess: (state, action: PayloadAction<Entity>) => action.payload,
    getEntityFailure: (state, action: PayloadAction<string>) => state,
    
    setEntity:    (state, action: PayloadAction<Entity>) => action.payload,
    createEntity: (state, action: PayloadAction<Entity>) => action.payload,
    updateEntity: (state, action: PayloadAction<Entity>) => action.payload,
    removeEntity: (state, action: PayloadAction<Entity>) => emptyEntity,
  }
});

export const { 
  actions: entityActions, 
  reducer: entityReducer, 
} = entitySlice;

export default entitySlice;
```

### Key Points

- Use `createSlice` from Redux Toolkit
- Action naming: `getEntity`, `createEntity`, `updateEntity`, `removeEntity`
- Success/Failure actions for async operations: `getEntitySuccess`, `getEntityFailure`
- Export both `entityActions` and `entityReducer` as named exports
- Default export the slice itself

---

## Domain Types Pattern

**Reference:** `Box/boxTypes.ts`, `User/userType.ts`

### File Structure

```typescript
import { Entity as GeneratedEntity } from '../graphql/API';
import { FixRequired } from '../types';

// Domain type extends generated GraphQL type
export type Entity = FixRequired<GeneratedEntity, 'requiredField'>;

// Empty helper for initialization
export const emptyEntity: Entity = {
  __typename: 'Entity',
  id: '',
  name: '',
  // ... other required fields
};

// Initial state for slice
export const initialEntity: Entity = emptyEntity;

// Helper functions
export const printEntity = (entity: Entity) => entity.name;
```

### Key Points

- Extend GraphQL-generated types with `FixRequired` for stricter typing
- Provide `emptyEntity` constant for initialization
- Provide `initialEntity` for slice initial state
- Include domain-specific helper functions (print, validation, etc.)
