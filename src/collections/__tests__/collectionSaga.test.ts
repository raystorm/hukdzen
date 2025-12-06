import { describe, it, expect } from 'vitest';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { watchCollectionSaga, getCollections, createCollection, updateCollection, getCollection, createCollectionItem, deleteCollectionItem, updateCollectionItem, getCollectionItems } from '../collectionSaga';
import { collectionActions } from '../collectionSlice';
import type { Collection } from '../CollectionTypes';

describe('collectionSaga', () => {
   it('should load collections successfully', () => {
      const mockResponse = {
         data: {
            listCollections: {
               items: [
                  {
                     id: '1',
                     eng_title: 'Test Collection',
                     eng_description: 'Test Description',
                  }
               ]
            }
         }
      };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollections), mockResponse]
         ])
         .put(collectionActions.setCollections(mockResponse.data.listCollections.items))
         .dispatch(collectionActions.loadCollectionsRequest())
         .run();
   });

   it('should handle load collections failure', () => {
      const error = new Error('API Error');

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollections), Promise.reject(error)]
         ])
         .dispatch(collectionActions.loadCollectionsRequest())
         .run();
   });

   it('should create collection successfully', () => {
      const mockCollection = {
         eng_title: 'New Collection',
         eng_description: 'New Description',
         bc_title: 'BC Title',
         bc_description: 'BC Description',
         ak_title: 'AK Title',
         ak_description: 'AK Description'
      } as Collection;

      const mockResponse = { data: { createCollection: mockCollection } };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(createCollection, mockCollection), mockResponse],
            [call(getCollections), { data: { listCollections: { items: [] } } }]
         ])
         .put(collectionActions.loadCollectionsRequest())
         .dispatch(collectionActions.createCollectionRequest(mockCollection))
         .run();
   });

   it('should update collection successfully', () => {
      const mockCollection = {
         id: '1',
         eng_title: 'Updated Collection',
         eng_description: 'Updated Description',
         bc_title: 'Updated BC Title',
         bc_description: 'Updated BC Description',
         ak_title: 'Updated AK Title',
         ak_description: 'Updated AK Description'
      } as Collection;

      const mockResponse = { data: { updateCollection: mockCollection } };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(updateCollection, mockCollection), mockResponse],
            [call(getCollections), { data: { listCollections: { items: [] } } }]
         ])
         .put(collectionActions.loadCollectionsRequest())
         .dispatch(collectionActions.updateCollectionRequest(mockCollection))
         .run();
   });

   it('should add items to collection successfully', () => {
      const mockPayload = {
         collectionId: 'collection-1',
         items: [{ documentId: 'doc-1' }, { childCollectionId: 'child-1' }]
      };

      const mockCollection = {
         data: {
            getCollection: {
               id: 'collection-1',
               items: { items: [{ order: 1 }] }
            }
         }
      };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollection, 'collection-1'), mockCollection],
            [call(createCollectionItem, expect.any(Object)), { data: {} }]
         ])
         .put(collectionActions.loadCollectionRequest('collection-1'))
         .dispatch(collectionActions.addItemsRequest(mockPayload))
         .run();
   });

   it('should remove item from collection successfully', () => {
      const mockPayload = {
         collectionId: 'collection-1',
         itemId: 'item-1'
      };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(deleteCollectionItem, 'item-1'), { data: {} }]
         ])
         .put(collectionActions.loadCollectionRequest('collection-1'))
         .dispatch(collectionActions.removeItemRequest(mockPayload))
         .run();
   });

   it('should reorder items successfully', () => {
      const mockPayload = {
         collectionId: 'collection-1',
         itemId: 'item-1',
         direction: 'up' as const
      };

      const mockItemsResponse = {
         data: {
            collectionItemsByCollectionID: {
               items: [
                  { id: 'item-1', order: 2 },
                  { id: 'item-2', order: 1 }
               ]
            }
         }
      };

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollectionItems, 'collection-1'), mockItemsResponse],
            [call(updateCollectionItem, expect.any(Object)), { data: {} }]
         ])
         .put(collectionActions.loadCollectionRequest('collection-1'))
         .dispatch(collectionActions.reorderItemRequest(mockPayload))
         .run();
   });
});