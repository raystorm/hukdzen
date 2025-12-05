import { describe, it, expect } from 'vitest';
import collectionReducer, { collectionActions } from '../collectionSlice';
import type { Collection } from '../CollectionTypes';

const mockCollection = {
   __typename: 'Collection' as const,
   id: '1',
   eng_title: 'Test Collection',
   eng_description: 'Test Description',
   bc_title: 'BC Title',
   bc_description: 'BC Description',
   ak_title: 'AK Title',
   ak_description: 'AK Description',
   created: '2024-01-01T00:00:00Z',
   updated: '2024-01-01T00:00:00Z',
   createdAt: '2024-01-01T00:00:00Z',
   updatedAt: '2024-01-01T00:00:00Z',
   collectionOwner: {} as any,
   box: {} as any,
   items: [],
   collectionCollectionOwnerId: '1',
   collectionBoxId: '1',
};

describe('collectionSlice', () => {
   it('should handle loadCollectionsRequest', () => {
      const state = collectionReducer(undefined, collectionActions.loadCollectionsRequest());
      
      expect(state.items).toEqual([]);
   });

   it('should handle setCollections', () => {
      const collections = [mockCollection];
      const state = collectionReducer(undefined, collectionActions.setCollections(collections));
      
      expect(state.items).toEqual(collections);
   });
});