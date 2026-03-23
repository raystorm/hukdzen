import { call, put, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';

import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { Alert, buildErrorAlert, buildSuccessAlert, buildWarningAlert } from '../AlertBar/AlertBarTypes';
import { uiActions } from '../UI/uiSlice';

import { collectionActions } from './collectionSlice';
import {
   Collection, CollectionItem,
   CreateCollectionInput, UpdateCollectionInput,
   CreateCollectionItemInput, UpdateCollectionItemInput,
   AddItemsPayload, RemoveItemPayload, ReorderItemPayload, emptyCollectionItem,
} from './CollectionTypes';
import { CollectionInput, CollectionItemInput } from '../graphql/API';
import { getDocumentById, listCollectionItemsByDocumentId } from '../docs/documentSaga';
import { Xbiis } from "../Box/boxTypes";
import { getBoxById } from "../Box/boxSaga";
import { printTitles, buildSummary } from "../Content/ContentType";

const client = generateClient();

export function getCollectionById(id: string)
{ return client.graphql({ query: queries.getCollection, variables: { id } }); }

export function getCollections()
{ return client.graphql({ query: queries.listCollections }); }

export function getCollectionItemsForCollection(collectionId: string)
{
   return client.graphql({
                            query: queries.collectionItemsByCollectionID,
                            variables: { collectionID: collectionId }
                         });
}

export function getCollectionItemsByChildCollectionId(collectionId: string)
{
   return client.graphql({
                            query: queries.listCollectionItems,
                            variables: { filter: {
                               childCollectionID: { eq: collectionId }
                            } },
                         });
}

export function createCollection(collection: Collection)
{
   const input: CollectionInput = {
      eng: buildSummary(collection.eng?.title, collection.eng?.description),
      bc:  buildSummary(collection.bc?.title, collection.bc?.description),
      ak:  buildSummary(collection.ak?.title, collection.ak?.description),
      boxXbiisId:            collection.collectionBoxId,
      collectionOwnerUserId: collection.collectionContentOwnerUserId,
   };
   
   return client.graphql({
      query: mutations.createCollectionGuarded,
      variables: { input }
   });
}

export function updateCollection(collection: Collection)
{
   const input: CollectionInput = {
      id:                    collection.id,
      eng: buildSummary(collection.eng?.title, collection.eng?.description),
      bc:  buildSummary(collection.bc?.title, collection.bc?.description),
      ak:  buildSummary(collection.ak?.title, collection.ak?.description),
      boxXbiisId:            collection.collectionBoxId,
      collectionOwnerUserId: collection.collectionContentOwnerUserId,
   };
   
   return client.graphql({
      query: mutations.updateCollectionGuarded,
      variables: { input }
   });
}

export function createCollectionItem(item: CreateCollectionItemInput)
{
   const input: CollectionItemInput = {
      collectionCollectionId: item.collectionID,
      documentDetailsId:      item.documentID,
      childCollectionId:      item.childCollectionID,
      order:                  item.order,
   };
   
   return client.graphql({
      query: mutations.createCollectionItemGuarded,
      variables: { input }
   });
}

export function updateCollectionItem(item: UpdateCollectionItemInput)
{
   const input: CollectionItemInput = {
      id:                     item.id,
      collectionCollectionId: (item as any).collectionID,
      order:                  item.order,
   };
   
   return client.graphql({
      query: mutations.updateCollectionItemGuarded,
      variables: { input }
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

export function* clearParentCollections(collection: Collection)
{
   let removedCount = 0;
   const colItemsResp = yield call(getCollectionItemsByChildCollectionId, collection.id);
   const items = colItemsResp.data.listCollectionItems.items || [];

   // delete collection items that reference collections in the original box
   for (const item of items)
   {
      yield call(deleteCollectionItem, item.id);
      ++removedCount;
   }

   if (removedCount > 0)
   {
      const msg = `Removed ${printTitles(collection)} from ALL parent collection(s).`;
      const alertMessage = buildSuccessAlert(msg);
      yield put(alertBarActions.DisplayAlertBox(alertMessage));
   }
}

export function* handleGetCollections()
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

export function* handleCreateCollection(action: PayloadAction<Collection>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      yield call(createCollection, action.payload);
      yield put(collectionActions.createCollectionSuccess(action.payload));
      yield put(collectionActions.getCollections());

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
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      yield put(collectionActions.createCollectionFailure(errMsg));
      const message = buildErrorAlert(`Failed to create collection: ${errMsg}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleUpdateCollection(action: PayloadAction<Collection>)
{
   try
   {
      yield put(uiActions.setProcessing(true));

      const collection = action.payload;

      /* If the payload attempts to change the collection's box,
       * Additional Checks need to be run.
       * 1. Ensure the collection is empty
       * 2. Check for, and remove from, any parent Collections
       */
      let boxName: string | undefined;
      if (collection.collectionBoxId)
      {
         // load current collection to inspect existing box and items
         const currentResp: any = yield call(getCollectionById, collection.id);
         const current = currentResp.data.getCollection;
         const currentBoxId = current.collectionBoxId;
         const newBoxId = collection.collectionBoxId;

         //items.items is wierd, this reads like a bug.
         const hasItems = ( current.items && current.items.items
                         && 0 < current.items.items.length );
         if (newBoxId !== currentBoxId && hasItems) //checks for box changes and !empty
         {
            const message = ( 'Cannot move: this collection is not empty. '
                            + 'Remove all items before moving to a new Box.' );
            const alertMessage = buildErrorAlert(message);
            yield put(collectionActions.updateCollectionFailure(message));
            yield put(alertBarActions.DisplayAlertBox(alertMessage));
            return;
         }

         // collection is empty,
         // if box is changing get new box name for messaging.
         if ( newBoxId !== currentBoxId )
         {
            const missingBoxName = 'Missing box name';
            if ( !collection.box?.name )
            { // box name not in payload, need to load it
               const boxList = yield select((state) => state.boxList.items);
               const b = boxList?.find((bx: Xbiis) => bx && bx.id === newBoxId);
               boxName = b?.name;
               if ( !boxName ) //still not found, lookup
               {
                  const response = yield call(getBoxById, newBoxId);
                  const box = response.data.getXbiis;
                  boxName = box?.name;
               }
               if ( !boxName )
               {
                  console.warn('Missing Box name for ID:', newBoxId);
                  boxName = missingBoxName;
               }
            }
            else { boxName = collection.box.name || missingBoxName; }
         }
      }

      yield call(updateCollection, collection);
      yield put(collectionActions.updateCollectionSuccess(collection));
      //yield put(collectionActions.getCollections());
      yield put(collectionActions.getCollectionById(collection.id));

      let message: Alert;
      // boxName exists, so box was changed, and collection is empty.
      if ( boxName )
      {
        yield call(clearParentCollections, collection);
        message = buildSuccessAlert(`Collection saved and assigned to Box: ${boxName}.`);
      }
      else { message = buildSuccessAlert('Collection updated.'); }

      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      yield put(collectionActions.updateCollectionFailure(errMsg));
      const message = buildErrorAlert(`Failed to update collection: ${errMsg}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleAddItems(action: PayloadAction<AddItemsPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, items } = action.payload;

      if ( !items || 0 === items.length )
      {
         const message = buildWarningAlert('No items to add');
         yield put(alertBarActions.DisplayAlertBox(message));
         return;
      }
      
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
         
         if (wouldCreateCircularReference(item.childCollectionId!, collectionId,
                                          allCollections))
         {
            const message = buildErrorAlert('Cannot add collection: would create circular reference');
            yield put(alertBarActions.DisplayAlertBox(message));
            return;
         }
      }
      
      // Get current max order - ensure the parent collection response is present
      const response: any = yield call(getCollectionById, collectionId);
      if ( !response?.data?.getCollection )
      {
         const message = buildErrorAlert('Failed to add items: could not load parent collection');
         yield put(alertBarActions.DisplayAlertBox(message));
         return;
      }
      const collection = response.data.getCollection;
      const maxOrder = Math.max(0, ...(collection.items?.items || [])
                                      .map((item: any) => item.order || 0));

      const toCreate: CreateCollectionItemInput[] = []
      // validate collection items to create
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
            const doc = docResp.data.getDocument || docResp.data.listDocuments?.items?.[0];
            const docBoxId = doc ? doc.documentBoxXbiisId : undefined;
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
            const childResp: any = yield call(getCollectionById, item.childCollectionId);
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
          const collectionItem: CreateCollectionItemInput = {
             collectionID: collectionId,
             documentID: item.documentId,
             childCollectionID: item.childCollectionId,
             order: maxOrder + i + 1,
             created: new Date().toISOString()
          };

         toCreate.push(collectionItem);

       }
       for ( const collectionItem of toCreate )
       { yield call(createCollectionItem, collectionItem); }

      yield put(collectionActions.addItemsSuccess());
      // Reload the specific collection with populated items
      yield put(collectionActions.getCollectionById(collectionId));
      
      const message = buildSuccessAlert('Items added to collection');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      yield put(collectionActions.addItemsFailure(errMsg));
      const message = buildErrorAlert(`Failed to add items: ${errMsg}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleRemoveItem(action: PayloadAction<RemoveItemPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, itemId } = action.payload;
      yield call(deleteCollectionItem, itemId);
      yield put(collectionActions.removeItemSuccess());
      
      // Reload the specific collection with populated items
      yield put(collectionActions.getCollectionById(collectionId));
      
      const message = buildSuccessAlert('Item removed from collection');
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   catch (error)
   {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      yield put(collectionActions.removeItemFailure(errMsg));
      const message = buildErrorAlert(`Failed to remove item: ${errMsg}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleGetCollectionById(action: PayloadAction<string>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      // Get collection basic info
      const collectionResponse: any = yield call(getCollectionById, action.payload);
      const collection = collectionResponse.data.getCollection;
      
      // Get populated collection items
      const itemsResponse: any = yield call(getCollectionItemsForCollection, action.payload);
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

export function* handleReorderItem(action: PayloadAction<ReorderItemPayload>)
{
   try
   {
      yield put(uiActions.setProcessing(true));
      
      const { collectionId, itemId, direction } = action.payload;
      
      // Get populated items to work with
      const itemsResponse: any = yield call(getCollectionItemsForCollection, collectionId);
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
      yield put(collectionActions.reorderItemSuccess());
      
      // Reload the specific collection with populated items
      yield put(collectionActions.getCollectionById(collectionId));
   }
   catch (error)
   {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      yield put(collectionActions.reorderItemFailure(errMsg));
      const message = buildErrorAlert(`Failed to reorder item: ${errMsg}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
}

export function* watchCollectionSaga()
{
   yield takeLatest(collectionActions.getCollections.type,    handleGetCollections);
   yield takeLatest(collectionActions.getCollectionById.type, handleGetCollectionById);

   yield takeLatest(collectionActions.createCollection.type, handleCreateCollection);
   yield takeLatest(collectionActions.updateCollection.type, handleUpdateCollection);

   yield takeLatest(collectionActions.addItems.type,    handleAddItems);
   yield takeLatest(collectionActions.removeItem.type,  handleRemoveItem);
   yield takeLatest(collectionActions.reorderItem.type, handleReorderItem);
}