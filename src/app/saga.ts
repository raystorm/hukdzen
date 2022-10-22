import { all } from 'redux-saga/effects';
import { watchDocumentSaga } from '../documents/documentSaga';

export default function* rootSaga() {
    yield all([
        watchDocumentSaga(),
    ]);
}