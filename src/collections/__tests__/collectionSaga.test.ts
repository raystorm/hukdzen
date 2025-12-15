import { describe, it } from 'vitest';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import {
         getCollectionById, getCollections, getCollectionItemsForCollection,
         createCollection, createCollectionItem,
         updateCollection, updateCollectionItem,
         deleteCollectionItem,
         watchCollectionSaga,
       } from '../collectionSaga';
import { getDocumentById } from '../../docs/documentSaga';
import { collectionActions } from '../collectionSlice';
import type { Collection } from '../CollectionTypes';
import { uiActions } from '../../UI/uiSlice';

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
               ] as Collection[]
            }
         }
      }

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollections), mockResponse]
         ])
         .put(uiActions.setProcessing(true))
         .put(collectionActions.setCollections(mockResponse.data.listCollections.items))
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.getCollections())
         .run({ timeout: 1000 });
   });

   it('should handle load collections failure', () => {
      const error = new Error('API Error');

      return expectSaga(watchCollectionSaga)
         .provide([
            [call(getCollections), Promise.reject(error)]
         ])
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.getCollections())
         .run({ timeout: 1000 });
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
         .put(uiActions.setProcessing(true))
         .put(collectionActions.getCollections())
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.createCollection(mockCollection))
         .run({ timeout: 1000 });
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
         .put(uiActions.setProcessing(true))
         .put(collectionActions.getCollections())
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.updateCollection(mockCollection))
         .run({ timeout: 1000 });
   });

   it('should add items to collection successfully', () => {
      const mockPayload = {
         collectionId: 'collection-1',
         items: [{ documentId: 'doc-1' }, { childCollectionId: 'child-1' }]
      };

      const mockCollections = [
         { id: 'collection-1', items: { items: [] }, collectionBoxId: 'box-1' },
         { id: 'child-1', items: { items: [] }, collectionBoxId: 'box-1' }
      ];

      const mockCollection = {
         data: {
            getCollection: {
               id: 'collection-1',
               items: { items: [{ order: 1 }] },
               collectionBoxId: 'box-1'
            }
         }
      };

      const mockDocResponse = {
         data: {
            getDocumentDetails: {
               id: 'doc-1',
               documentDetailsBoxId: 'box-1'
            }
         }
      };

      const mockChildCollectionResponse = {
         data: {
            getCollection: {
               id: 'child-1',
               collectionBoxId: 'box-1',
               items: { items: [] }
            }
         }
      };

      return expectSaga(watchCollectionSaga)
         .withState({ collections: { items: mockCollections } })
         .provide([
            {
               call: (effect: any, next: any) => {
                  const fn = effect.fn;
                  const args = effect.args || [];
                  if (fn === getCollectionById)
                  {
                     const id = args[0];
                     if ('collection-1' === id ) { return mockCollection; }
                     if ('child-1' === id ) { return mockChildCollectionResponse; }
                     return { data: { getCollection: null } };
                  }
                  if (fn === getDocumentById)
                  {
                     const id = args[0];
                     if (id === 'doc-1') return mockDocResponse;
                     return { data: { getDocumentDetails: null } };
                  }
                  if (fn === createCollectionItem)
                  { return { data: { createCollectionItem: { id: 'ci-1' } } }; }
                  return next();
               }
            }
         ])
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.addItems(mockPayload))
         .run({ timeout: 1000 });
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
         .put(uiActions.setProcessing(true))
         .put(collectionActions.getCollectionById('collection-1'))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.removeItem(mockPayload))
         .run({ timeout: 1000 });
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
            [call(getCollectionItemsForCollection, 'collection-1'), mockItemsResponse]
         ])
         .put(uiActions.setProcessing(true))
         .put(collectionActions.getCollectionById('collection-1'))
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.reorderItem(mockPayload))
         .run({ timeout: 1000 });
   });

   it('should prevent circular reference in saga - self reference', () => {
      const mockPayload = {
         collectionId: 'collection-1',
         items: [{ childCollectionId: 'collection-1' }]
      };

      const mockCollections = [{ id: 'collection-1', items: { items: [] } }];

      return expectSaga(watchCollectionSaga)
         .withState({ collections: { items: mockCollections } })
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .not.put(collectionActions.getCollectionById('collection-1'))
         .dispatch(collectionActions.addItems(mockPayload))
         .run({ timeout: 1000 });
   });

   it('should prevent circular reference in saga - indirect loop', () => {
      const mockPayload = {
         collectionId: 'collection-c',
         items: [{ childCollectionId: 'collection-a' }]
      };

      const mockCollections = [
         {
            id: 'collection-a',
            items: { items: [{ childCollectionID: 'collection-b' }] }
         },
         {
            id: 'collection-b', 
            items: { items: [{ childCollectionID: 'collection-c' }] }
         },
         { id: 'collection-c', items: { items: [] } }
      ];

      return expectSaga(watchCollectionSaga)
         .withState({ collections: { items: mockCollections } })
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .not.put(collectionActions.getCollectionById('collection-c'))
         .dispatch(collectionActions.addItems(mockPayload))
         .run({ timeout: 1000 });
   });

   it('should allow valid collection additions in saga', () => {
      const mockPayload = {
         collectionId: 'collection-a',
         items: [{ childCollectionId: 'collection-d' }]
      };

      const mockCollections = [
         { id: 'collection-a', items: { items: [] } },
         { id: 'collection-d', items: { items: [] } }
      ];

      const mockCollection = {
         data: {
            getCollection: {
               id: 'collection-a',
               items: { items: [] }
            }
         }
      };

      return expectSaga(watchCollectionSaga)
         .withState({ collections: { items: mockCollections } })
         .provide([
            {
               call: (effect: any, next: any) => {
                  const fn = effect.fn;
                  const args = effect.args || [];
                  if (fn === getCollectionById)
                  {
                     const id = args[0];
                     if ('collection-a' === id) { return mockCollection; }
                     if ('collection-d' === id)
                     {
                        return {
                           data: {
                              getCollection: {
                                 id: 'collection-d', collectionBoxId: 'box-a',
                                 items: { items: [] }
                              }
                           }
                        };
                     }
                     return { data: { getCollection: null } };
                  }
                  if (fn === createCollectionItem)
                  { return { data: { createCollectionItem: { id: 'ci-2' } } }; }
                  return next();
               }
            }
         ])
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'alertMessage/DisplayAlertBox' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.addItems(mockPayload))
         .run({ timeout: 1000 });
   });

   it('should load collection with populated items successfully', () => {
      const mockCollectionResponse = {
         data: {
            getCollection: { id: 'collection-1', eng_title: 'Test Collection' }
         }
      };

      const mockItemsResponse = {
         data: {
            collectionItemsByCollectionID: {
               items: [{ id: 'item-1', order: 1 }],
               nextToken: null
            }
         }
      };

      const mockCollections = [{ id: 'collection-2' }];

      return expectSaga(watchCollectionSaga)
         .withState({ collections: { items: mockCollections } })
         .provide([
            [call(getCollectionById, 'collection-1'), mockCollectionResponse],
            [call(getCollectionItemsForCollection, 'collection-1'), mockItemsResponse]
         ])
         .put(uiActions.setProcessing(true))
         .put.like({ action: { type: 'collections/setCollections' } })
         .put(uiActions.setProcessing(false))
         .dispatch(collectionActions.getCollectionById('collection-1'))
         .run({ timeout: 1000 });
   });
});
