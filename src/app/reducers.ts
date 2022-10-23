import { combineReducers } from '@reduxjs/toolkit';
import { documentListReducer } from '../documents/documentList/documentListSlice';
import { documentReducer } from '../documents/documentSlice';
import { userReducer } from '../User/userSlice'

const ReduxReducer =  combineReducers({
    document: documentReducer,
    documentList: documentListReducer,
    user: userReducer
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;