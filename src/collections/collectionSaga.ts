import { call, put, takeLatest } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';
import { collectionActions } from './collectionSlice';
import { uiActions } from '../UI/uiSlice';
import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../AlertBar/AlertBarTypes';
import type { Collection } from './CollectionTypes';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

export function getCollections() {
   return client.graphql({ query: queries.listCollections });
}

export function createCollection(collection: any) {
   return client.graphql({
      query: mutations.createCollection,
      variables: { input: collection }
   });
}

export function updateCollection(collection: any) {
   return client.graphql({
      query: mutations.updateCollection,
      variables: { input: collection }
   });
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

function* handleCreateCollection(action: PayloadAction<Collection>) {
   try {
      yield put(uiActions.setProcessing(true));
      yield call(createCollection, action.payload);
      yield put(collectionActions.loadCollectionsRequest());
      const message = buildSuccessAlert('Collection created successfully');
      yield put(alertBarActions.DisplayAlertBox(message));
   } catch (error) {
      const message = buildErrorAlert(
         `Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   } finally {
      yield put(uiActions.setProcessing(false));
   }
}

function* handleUpdateCollection(action: PayloadAction<Collection>) {
   try {
      yield put(uiActions.setProcessing(true));
      yield call(updateCollection, action.payload);
      yield put(collectionActions.loadCollectionsRequest());
      const message = buildSuccessAlert('Collection updated successfully');
      yield put(alertBarActions.DisplayAlertBox(message));
   } catch (error) {
      const message = buildErrorAlert(
         `Failed to update collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   } finally {
      yield put(uiActions.setProcessing(false));
   }
}

export function* watchCollectionSaga() {
   yield takeLatest(collectionActions.loadCollectionsRequest.type, handleLoadCollections);
   yield takeLatest(collectionActions.createCollectionRequest.type, handleCreateCollection);
   yield takeLatest(collectionActions.updateCollectionRequest.type, handleUpdateCollection);
}