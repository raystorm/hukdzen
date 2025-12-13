import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../AlertBar/AlertBarTypes';
import { uiActions } from '../UI/uiSlice';

import { collectionActions } from './collectionSlice';
import type {
              Collection, AddItemsPayload, RemoveItemPayload, ReorderItemPayload
            } from './CollectionTypes';
import { getDocumentById } from '../docs/documentSaga';

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

export function updateCollectionItem(item: any)
{
   return client.graphql({
                            query: mutations.updateCollectionItem,
                            variables: { input: item }
                         });
}

export function deleteCollectionItem(id: string)
{
   return client.graphql({
                            query: mutations.deleteCollectionItem,
                            variables: { input: { id } }
                         });
}

function wouldCreateCircularReference(candidateId: string, targetId: string,
                                      allCollections: Collection[]): boolean
{
   const visited = new Set<string>();
   
   const hasPath = (fromId: string, toId: string): boolean => {
      if (fromId === toId) { return true; }
      if (visited.has(fromId)) { return false; }
      visited.add(fromId);
      
      const collection = allCollections.find(c => c.id === fromId);
      if (!collection?.items?.items) { return false; }
      
      return collection.items.items.some(item => item && item.childCollectionID
                                              && hasPath(item.childCollectionID, toId));
   };
   
   return hasPath(candidateId, targetId);
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

      // Resolve box name for success message
      const boxList = yield select((state: any) => state.boxList.items);
      const boxId = (action.payload as any).collectionBoxId || (action.payload as any).collectionBoxId;
      const box = boxList ? boxList.find((b: any) => b && b.id === boxId) : undefined;
      //TODO: pass box to printName() or printBox
      const boxName = box ? box.name : (boxId || 'Unknown');

      const message = buildSuccessAlert(`Collection saved and assigned to Box: ${boxName}.`);
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

      const payloadAny: any = action.payload;

      // If the payload attempts to change the collection's box, ensure the collection is empty
      if (payloadAny.collectionBoxId)
      {
         // load current collection to inspect existing box and items
         const currentResp: any = yield call(getCollection, payloadAny.id);
         const current = currentResp.data.getCollection;
         const currentBoxId = current.collectionBoxId;
         const newBoxId = payloadAny.collectionBoxId;

         //items.items is wierd, this read like a bug.
         const hasItems = (current.items && current.items.items && current.items.items.length > 0);
         if (newBoxId !== currentBoxId && hasItems)
         {
            const message = buildErrorAlert('Cannot move: this collection is not empty. Remove all items before moving to a new Box.');
            yield put(alertBarActions.DisplayAlertBox(message));
            return;
         }
      }

      yield call(updateCollection, action.payload);
      yield put(collectionActions.loadCollectionsRequest());

      // Try to resolve box name from the payload or existing store
      const boxList = yield select((state: any) => state.boxList.items);
      const allCollections: Collection[] = yield select((state: any) => state.collections.items);
      let boxName: string | undefined;

      if (payloadAny.collectionBoxId)
      {
         const b = boxList ? boxList.find((bx: any) => bx && bx.id === payloadAny.collectionBoxId) : undefined;
         boxName = b ? b.name : payloadAny.collectionBoxId;
      }
      else
      {
         const existing = allCollections.find(c => c.id === payloadAny.id);
         boxName = existing?.box?.name || 'Unknown';
      }

      const message = buildSuccessAlert(`Collection saved and assigned to Box: ${boxName}.`);
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
      
      // Get all collections for circular reference checking
      const allCollections: Collection[] = yield select((state: any) => state.collections.items);
      
      // Validate no circular references for collection items
      const collectionItems = items.filter(item => item.childCollectionId);
      for (const item of collectionItems)
      {
         if (collectionId === item.childCollectionId)
         {
            const message = buildErrorAlert('Cannot add collection to itself');
            yield put(alertBarActions.DisplayAlertBox(message));
            return;
         }
         
         if (wouldCreateCircularReference(item.childCollectionId!, collectionId, allCollections))
         {
            const message = buildErrorAlert('Cannot add collection: would create circular reference');
            yield put(alertBarActions.DisplayAlertBox(message));
            return;
         }
      }
      
      // Get current max order - ensure the parent collection response is present
      const response: any = yield call(getCollection, collectionId);
      if (!response || !response.data || !response.data.getCollection)
      {
         const message = buildErrorAlert('Failed to add items: could not load parent collection');
         yield put(alertBarActions.DisplayAlertBox(message));
         return;
      }
      const collection = response.data.getCollection;
      const maxOrder = Math.max(0, ...(collection.items?.items || [])
                                      .map((item: any) => item.order || 0));
      
      // Create collection items
      for (let i = 0; items.length > i; i++)
      {
         const item = items[i];
         // Validate box consistency: documents and child collections must be in same box as parent collection
         if (item.documentId)
         {
            const docResp: any = yield call(getDocumentById, item.documentId);
            if (!docResp || !docResp.data)
            {
               const message = buildErrorAlert('Failed to add items: could not load document details');
               yield put(alertBarActions.DisplayAlertBox(message));
               return;
            }
            const doc = docResp.data.getDocumentDetails || docResp.data.listDocumentDetails?.items?.[0];
            const docBoxId = doc ? doc.documentDetailsBoxId : undefined;
            const parentBoxId = collection.collectionBoxId;
            if (docBoxId && parentBoxId && docBoxId !== parentBoxId)
            {
               const message = buildErrorAlert('Cannot add item: document must be in the same Box as the collection');
               yield put(alertBarActions.DisplayAlertBox(message));
               return;
            }
         }
         else if (item.childCollectionId)
         {
            const childResp: any = yield call(getCollection, item.childCollectionId);
            if (!childResp || !childResp.data || !childResp.data.getCollection)
            {
               const message = buildErrorAlert('Failed to add items: could not load child collection');
               yield put(alertBarActions.DisplayAlertBox(message));
               return;
            }
            const childCollection = childResp.data.getCollection;
            const childBoxId  = childCollection ? childCollection.collectionBoxId : undefined;
            const parentBoxId = collection.collectionBoxId;
            if (childBoxId && parentBoxId && childBoxId !== parentBoxId)
            {
               const message = buildErrorAlert('Cannot add item: child collection must be in the same Box as the parent collection');
               yield put(alertBarActions.DisplayAlertBox(message));
               return;
            }
         }
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
      if (-1 === currentIndex) { return; }
      
      const newIndex = 'up' === direction ? currentIndex - 1 : currentIndex + 1;
      if (0 > newIndex || newIndex >= items.length) { return; }
      
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
   yield takeLatest(collectionActions.loadCollectionRequest.type,  handleLoadCollection);

   yield takeLatest(collectionActions.createCollectionRequest.type, handleCreateCollection);
   yield takeLatest(collectionActions.updateCollectionRequest.type, handleUpdateCollection);

   yield takeLatest(collectionActions.addItemsRequest.type,    handleAddItems);
   yield takeLatest(collectionActions.removeItemRequest.type,  handleRemoveItem);
   yield takeLatest(collectionActions.reorderItemRequest.type, handleReorderItem);
};