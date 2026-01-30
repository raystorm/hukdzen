import { combineReducers } from '@reduxjs/toolkit';
import { boxListReducer } from '../Box/BoxList/BoxListSlice';
import { boxReducer } from '../Box/boxSlice';
import { documentListReducer } from '../docs/docList/documentListSlice';
import { documentReducer } from '../docs/documentSlice';
import { currentUserReducer } from '../User/currentUserSlice';
import { userListReducer } from '../User/UserList/userListSlice';
import { userReducer } from '../User/userSlice'
import { unsubscribeReducer } from '../Unsubscribe/unsubscribeSlice';
import { alertBarReducer } from "../AlertBar/AlertBarSlice";
import { boxUserReducer } from "../BoxUser/BoxUserSlice";
import { boxUserListReducer } from "../BoxUser/BoxUserList/BoxUserListSlice";
import { authorReducer } from "../Author/authorSlice";
import { authorListReducer } from "../Author/AuthorList/authorListSlice";
import { fileUploaderReducer } from "../FileUploader/fileUploaderSlice";
import { uiReducer } from "../UI/uiSlice";
import { browseReducer } from "../browse/browseSlice";
import { collectionReducer } from "../collections/collectionSlice";
import { boxRequestReducer } from "../BoxRequest/boxRequestSlice";
import { boxRequestListReducer } from "../BoxRequest/BoxRequestList/BoxRequestListSlice";
import searchReducer from "../Search/searchSlice";

const ReduxReducer =  combineReducers({
    alertMessage:   alertBarReducer,
    document:       documentReducer,
    documentList:   documentListReducer,
    currentUser:    currentUserReducer,
    user:           userReducer,
    userList:       userListReducer,
    unsubscribe:    unsubscribeReducer,
    box:            boxReducer,
    boxList:        boxListReducer,
    boxUser:        boxUserReducer,
    boxUserList:    boxUserListReducer,
    boxRequest:     boxRequestReducer,
    boxRequestList: boxRequestListReducer,
    author:         authorReducer,
    authorList:     authorListReducer,
    fileUploader:   fileUploaderReducer,
    ui:             uiReducer,
    browse:         browseReducer,
    collections:    collectionReducer,
    search:         searchReducer,
});

export type ReduxState = ReturnType<typeof ReduxReducer>;

export default ReduxReducer;