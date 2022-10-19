import { combineReducers } from '@reduxjs/toolkit';
import { documentReducer } from '../slices/documentSlice';

const ReduxReducer =  combineReducers({
    document: documentReducer
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;