import { combineReducers } from '@reduxjs/toolkit';
import { documents } from './documents';

const ReduxReducer =  combineReducers({});

export type ReduxState = ReturnType<typeof ReduxReducer>;




export default ReduxReducer;