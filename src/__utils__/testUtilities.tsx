import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {Authenticator} from "@aws-amplify/ui-react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import ReduxReducer, { ReduxState } from '../app/reducers';
import ReduxStore from '../app/store';
import rootSaga from '../app/saga';
import {MemoryRouter, Route, Routes} from "react-router";

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
  { 
    return <Provider store={store}>
             <LocalizationProvider 
                   dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                {children}
              </LocalizationProvider>
           </Provider> 
  }
  return { store, ...render(element, { wrapper: Wrapper, ...renderOptions }) }
}

export const renderWithState = (state: any = {}, element: React.ReactElement) =>
{ return renderWithProviders(element, { preloadedState: state }); }

export const renderPageWithPath = (currentPath: string, mountPoint: string,
                                   element: React.ReactElement, state: any = {}) =>
{
   return renderWithState(state,
                          <MemoryRouter initialEntries={[currentPath]}>
                            <Routes>
                              <Route path={mountPoint} element={element} />
                            </Routes>
                          </MemoryRouter>);
}

export const renderPage = (path: string,
                           element: React.ReactElement, state: any = {}) =>
{ return renderPageWithPath(path, path, element, state); }

export const renderWithAuthenticator = (state: any, element: React.ReactElement) =>
{
   return renderWithState(state,
                          <Authenticator.Provider>
                            {element}
                          </Authenticator.Provider>);
}

/* 
 * escaper Stolen from: https://stackoverflow.com/a/14359586/659354 
 * Matchers also inspired by
 */
const regexEscaper = (escapeMe: string) =>
{ return escapeMe.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') };

export const contains = (matchMe: string, flags?: string) =>
{ //Note: default flags can go Here
  return new RegExp(regexEscaper(matchMe), flags);
}

export const startsWith = (matchMe: string, flags?: string) =>
{ //Note: default flags can go Here
  return new RegExp(`^${regexEscaper(matchMe)}`, flags);
}

export const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname+location.search}</div>
}