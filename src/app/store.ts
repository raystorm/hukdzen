import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import ReduxReducer from './reducers';
import rootSaga from './saga';

// export const store = configureStore({
//   reducer: ReduxReducer,  
// });

const sagaMiddleware = createSagaMiddleware();

//placeholder in case we add more later
const middlewares = [sagaMiddleware];

const ReduxStore = configureStore({
  reducer: ReduxReducer, 
  middleware: middlewares,
});

//Start Middleware to actually pick-up events
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;