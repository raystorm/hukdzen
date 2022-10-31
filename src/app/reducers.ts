import { combineReducers } from '@reduxjs/toolkit';
import { documentListReducer } from '../documents/documentList/documentListSlice';
import { documentReducer } from '../documents/documentSlice';
import { userListReducer } from '../User/UserList/userListSlice';
import { userReducer } from '../User/userSlice'

const ReduxReducer =  combineReducers({
    document: documentReducer,
    documentList: documentListReducer,
    user: userReducer,
    userList: userListReducer,
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;