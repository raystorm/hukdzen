import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './store';
import type { ReduxState } from './reducers';

//raystorm - this was auto generated, is it just type wrappers for the functions?

// Use throughout your app instead of plain `useDispatch` and `useSelector`

/** Came with the quickstart, not sure what this buys me */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** TypeSafe useSelector hook, saves casting. */
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;
