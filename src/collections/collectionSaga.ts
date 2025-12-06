import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';
import { collectionActions } from './collectionSlice';
import { uiActions } from '../UI/uiSlice';
import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../AlertBar/AlertBarTypes';
import type { 
   Collection, 
   AddItemsPayload, 
   RemoveItemPayload, 
   ReorderItemPayload 
} from './CollectionTypes';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

const client = generateClient();

export function getCollection(id: string)
{ return client.graphql({ query: queries.getCollection, variables: { id } }); }

export function getCollections()
{ return client.graphql({ query: queries.listCollections }); }

export function getCollectionItems(collectionId: string)
{
   return client.graphql({
                            query: queries.collectionItemsByCollectionID,
                            variables: { collectionID: collectionId }
                         });
}

export function createCollection(collection: any)
{
   return client.graphql({
      query: mutations.createCollection,
      variables: { input: collection }
   });
}

export function updateCollection(collection: any)
{
   const updateInput = {
      id: collection.id,
      eng_title: collection.eng_title,
      eng_description: collection.eng_description,
      bc_title: collection.bc_title,
      bc_description: collection.bc_description,
      ak_title: collection.ak_title,
      ak_description: collection.ak_description,
      updated: collection.updated,
   };
   
   return client.graphql({
      query: mutations.updateCollection,
      variables: { input: updateInput }
   });
}

export function createCollectionItem(item: any)
{
   return client.graphql({
                            query: mutations.createCollectionItem,
                            variables: { input: item }
                         });
}

export function updateCollectionItem(item: any) {
   return client.graphql({
                            query: mutations.updateCollectionItem,
                            variables: { input: item }
                         });
}

export function deleteCollectionItem(id: string) {
   return client.graphql({
                            query: mutations.deleteCollectionItem,
                            variables: { input: { id } }
                         });
}

function* handleLoadCollections()
{
   try
   {
      yield put(uiActions.setProcessing(true));
      const response: any = yield call(getCollections);
      const collections = response.data.listCollections.items;
      yield put(collectionActions.setCollections(collections));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to load collections: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleCreateCollection(action: PayloadAction<Collection>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      yield call(createCollection, action.payload);
      yield put(collectionActions.loadCollectionsRequest());
      const message = buildSuccessAlert('Collection created successfully');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleUpdateCollection(action: PayloadAction<Collection>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      yield call(updateCollection, action.payload);
      yield put(collectionActions.loadCollectionsRequest());
      const message = buildSuccessAlert('Collection updated successfully');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to update collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleAddItems(action: PayloadAction<AddItemsPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, items } = action.payload;
      
      // Get current max order
      const response: any = yield call(getCollection, collectionId);
      const collection = response.data.getCollection;
      const maxOrder = Math.max(0, ...(collection.items?.items || [])
                                      .map((item: any) => item.order || 0));
      
      // Create collection items
      for (let i = 0; i < items.length; i++)
      {
         const item = items[i];
         const collectionItem = {
            collectionID: collectionId,
            documentID: item.documentId || null,
            childCollectionID: item.childCollectionId || null,
            order: maxOrder + i + 1,
            created: new Date().toISOString()
         };
         
         yield call(createCollectionItem, collectionItem);
      }
      
      // Reload the specific collection with populated items
      yield put(collectionActions.loadCollectionRequest(collectionId));
      
      const message = buildSuccessAlert('Items added to collection');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to add items: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleRemoveItem(action: PayloadAction<RemoveItemPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, itemId } = action.payload;
      yield call(deleteCollectionItem, itemId);
      
      // Reload the specific collection with populated items
      yield put(collectionActions.loadCollectionRequest(collectionId));
      
      const message = buildSuccessAlert('Item removed from collection');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleLoadCollection(action: PayloadAction<string>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      // Get collection basic info
      const collectionResponse: any = yield call(getCollection, action.payload);
      const collection = collectionResponse.data.getCollection;
      
      // Get populated collection items
      const itemsResponse: any = yield call(getCollectionItems, action.payload);
      const populatedItems = itemsResponse.data.collectionItemsByCollectionID.items;
      
      // Merge populated items into collection
      const collectionWithPopulatedItems = {
         ...collection,
         items: {
            items: populatedItems,
            nextToken: itemsResponse.data.collectionItemsByCollectionID.nextToken
         }
      };
      
      // Update the specific collection in the store
      const allCollections: Collection[] = yield select((state: any) => state.collections.items);
      const updatedCollections = allCollections.some(c => c.id === collection.id)
         ? allCollections.map(c => c.id === collection.id ? collectionWithPopulatedItems : c)
         : [...allCollections, collectionWithPopulatedItems];
      yield put(collectionActions.setCollections(updatedCollections));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to load collection: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

function* handleReorderItem(action: PayloadAction<ReorderItemPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, itemId, direction } = action.payload;
      
      // Get populated items to work with
      const itemsResponse: any = yield call(getCollectionItems, collectionId);
      const items = [...(itemsResponse.data.collectionItemsByCollectionID.items || [])]
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      
      const currentIndex = items.findIndex((item: any) => item.id === itemId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= items.length) return;
      
      // Swap orders
      const currentItem = items[currentIndex];
      const swapItem = items[newIndex];
      
      yield call(updateCollectionItem, { id: currentItem.id, order: swapItem.order });
      yield call(updateCollectionItem, { id: swapItem.id, order: currentItem.order });
      
      // Reload the specific collection with populated items
      yield put(collectionActions.loadCollectionRequest(collectionId));
   }
   catch (error)
   {
      const message = buildErrorAlert(
         `Failed to reorder item: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* watchCollectionSaga()
{
   yield takeLatest(collectionActions.loadCollectionsRequest.type, handleLoadCollections);
   yield takeLatest(collectionActions.loadCollectionRequest.type, handleLoadCollection);
   yield takeLatest(collectionActions.createCollectionRequest.type, handleCreateCollection);
   yield takeLatest(collectionActions.updateCollectionRequest.type, handleUpdateCollection);
   yield takeLatest(collectionActions.addItemsRequest.type, handleAddItems);
   yield takeLatest(collectionActions.removeItemRequest.type, handleRemoveItem);
   yield takeLatest(collectionActions.reorderItemRequest.type, handleReorderItem);
};