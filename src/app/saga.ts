import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../docs/documentSaga';
import { watchDocumentListSaga } from '../docs/docList/documentListSaga';
import { watchUserSaga } from '../User/userSaga';
import { watchUserListSaga } from '../User/UserList/userListSaga';
import { watchUnsubscribeSaga } from '../Unsubscribe/unsubscribeSaga';
import { watchBoxSaga } from '../Box/boxSaga';
import { watchBoxListSaga } from '../Box/BoxList/BoxListSaga';
import { watchBoxUserSaga } from "../BoxUser/boxUserSaga";
import { watchBoxUserListSaga } from "../BoxUser/BoxUserList/BoxUserListSaga";
import { watchAuthorSaga } from "../Author/authorSaga";
import { watchAuthorListSaga } from "../Author/AuthorList/authorListSaga";
import { watchCollectionSaga } from "../collections/collectionSaga";
import { watchBoxRequestSaga } from "../BoxRequest/boxRequestSaga";
import { watchBoxRequestListSaga } from "../BoxRequest/BoxRequestList/BoxRequestListSaga";
import { watchSearchSaga } from "../Search/searchSaga";

export default function* rootSaga() {
    yield all([
        watchUserSaga(),
        watchUserListSaga(),
        watchUnsubscribeSaga(),
        watchBoxSaga(),
        watchBoxListSaga(),
        watchDocumentSaga(),
        watchDocumentListSaga(),
        watchBoxUserSaga(),
        watchBoxUserListSaga(),
        watchBoxRequestSaga(),
        watchBoxRequestListSaga(),
        watchAuthorSaga(),
        watchAuthorListSaga(),
        watchCollectionSaga(),
        watchSearchSaga(),

    ]);
}