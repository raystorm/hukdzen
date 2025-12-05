import { call, put, takeLatest } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';
import { collectionActions } from './collectionSlice';
import { uiActions } from '../UI/uiSlice';
import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../AlertBar/AlertBarTypes';
import type { Collection } from './CollectionTypes';
import * as queries from '../graphql/queries';

const client = generateClient();

export function getCollections() {
   return client.graphql({ query: queries.listCollections });
}

function* handleLoadCollections() {
   try {
      yield put(uiActions.setProcessing(true));
      const response: any = yield call(getCollections);
      const collections = response.data.listCollections.items;
      yield put(collectionActions.setCollections(collections));
   } catch (error) {
      const message = buildErrorAlert(
         `Failed to load collections: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   } finally {
      yield put(uiActions.setProcessing(false));
   }
}

export function* watchCollectionSaga() {
   yield takeLatest(collectionActions.loadCollectionsRequest.type, handleLoadCollections);
}