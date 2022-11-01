import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../documents/documentSaga';
import { watchDocumentListSaga } from '../documents/documentList/documentListSaga';
import { watchUserSaga } from '../User/userSaga';
import { watchUserListSaga } from '../User/UserList/userListSaga';

export default function* rootSaga() {
    yield all([
        watchUserSaga(),
        watchUserListSaga(),
        watchDocumentSaga(),
        watchDocumentListSaga(),
    ]);
}