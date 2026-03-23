import { describe, it, expect } from 'vitest';
import { collectionReducer, collectionActions } from '../collectionSlice';
import { Collection, emptyCollectionItemList } from '../CollectionTypes';
import { emptyCollection } from '../CollectionTypes';

const mockCollection: Collection = {
   __typename: 'Collection' as const,
   id: '1',
   eng: { __typename: 'Summary', title: 'Test Collection', description: 'Test Description' },
   bc: { __typename: 'Summary', title: 'BC Title', description: 'BC Description' },
   ak: { __typename: 'Summary', title: 'AK Title', description: 'AK Description' },
   created: '2024-01-01T00:00:00Z',
   updated: '2024-01-01T00:00:00Z',
   createdAt: '2024-01-01T00:00:00Z',
   updatedAt: '2024-01-01T00:00:00Z',
   contentOwner: {} as any,
   collectionContentOwnerUserId: '1',
   collectionContentOwnerId: '1',
   box: {} as any,
   items: emptyCollectionItemList,
   collectionBoxId: '1',
};

describe('collectionSlice', () => {
   it('should handle loadCollectionsRequest', () => {
      const state = collectionReducer(undefined, collectionActions.getCollections());
      
      expect(state.items).toEqual([]);
   });

   it('should handle setCollections', () => {
      const collections = [mockCollection];
      const state = collectionReducer(undefined,
                                      collectionActions.setCollections(collections));
      
      expect(state.items).toEqual(collections);
   });
});