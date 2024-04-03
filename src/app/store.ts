import {configureStore, EnhancedStore} from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import ReduxReducer, {ReduxState} from './reducers';
import rootSaga from './saga';

const sagaMiddleware = createSagaMiddleware();

//placeholder in case we add more later
const middlewares = [sagaMiddleware];

/**
 *  Build the Redux Store
 *  @param preloadedState
 */
export const setupStore = (preloadedState?: Partial<ReduxState>): EnhancedStore =>
{
   return configureStore({
             reducer: ReduxReducer,
             //@ts-ignore
             middleware: (getDefaultMiddleware) => { return middlewares; },
             preloadedState: preloadedState
          });
}

/** Backing store for the app state/data */
const ReduxStore = setupStore();

/** Starts the Middleware for action/state processing */
export const start = () => { sagaMiddleware.run(rootSaga); }

//Start Middleware to actually pick-up events
start();

/** Dispatches actions to the store */
export type AppDispatch = typeof ReduxStore.dispatch;

/** Backing store for the app state/data */
export default ReduxStore;