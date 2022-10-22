import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../documents/documentSaga';
import { watchDocumentListSaga } from '../documents/documentList/documentListSaga';

export default function* rootSaga() {
    yield all([
        watchDocumentSaga(),
        watchDocumentListSaga(),
    ]);
}