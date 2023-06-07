import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../docs/documentSaga';
import { watchDocumentListSaga } from '../docs/docList/documentListSaga';
import { watchUserSaga } from '../User/userSaga';
import { watchUserListSaga } from '../User/UserList/userListSaga';
import { watchBoxSaga } from '../Box/boxSaga';
import { watchBoxListSaga } from '../Box/BoxList/BoxListSaga';
import {watchBoxUserSaga} from "../BoxUser/boxUserSaga";
import {watchBoxUserListSaga} from "../BoxUser/BoxUserList/BoxUserListSaga";
import {watchBoxRoleSaga} from "../BoxRole/boxRoleSaga";
import {watchBoxRoleListSaga} from "../BoxRole/BoxRoleList/BoxRoleListSaga";
import {watchAuthorSaga} from "../Author/authorSaga";
import {watchAuthorListSaga} from "../Author/AuthorList/authorListSaga";

export default function* rootSaga() {
    yield all([
        watchUserSaga(),
        watchUserListSaga(),
        watchBoxSaga(),
        watchBoxListSaga(),
        watchDocumentSaga(),
        watchDocumentListSaga(),
        watchBoxRoleSaga(),
        watchBoxRoleListSaga(),
        watchBoxUserSaga(),
        watchBoxUserListSaga(),
        watchAuthorSaga(),
        watchAuthorListSaga(),
    ]);
}