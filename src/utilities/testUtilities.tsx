import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import { Provider } from 'react-redux';

import ReduxReducer, { ReduxState } from '../app/reducers';
import ReduxStore from '../app/store';
import rootSaga from '../app/saga';

//TODO: correct types
export const buildTestStore = (state: any, middleware: any[]) => {
  const store = configureStore({
    reducer: ReduxReducer, 
    middleware: middleware,
    preloadedState: state,
  });
  store.dispatch = jest.fn(store.dispatch);
  return store;
}

export const loadTestStore = (state: any) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = buildTestStore(state, [sagaMiddleware]);
  sagaMiddleware.run(rootSaga);
  return store;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<ReduxState>
  store?: typeof ReduxStore
}

export const renderWithProviders = 
             (element: React.ReactElement, 
              {
                preloadedState = {},
                // Automatically create a store instance if no store was passed in
                store = loadTestStore(preloadedState),
                ...renderOptions
              }: ExtendedRenderOptions = {} ) =>
{
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element =>
  { return <Provider store={store}>{children}</Provider> }
  return { store, ...render(element, { wrapper: Wrapper, ...renderOptions }) }
}

export const renderWithState = (state: any, element: React.ReactElement) =>
{ return renderWithProviders(element, { preloadedState: state }); }


/* 
 * escaper Stolen from: https://stackoverflow.com/a/14359586/659354 
 * Matchers also inspired by
 */
const regextEscaper = (escapeMe: string) =>
{ return escapeMe.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') };

export const contains = (matchMe: string, flags?: string) =>
{ //Note: default flags can go Here
  return new RegExp(regextEscaper(matchMe), flags);
}

export const startsWith = (matchMe: string, flags?: string) =>
{ //Note: default flags can go Here
  return new RegExp(`^${regextEscaper(matchMe)}`, flags);
}