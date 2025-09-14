import React, { PropsWithChildren } from 'react';
import { EnhancedStore } from "@reduxjs/toolkit";
import { Provider } from 'react-redux';
import {MemoryRouter, Route, Routes} from "react-router";
import { useLocation } from 'react-router';

import {vi} from 'vitest';
import { act, fireEvent, render, RenderOptions } from '@testing-library/react';
import {when} from "vitest-when";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import {Amplify} from "aws-amplify";
import {Authenticator} from "@aws-amplify/ui-react";

import amplifyConfig from "../amplifyconfiguration.json";

import { ReduxState } from '../app/reducers';
import ReduxStore, {setupStore, start} from '../app/store';

Amplify.configure(amplifyConfig);

export const loadTestStore = (state: any) => {
   const store: EnhancedStore = setupStore(state);
   //console.log(`${JSON.stringify(store)}`);
   store.dispatch = vi.fn(store.dispatch);
   start(); //start running the sagas/store
   return store;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<ReduxState>
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

export const arrowDown = async (element: (Document | Element | Window | Node)) =>
{
   return await act(async ()=> {
      return fireEvent.keyDown(element, {key: 'ArrowDown'}); //open the menu
   });
}


export const enterKey = async (element: (Document | Element | Window | Node)) =>
{
   return await act(async ()=> {
      return fireEvent.keyDown(element, {key: 'Enter'});
   });
}
