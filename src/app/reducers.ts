import { combineReducers } from '@reduxjs/toolkit';
import { documentListReducer } from '../documents/documentList/documentListSlice';
import { documentReducer } from '../documents/documentSlice';

const ReduxReducer =  combineReducers({
    document: documentReducer,
    documentList: documentListReducer
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;