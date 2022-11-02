import { combineReducers } from '@reduxjs/toolkit';
import { documentListReducer } from '../documents/documentList/documentListSlice';
import { documentReducer } from '../documents/documentSlice';
import { currentUserReducer } from '../User/currentUserSlice';
import { userListReducer } from '../User/UserList/userListSlice';
import { userReducer } from '../User/userSlice'

const ReduxReducer =  combineReducers({
    document: documentReducer,
    documentList: documentListReducer,
    currentUser: currentUserReducer,
    user: userReducer,
    userList: userListReducer,
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;