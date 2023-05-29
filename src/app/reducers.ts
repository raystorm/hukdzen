import { combineReducers } from '@reduxjs/toolkit';
import { boxListReducer } from '../Box/BoxList/BoxListSlice';
import { boxReducer } from '../Box/boxSlice';
import { documentListReducer } from '../docs/docList/documentListSlice';
import { documentReducer } from '../docs/documentSlice';
import { currentUserReducer } from '../User/currentUserSlice';
import { userListReducer } from '../User/UserList/userListSlice';
import { userReducer } from '../User/userSlice'
import {alertBarReducer} from "../AlertBar/AlertBarSlice";
import {boxUserReducer} from "../BoxUser/BoxUserSlice";
import {boxUserListReducer} from "../BoxUser/BoxUserList/BoxUserListSlice";

const ReduxReducer =  combineReducers({
    alertMessage: alertBarReducer,
    document:     documentReducer,
    documentList: documentListReducer,
    currentUser:  currentUserReducer,
    user:         userReducer,
    userList:     userListReducer,
    box:          boxReducer,
    boxList:      boxListReducer,
    boxUser:      boxUserReducer,
    boxUserList:  boxUserListReducer
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;