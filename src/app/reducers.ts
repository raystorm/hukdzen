import { combineReducers } from '@reduxjs/toolkit';
import { documentReducer } from '../documents/documentSlice';

const ReduxReducer =  combineReducers({
    document: documentReducer
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;