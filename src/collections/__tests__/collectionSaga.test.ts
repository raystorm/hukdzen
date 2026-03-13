import { describe, expect, it } from 'vitest';
import { expectSaga, } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { call, select } from 'redux-saga/effects';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert, buildWarningAlert, } from '../../AlertBar/AlertBarTypes';
import { uiActions } from '../../UI/uiSlice';

import {
   getCollectionById, getCollections, getCollectionItemsForCollection,
   getCollectionItemsByChildCollectionId,
   createCollection,
   createCollectionItem, updateCollection, updateCollectionItem, deleteCollectionItem,
   handleGetCollections, handleGetCollectionById,
   handleCreateCollection, handleUpdateCollection, handleRemoveItem,
   handleAddItems, handleReorderItem,
   clearParentCollections, watchCollectionSaga,
} from '../collectionSaga';
import { getDocumentById } from '../../docs/documentSaga';

import type { Collection, CollectionItem } from '../CollectionTypes';
import { collectionActions } from '../collectionSlice';
import { emptyCollection, emptyCollectionItem, emptyCollectionItemList } from '../CollectionTypes';

import { emptyUser } from '../../User/userType';

import type { Xbiis } from '../../Box/boxTypes';
import { emptyXbiis } from "../../Box/boxTypes";
import { getBoxById } from "../../Box/boxSaga";

function safeCollection(overrides: Partial<Collection> = {}): Collection
{
   return {
      ...emptyCollection,
      ...overrides,
      // Prevent recursion: items default to null unless overridden
      items: overrides.items ?? null,
      box: overrides.box ?? emptyXbiis,
      collectionOwner: overrides.collectionOwner ?? emptyUser,
   };
}

function safeItem(overrides: Partial<CollectionItem> = {}): CollectionItem
{
   return {
      ...emptyCollectionItem,
      ...overrides,
      // Prevent recursion: collection reference removed unless needed
      //@ts-expect-error
      collection: overrides.collection ?? undefined,
   };
}

