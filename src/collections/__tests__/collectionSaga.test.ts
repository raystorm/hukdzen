import { describe, it, expect } from 'vitest';
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { watchCollectionSaga, getCollections } from '../collectionSaga';
import { collectionActions } from '../collectionSlice';

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
});