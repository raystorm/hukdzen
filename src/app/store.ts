import { configureStore } from '@reduxjs/toolkit';
import ReduxReducer from './reducers';

export const store = configureStore({
  reducer: ReduxReducer,
});

export type AppDispatch = typeof store.dispatch;

export default store;