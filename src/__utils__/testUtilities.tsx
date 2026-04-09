import React, { PropsWithChildren } from 'react';
import { EnhancedStore } from "@reduxjs/toolkit";
import { Task } from "redux-saga";
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from "react-router";
import { useLocation } from 'react-router';

import { vi } from 'vitest';
import { act, fireEvent, render, RenderOptions, screen, waitFor, within } from '@testing-library/react';
import {when} from "vitest-when";
import userEvnt from '@testing-library/user-event';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import {Amplify} from "aws-amplify";
import {Authenticator} from "@aws-amplify/ui-react";

import amplifyConfig from "../amplifyconfiguration.json";

import { ReduxState } from '../app/reducers';
import ReduxStore, {setupStore, start} from '../app/store';
import { printBox, Box } from "../Box/boxTypes";
import { dropFilesText } from "../components/widgets/AWSFileUploader";
import { loadLocalFile } from "./fileUtilities";
import { logger } from "../utils/logger";

Amplify.configure(amplifyConfig);

const userEvent = userEvnt.setup();

let sagaTask: Task<any> | null = null;

export const loadTestStore = (state: any) => {
   const store: EnhancedStore = setupStore(state);
   //console.log(`${JSON.stringify(store)}`);
   store.dispatch = vi.fn(store.dispatch);
   if ( !sagaTask ) { sagaTask = start(); } //start running the sagas/store
   return store;
}

export const stopSagas = () =>
{
   if ( !!sagaTask )
   {
      sagaTask.cancel();
      sagaTask = null;
   }
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

/**
 *  Helper method to fail/force an error when testing/debugging
 *  @param message failure reason
 */
// noinspection NonAsciiCharacters JSUnusedLocalSymbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ಠ_ಠ = (message: string ) =>
{ throw new Error(message); }

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

export const endsWith = (matchMe: string, flags?: string) =>
{ //Note: default flags can go Here
   return new RegExp(`${regexEscaper(matchMe)}$`, flags);
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

/**
 *  [CTRL] click to deselect
 *  @param element Element to deselect
 */
export const ctrlClick = async (element: Element) =>
{
   await userEvent.keyboard('{Control>}');
   await userEvent.click(element);
   await userEvent.keyboard('{/Control}');
}


/**
 *  Test helper.  runs a test, and if it fails, dumps provided screen region
 *  @param matcher
 *  @param region
 *  @param label
 */
export const verify = (matcher: () => void, region: HTMLElement,
                       label: string = 'Debug region') =>
{
   try { matcher(); }
   catch (err)
   {
      logger.log(`--- ${label} ---`);
      screen.debug(region);
      throw err; //duck so test failure is reported
   }
}

/**
 *  Test helper.  waits for an assertion, and if it fails, dumps provided screen region
 *  @param matcher
 *  @param region
 *  @param label
 */
export const  verifyWaitFor = async ( matcher: () => void, region: HTMLElement,
                                      label: string = 'Debug region' ) =>
{
   try { await waitFor(() => matcher()); }
   catch (err)
   {
      logger.log(`--- ${label} ---`);
      screen.debug(region);
      throw err; //duck so test failure is reported
   }
}