describe('collectionSaga', () =>
{
   describe('handleGetCollections', () =>
   {
      it('should load collections successfully', () =>
      {
         const mockResponse = {
            data: {
               listCollections: {
                  items: [
                     safeCollection({
                                       id:              '1',
                                       eng_title:       'Test Collection',
                                       eng_description: 'Test Description',
                                    })
                  ]
               }
            }
         }

         return expectSaga(handleGetCollections)
                  .provide([[call(getCollections), mockResponse]])
                  .put(uiActions.setProcessing(true))
                  .call(getCollections)
                  .put(collectionActions.setCollections(
                       mockResponse.data.listCollections.items))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });

      it('should handle load collections failure', () =>
      {
         const error = new Error('API Error');
         const expectedAlert = buildErrorAlert('Failed to load collections: API Error');

         return expectSaga(handleGetCollections)
                  .provide([[call(getCollections), Promise.reject(error)]])
                  .put(uiActions.setProcessing(true))
                  .put(alertBarActions.DisplayAlertBox(expectedAlert))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });
   });

   describe('handleCreateCollection', () =>
   {
      it('should create collection successfully', () =>
      {
         const mockCollection = safeCollection({
                                                  id:              '1',
                                                  eng_title:       'New Collection',
                                                  eng_description: 'New Description',
                                                  bc_title:        'BC Title',
                                                  bc_description:  'BC Description',
                                                  ak_title:        'AK Title',
                                                  ak_description:  'AK Description',
                                                  collectionBoxId: 'box-1',
                                                  box: { ...emptyXbiis,
                                                         id: 'box-1', name: 'Box One' },
                                               });

         const mockResponse = { data: { createCollection: mockCollection } };

         const boxList: Xbiis[] = [{ ...emptyXbiis, id: 'box-1', name: 'Box One' }];

         const expectedAlert = buildSuccessAlert(
            'Collection saved and assigned to Box: Box One.');

         return expectSaga(handleCreateCollection,
                           collectionActions.createCollection(mockCollection))
                  .provide([
                              [call(createCollection, mockCollection), mockResponse],
                              [call(getCollections),
                               { data: { listCollections: { items: [] } } }]
                           ])
                  .withState({ boxList: { items: boxList } })
                  .put(uiActions.setProcessing(true))
                  .call(createCollection, mockCollection)
                  .put(collectionActions.createCollectionSuccess(mockCollection))
                  .put(collectionActions.getCollections())
                  .put(alertBarActions.DisplayAlertBox(expectedAlert))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });

      it('handleCreateCollection - handles create failure', () =>
      {
         const mockCollection = safeCollection({
                                                  id:        '1',
                                                  eng_title: 'New Collection',
                                               });

         const error = new Error('Create failed');
         const expectedAlert = buildErrorAlert(
            'Failed to create collection: Create failed');

         return expectSaga(handleCreateCollection,
                           collectionActions.createCollection(mockCollection))
                  .provide([
                              [call(createCollection, mockCollection),
                               Promise.reject(error)],
                           ])
                  .put(uiActions.setProcessing(true))
                  .put(collectionActions.createCollectionFailure('Create failed'))
                  .put(alertBarActions.DisplayAlertBox(expectedAlert))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });
   });

   describe('handleUpdateCollection', () =>
   {
      describe('happy path', () =>
      {
         it('should update collection successfully when box unchanged', () =>
         {
            const box: Xbiis = { ...emptyXbiis, id: 'box-1', name: 'Box One' };

            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     eng_title:       'Updated Collection',
                                                     eng_description: 'Updated Description',
                                                     bc_title:        'Updated BC Title',
                                                     bc_description:  'Updated BC Description',
                                                     ak_title:        'Updated AK Title',
                                                     ak_description:  'Updated AK Description',
                                                     collectionBoxId: 'box-1',
                                                     box:             box,
                                                  });

            const currentCollection = safeCollection({ id: '1', box: box,
                                                       collectionBoxId: 'box-1',
                                                     });

            const mockResponse = { data: { updateCollection: mockCollection } };

            const expectedAlert = buildSuccessAlert('Collection updated.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [call(updateCollection, mockCollection), mockResponse],
                                 [call(getCollections), { data: { listCollections: { items: [] } } }]
                              ])
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .put(collectionActions.getCollectionById('1'))
                     .not.call.fn(clearParentCollections)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should update collection and clear parent collections when box changes',
            () =>
         {
            //explicit `items: null`, to ensure empty for the test
            const mockCollection = safeCollection({ id: '1', items: null,
                                                     collectionBoxId: 'new-box',
                                                     box: {
                                                        ...emptyXbiis,
                                                        id:   'new-box',
                                                        name: 'New Box'
                                                     },
                                                  });

            //explicit `items: null`, to ensure empty for the test
            const currentCollection = safeCollection({ id: '1', items: null,
                                                       collectionBoxId: 'old-box',
                                                     });

            const mockResponse = { data: { updateCollection: mockCollection }, };

            const expectedAlert = buildSuccessAlert(
               'Collection saved and assigned to Box: New Box.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [call(updateCollection, mockCollection), mockResponse],
                                 [call(getCollections),
                                  { data: { listCollections: { items: [] } } }],
                                 [call(getCollectionItemsByChildCollectionId, '1'),
                                  { data: { listCollectionItems: { items: [] } } }]
                              ])
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .put(collectionActions.getCollectionById('1'))
                     .call(clearParentCollections, mockCollection)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should update collection without clearing parents when box does not change',
            () =>
         {
            const mockCollection = safeCollection({
                                                     id: '1',
                                                     collectionBoxId: 'same-box',
                                                     box:   { ...emptyXbiis, name: 'Same Box' },
                                                     items: { ...emptyCollectionItemList, items: [] }
                                                  });

            const currentCollection = safeCollection({
                                                        id: '1',
                                                        collectionBoxId: 'same-box',
                                                        items: { ...emptyCollectionItemList, items: [] }
                                                     });

            const expectedAlert = buildSuccessAlert('Collection updated.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [call(updateCollection, mockCollection),
                                  { data: { updateCollection: mockCollection } }],
                                 [call(getCollections),
                                  { data: { listCollections: { items: [] } } }]
                              ])
                     .put(collectionActions.getCollectionById('1'))
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .not.call.fn(clearParentCollections)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .run({ timeout: 1000 });
         });

         it('should preserve existing items when updating a collection', () =>
         {
            // Existing collection in store with items
            const existing = safeCollection({
                                               id: '1',
                                               collectionBoxId: 'box-1',
                                               items: {
                                                  ...emptyCollectionItemList,
                                                  items: [safeItem({ id: 'ci-1', order: 1 })]
                                               }
                                            });

            // Update payload (does not include items)
            const updated = safeCollection({
                                              id: '1',
                                              collectionBoxId: 'box-1',
                                              eng_title: 'Updated Title'
                                           });

            // listCollections response (missing items, as Amplify returns)
            const byIdResponse = { data: { getCollection: updated } };

            const itemsResponse = {
               data:
                  { collectionItemsByCollectionID:
                        { ...emptyCollectionItemList,
                          items: [safeItem({ id: 'ci-1', order: 1 })],
                          nextToken: null
                        }
                  }
            };

            //test against the watcher, so the follow-up getCollectionById
            // is called and validated too
            return expectSaga(watchCollectionSaga)
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: existing } }],
                                 [call(updateCollection, updated),
                                  { data: { updateCollection: updated } }],
                                 [call(getCollectionById, '1'), byIdResponse],
                                 [call(getCollectionItemsForCollection, '1'),
                                  itemsResponse],
                             ])
                     .withState({ collections: { items: [existing] } })
                     // Trigger the updateCollection action
                     .dispatch(collectionActions.updateCollection(updated))
                     //getCollectionById, populates collectionItems
                     .put(collectionActions.getCollectionById('1'))
                     .not.put(collectionActions.getCollections())
                     //validate collections are set with items.
                     .put.like({
                                  action: {
                                     type: collectionActions.setCollections.type,
                                     payload: [{
                                        id: '1',
                                        items: { items: [{ id: 'ci-1' } ] }
                                     }]
                                  }
                               })
                     .run();
         });
      });

      describe('Box Name Resolution', () =>
      {
         it('should resolve box name from store when missing in payload', () =>
         {
            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     collectionBoxId: 'box-123',
                                                     box:             undefined,
                                                  });

            const currentCollection = safeCollection({
                                                        id:              '1',
                                                        collectionBoxId: 'old-box',
                                                     });

            const boxList = [{ ...emptyXbiis, id: 'box-123', name: 'Resolved Box' }];

            const mockResponse = {
               data: { updateCollection: mockCollection },
            };

            const expectedAlert = buildSuccessAlert(
               'Collection saved and assigned to Box: Resolved Box.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .withState({ boxList: { items: boxList } })
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [select((state: any) => state.boxList.items), boxList],
                                 [call(updateCollection, mockCollection), mockResponse],
                                 [call(getCollections),
                                  { data: { listCollections: { items: [] } } }],
                                 [call(getCollectionItemsByChildCollectionId, '1'),
                                  { data: { listCollectionItems: { items: [] } } }]
                              ])
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     //.select((state) => state.boxList.items)
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .put(collectionActions.getCollectionById('1'))
                     .call(clearParentCollections, mockCollection)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should resolve box name via network lookup when not in store', () =>
         {
            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     collectionBoxId: 'box-123',
                                                     box:             undefined,
                                                     items:           { ...emptyCollectionItemList, items: [] }
                                                  });

            const currentCollection = safeCollection({
                                                        id:              '1',
                                                        collectionBoxId: 'old-box',
                                                        items:           { ...emptyCollectionItemList, items: [] }
                                                     });

            const mockBoxResponse = {
               data: { getXbiis: { id: 'box-123', name: 'Network Box' } }
            };

            const expectedAlert = buildSuccessAlert(
               'Collection saved and assigned to Box: Network Box.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [select((state: any) => state.boxList.items), []],
                                 [call(getBoxById, 'box-123'), mockBoxResponse],
                                 [call(updateCollection, mockCollection),
                                  { data: { updateCollection: mockCollection } }],
                                 [call(getCollections),
                                  { data: { listCollections: { items: [] } } }],
                                 [call(getCollectionItemsByChildCollectionId, '1'),
                                  { data: { listCollectionItems: { items: [] } } }]
                              ])
                     .withState({ boxList: { items: [] } })
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     //.select((state) => state.boxList.items)
                     .call(getBoxById, 'box-123')
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .put(collectionActions.getCollectionById('1'))
                     .call(clearParentCollections, mockCollection)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should use fallback box name when store and network lookups fail', () =>
         {
            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     collectionBoxId: 'box-123',
                                                     box:             undefined,
                                                  });

            const currentCollection = safeCollection({
                                                        id:              '1',
                                                        collectionBoxId: 'old-box',
                                                     });

            const mockResponse = { data: { updateCollection: mockCollection }, };

            const expectedAlert = buildSuccessAlert(
               'Collection saved and assigned to Box: Missing box name.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [select((state: any) => state.boxList.items), []],
                                 [call(getBoxById, 'box-123'), { data: { getXbiis: null } }],
                                 [call(updateCollection, mockCollection), mockResponse],
                                 [call(getCollections),
                                  { data: { listCollections: { items: [] } } }],
                                 [call(getCollectionItemsByChildCollectionId, '1'),
                                  { data: { listCollectionItems: { items: [] } } }]
                              ])
                     .withState({ boxList: { items: [] } })
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     //.select((state: any) => state.boxList.items)
                     .call(getBoxById, 'box-123')
                     .call(updateCollection, mockCollection)
                     .put(collectionActions.updateCollectionSuccess(mockCollection))
                     .put(collectionActions.getCollectionById('1'))
                     .call(clearParentCollections, mockCollection)
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });
      });

      describe('Validation and Error Prevention', () =>
      {
         it('should block move when collection is not empty', () =>
         {
            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     collectionBoxId: 'new-box',
                                                     box: { ...emptyXbiis,
                                                            id: 'new-box',
                                                            name: 'New Box' },
                                                  });

            const currentCollection = safeCollection({
                                                        id:              '1',
                                                        collectionBoxId: 'old-box',
                                                        items:           {
                                                           ...emptyCollectionItemList,
                                                           items: [safeItem({ id: 'child-1' })]
                                                        },
                                                     });

            const expectedAlert = buildErrorAlert(
               'Cannot move: this collection is not empty. '
               + 'Remove all items before moving to a new Box.');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(
                                 mockCollection))
               .provide([
                           [call(getCollectionById, '1'),
                            { data: { getCollection: currentCollection } }],
                        ])
               .put(uiActions.setProcessing(true))
               .call(getCollectionById, '1')
               .put(collectionActions.updateCollectionFailure(
                  'Cannot move: this collection is not empty. '
                  + 'Remove all items before moving to a new Box.'))
               .put(alertBarActions.DisplayAlertBox(expectedAlert))
               .not.call(updateCollection, mockCollection)
               .not.call.fn(clearParentCollections)
               .put(uiActions.setProcessing(false))
               .run({ timeout: 1000 });
         });

         it('handleUpdateCollection - handles update failure', () =>
         {
            const mockCollection = safeCollection({
                                                     id:              '1',
                                                     eng_title:       'Updated Collection',
                                                     collectionBoxId: 'box-1',
                                                     box: { ...emptyXbiis,
                                                            id: 'box-1', name: 'Box One'
                                                          },
                                                  });

            const currentCollection = safeCollection({
                                                        id:              '1',
                                                        collectionBoxId: 'box-1',
                                                     });

            const error = new Error('Update failed');

            const expectedAlert = buildErrorAlert(
               'Failed to update collection: Update failed');

            return expectSaga(handleUpdateCollection,
                              collectionActions.updateCollection(
                                 mockCollection))
                     .provide([
                                 [call(getCollectionById, '1'),
                                  { data: { getCollection: currentCollection } }],
                                 [call(updateCollection, mockCollection),
                                  Promise.reject(error)],
                              ])
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, '1')
                     .put(collectionActions.updateCollectionFailure('Update failed'))
                     .put(alertBarActions.DisplayAlertBox(expectedAlert))
                     .put(uiActions.setProcessing(false))
                     .run();
         });
      });
   });

   describe('handleAddItems', () =>
   {
      describe('happy path', () =>
      {
         it('should add items to collection successfully', () =>
         {
            const payload = {
               collectionId: 'collection-1',
               items:        [{ documentId: 'doc-1' }, { childCollectionId: 'child-1' }]
            };

            const mockCollections = [
               safeCollection({ id: 'collection-1', collectionBoxId: 'box-1' }),
               safeCollection({ id: 'child-1', collectionBoxId: 'box-1' })
            ];

            const parentCollection = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'collection-1',
                                                   collectionBoxId: 'box-1',
                                                   items:           {
                                                      ...emptyCollectionItemList,
                                                      items: [safeItem({ id: 'existing', order: 1 })]
                                                   },
                                                })
               }
            };

            const mockDocResponse = {
               data: {
                  getDocument: { id: 'doc-1', documentBoxId: 'box-1' }
               }
            };

            const mockChildCollectionResponse = {
               data: {
                  getCollection:
                     safeCollection({ id: 'child-1', collectionBoxId: 'box-1' })
               }
            };

            const successAlert = buildSuccessAlert('Items added to collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'collection-1'), parentCollection],
                                 [call(getCollectionById, 'child-1'), mockChildCollectionResponse],
                                 [call(getDocumentById, 'doc-1'), mockDocResponse],
                                 [matchers.call.like({ fn: createCollectionItem }),
                                  { data: { createCollectionItem: { id: 'ci-1' } } }],
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, 'collection-1')
                     // .call(getDocumentById, 'doc-1')
                     .call.like({
                                   fn:   createCollectionItem,
                                   args: [{ collectionID: 'collection-1' }]
                                })
                     .call(getCollectionById, 'child-1')
                     // .call.like({
                     //               fn: createCollectionItem,
                     //               args: [{childCollectionID: 'child-1'}]
                     //            })
                     .put(collectionActions.addItemsSuccess())
                     .put(collectionActions.getCollectionById('collection-1'))
                     .put(alertBarActions.DisplayAlertBox(successAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should allow valid collection additions in saga', () =>
         {
            const payload = {
               collectionId: 'collection-a',
               items:        [{ childCollectionId: 'collection-d' }]
            };

            const mockCollections = [
               safeCollection({ id: 'collection-a', }),
               safeCollection({ id: 'collection-d', collectionBoxId: 'box-a' })
            ];

            const parentResponse = {
               data: {
                  getCollection: safeCollection({ id: 'collection-a' })
               }
            };

            const childResponse = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'collection-d',
                                                   collectionBoxId: 'box-a',
                                                }),
               },
            };

            const successAlert = buildSuccessAlert('Items added to collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'collection-a'), parentResponse],
                                 [call(getCollectionById, 'collection-d'), childResponse],
                                 [matchers.call.fn(createCollectionItem),
                                  { data: { createCollectionItem: { id: 'ci-2' } } }],
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .put(collectionActions.addItemsSuccess())
                     .put(collectionActions.getCollectionById('collection-a'))
                     .put(alertBarActions.DisplayAlertBox(successAlert))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });
      });

      describe('Circular Reference', () =>
      {
         it('should prevent circular reference in saga - self reference', () =>
         {
            const payload = {
               collectionId: 'collection-1',
               items:        [{ childCollectionId: 'collection-1' }]
            };

            const mockCollections = [safeCollection({ id: 'collection-1' })];

            const errorAlert = buildErrorAlert('Cannot add collection to itself');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.put(collectionActions.getCollectionById('collection-1'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should prevent circular reference in saga - indirect loop', () =>
         {
            const payload = {
               collectionId: 'collection-c',
               items:        [{ childCollectionId: 'collection-a' }]
            };

            const mockCollections = [
               safeCollection({
                                 id:    'collection-a',
                                 items: {
                                    ...emptyCollectionItemList,
                                    items: [safeItem({ childCollectionID: 'collection-b' })]
                                 }
                              }),
               safeCollection({
                                 id:    'collection-b',
                                 items: {
                                    ...emptyCollectionItemList,
                                    items: [safeItem({ childCollectionID: 'collection-c' })]
                                 }
                              }),
               safeCollection({ id: 'collection-c', items: null })
            ];

            const errorAlert = buildErrorAlert(
               'Cannot add collection: would create circular reference');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.put(collectionActions.getCollectionById('collection-c'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });
      });

      describe('Validation and Error Prevention', () =>
      {
         it('should prevent adding document from different box', () =>
         {
            const payload = {
               collectionId: 'collection-1',
               items:        [{ documentId: 'doc-1' }]
            };

            const box1 = { ...emptyXbiis, id: 'box-1', name: 'Box One' };
            const box2 = { ...emptyXbiis, id: 'box-2', name: 'Box Two' };

            const mockCollections = [
               safeCollection({ id: 'collection-1', collectionBoxId: 'box-1', box: box1 })
            ];

            const parentResponse = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'collection-1',
                                                   collectionBoxId: 'box-1',
                                                   box:             box1,
                                                   items:           { ...emptyCollectionItemList, items: [] }
                                                })
               }
            };

            const docResponse = {
               data: {
                  getDocument: { id: 'doc-1', documentBoxXbiisId: 'box-2', box: box2 }
               }
            };

            const errorAlert = buildErrorAlert(
               'Cannot add item: document must be in the same Box as the collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'collection-1'), parentResponse],
                                 [call(getDocumentById, 'doc-1'), docResponse]
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.call.fn(createCollectionItem)
                     .not.put(collectionActions.getCollectionById('collection-1'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should prevent adding child collection from different box', () =>
         {
            const payload = {
               collectionId: 'collection-1',
               items:        [{ childCollectionId: 'child-1' }]
            };

            const box1 = { ...emptyXbiis, id: 'box-1', name: 'Box One' };
            const box2 = { ...emptyXbiis, id: 'box-2', name: 'Box Two' };

            const mockCollections = [
               safeCollection({ id: 'collection-1', collectionBoxId: 'box-1', box: box1 })
            ];

            const parentResponse = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'collection-1',
                                                   collectionBoxId: 'box-1',
                                                   box:             box1,
                                                   items:           { ...emptyCollectionItemList, items: [] }
                                                })
               }
            };

            const childResponse = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'child-1',
                                                   collectionBoxId: 'box-2',
                                                   box:             box2
                                                })
               }
            };

            const errorAlert = buildErrorAlert(
               'Cannot add item: child collection must be in the same Box as the parent collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'collection-1'), parentResponse],
                                 [call(getCollectionById, 'child-1'), childResponse]
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.call.fn(createCollectionItem)
                     .not.put(collectionActions.getCollectionById('collection-1'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should stop early when mixed valid + invalid items are provided', () =>
         {
            const payload = {
               collectionId: 'collection-1',
               items:        [
                  { documentId: 'doc-1' },          // valid
                  { childCollectionId: 'missing' }  // invalid: child not found
               ]
            };

            const mockCollections = [
               safeCollection({ id: 'collection-1', collectionBoxId: 'box-1' })
            ];

            const parentResponse = {
               data: {
                  getCollection: safeCollection({
                                                   id:              'collection-1',
                                                   collectionBoxId: 'box-1',
                                                   items:           { ...emptyCollectionItemList, items: [] }
                                                })
               }
            };

            const mockDocResponse = {
               data: { getDocument: { id: 'doc-1', documentBoxId: 'box-1' } }
            };

            const errorAlert = buildErrorAlert('Failed to add items: could not load child collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'collection-1'), parentResponse],
                                 [call(getDocumentById, 'doc-1'), mockDocResponse],
                                 [call(getCollectionById, 'missing'),
                                  { data: { getCollection: null } }],
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, 'collection-1')
                     .call(getDocumentById, 'doc-1')
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.call.fn(createCollectionItem)
                     .not.put(collectionActions.getCollectionById('collection-1'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should handle addItems with an empty items array gracefully', () =>
         {
            const payload = { collectionId: 'collection-1', items: [] };

            const mockCollections = [ safeCollection({ id: 'collection-1' }) ];

            const warn = buildWarningAlert('No items to add');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .not.call.fn(getCollectionById)
                     .not.call.fn(createCollectionItem)
                     .not.put(collectionActions.getCollectionById('collection-1'))
                     .put(alertBarActions.DisplayAlertBox(warn))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });

         it('should handle addItems when parent collection is not found', () =>
         {
            const payload = {
               collectionId: 'missing-parent',
               items:        [{ documentId: 'doc-1' }]
            };

            const mockCollections = [];

            const errorAlert = buildErrorAlert('Failed to add items: could not load parent collection');

            return expectSaga(handleAddItems, collectionActions.addItems(payload))
                     .provide([
                                 [call(getCollectionById, 'missing-parent'),
                                  { data: { getCollection: null } }]
                              ])
                     .withState({ collections: { items: mockCollections } })
                     .put(uiActions.setProcessing(true))
                     .call(getCollectionById, 'missing-parent')
                     .put(alertBarActions.DisplayAlertBox(errorAlert))
                     .not.call.fn(createCollectionItem)
                     .not.put(collectionActions.getCollectionById('missing-parent'))
                     .put(uiActions.setProcessing(false))
                     .run({ timeout: 1000 });
         });
      });
   });

   describe('handleRemoveItem', () =>
   {
      it('should remove item from collection successfully', () =>
      {
         const payload = { collectionId: 'collection-1', itemId: 'item-1' };

         const successAlert = buildSuccessAlert('Item removed from collection');

         return expectSaga(handleRemoveItem, collectionActions.removeItem(payload))
                  .provide([[call(deleteCollectionItem, 'item-1'), { data: {} }]])
                  .put(uiActions.setProcessing(true))
                  .call(deleteCollectionItem, 'item-1')
                  .put(collectionActions.removeItemSuccess())
                  .put(collectionActions.getCollectionById('collection-1'))
                  .put(alertBarActions.DisplayAlertBox(successAlert))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });
   });

   describe('handleGetCollectionById', () =>
   {
      it('should load collection with populated items successfully', () =>
      {
         const mockCollectionResponse = {
            data: {
               getCollection: safeCollection({
                                                id:        'collection-1',
                                                eng_title: 'Test Collection'
                                             })
            }
         };

         const mockItemsResponse = {
            data: {
               collectionItemsByCollectionID: {
                  items:     [{ id: 'item-1', order: 1 }],
                  nextToken: null
               }
            }
         };

         const mockCollections = [safeCollection({ id: 'collection-2' })];

         return expectSaga(handleGetCollectionById,
                           collectionActions.getCollectionById('collection-1'))
                  .provide([
                              [call(getCollectionById, 'collection-1'),
                               mockCollectionResponse],
                              [call(getCollectionItemsForCollection, 'collection-1'),
                               mockItemsResponse]
                           ])
                  .withState({ collections: { items: mockCollections } })
                  .put(uiActions.setProcessing(true))
                  .call(getCollectionById, 'collection-1')
                  .call(getCollectionItemsForCollection, 'collection-1')
                  //TODO: validate put with found collections
                  .put.like({
                                action: {
                                   type: collectionActions.setCollections.type,
                                   payload: [{
                                               id: 'collection-1',
                                               items: { items: [{ id: 'item-1', order: 1 } ] }
                                   }]
                                }
                             })
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });
   });

   describe('handleReorderItem', () =>
   {
      it('should reorder items successfully', () =>
      {
         const payload = {
            collectionId: 'collection-1',
            itemId:       'item-1',
            direction:    'up' as const
         };

         const mockItemsResponse = {
            data: {
               collectionItemsByCollectionID: {
                  ...emptyCollectionItemList,
                  items: [
                     safeItem({ id: 'item-1', order: 2 }),
                     safeItem({ id: 'item-2', order: 1 })
                  ],
               }
            }
         };

         return expectSaga(handleReorderItem, collectionActions.reorderItem(payload))
                  .provide([
                              [call(getCollectionItemsForCollection, 'collection-1'),
                               mockItemsResponse]
                           ])
                  .put(uiActions.setProcessing(true))
                  .call(getCollectionItemsForCollection, 'collection-1')
                  .call(updateCollectionItem, { id: 'item-1', order: 1 })
                  .call(updateCollectionItem, { id: 'item-2', order: 2 })
                  .put(collectionActions.reorderItemSuccess())
                  .put(collectionActions.getCollectionById('collection-1'))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });

      it('should not reorder when the first item is moved up', () =>
      {
         const payload = {
            collectionId: 'collection-1',
            itemId:       'item-1',
            direction:    'up' as const
         };

         const mockItemsResponse = {
            data: {
               collectionItemsByCollectionID: {
                  ...emptyCollectionItemList,
                  items: [
                     safeItem({ id: 'item-1', order: 1 }),
                     safeItem({ id: 'item-2', order: 2 })
                  ]
               }
            }
         };

         return expectSaga(handleReorderItem, collectionActions.reorderItem(payload))
                  .provide([
                              [call(getCollectionItemsForCollection, 'collection-1'),
                               mockItemsResponse]
                           ])
                  .put(uiActions.setProcessing(true))
                  .call(getCollectionItemsForCollection, 'collection-1')
                  .not.call(updateCollectionItem)
                  .not.put(collectionActions.getCollectionById('collection-1'))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });

      it('should not reorder when the last item is moved down', () =>
      {
         const payload = {
            collectionId: 'collection-1',
            itemId:       'item-2',
            direction:    'down' as const
         };

         const mockItemsResponse = {
            data: {
               collectionItemsByCollectionID: {
                  ...emptyCollectionItemList,
                  items: [
                     safeItem({ id: 'item-1', order: 1 }),
                     safeItem({ id: 'item-2', order: 2 })
                  ]
               }
            }
         };

         return expectSaga(handleReorderItem, collectionActions.reorderItem(payload))
                  .provide([
                              [call(getCollectionItemsForCollection, 'collection-1'),
                               mockItemsResponse]
                           ])
                  .put(uiActions.setProcessing(true))
                  .call(getCollectionItemsForCollection, 'collection-1')
                  .not.call(updateCollectionItem)
                  .not.put(collectionActions.getCollectionById('collection-1'))
                  .put(uiActions.setProcessing(false))
                  .run({ timeout: 1000 });
      });
   });
});
