import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { select, SelectEffect } from 'redux-saga/effects'
import {EqualityFn} from "react-redux/src/types";

import type { AppDispatch } from './store';
import type { ReduxState } from './reducers';

//raystorm - this was auto generated, is it just type wrappers for the functions?

// Use throughout your app instead of plain `useDispatch` and `useSelector`

/** Came with the quickstart, not sure what this buys me */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** TypeSafe useSelector hook, saves casting. */
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;

/** UseSelector with lookup for empty */
export const useAppLookupSelector = <TSelected>(
                                      selector: (state: ReduxState) => TSelected,
                                      loader: (any),
                                      isEmpty: (selected: any) => boolean,
                                      equalityFn?: EqualityFn<TSelected>,
                                    ):TSelected => {
   return useAppSelector(selector && !isEmpty(selector) ? selector : loader,
                         equalityFn);
}

/**
 *  Typesafe Selector for accessing current state variables in a Saga
 *  @param selector function to return current state value
 */
export function* appSelect<TSelected>(
   selector: (state: ReduxState) => TSelected,
  ): Generator<SelectEffect, TSelected, TSelected>
{ return yield select(selector); }