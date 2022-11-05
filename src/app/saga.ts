import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../documents/documentSaga';
import { watchDocumentListSaga } from '../documents/documentList/documentListSaga';
import { watchUserSaga } from '../User/userSaga';
import { watchUserListSaga } from '../User/UserList/userListSaga';
import { watchBoxSaga } from '../Box/boxSaga';
import { watchBoxListSaga } from '../Box/BoxList/BoxListSaga';

export default function* rootSaga() {
    yield all([
        watchUserSaga(),
        watchUserListSaga(),
        watchBoxSaga(),
        watchBoxListSaga(),
        watchDocumentSaga(),
        watchDocumentListSaga(),        
    ]);
}