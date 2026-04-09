import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

import { renderPageWithPath } from '../../__utils__/testUtilities';

import { emptyUser } from '../../User/userType';
import { emptyDocument } from '../../docs/DocumentTypes';

import CollectionDetailPage from '../CollectionDetailPage';
import type { Collection } from '../CollectionTypes';
import { emptyCollection, emptyCollectionItem, emptyCollectionItemList } from '../CollectionTypes';
import { collectionActions } from "../collectionSlice";
import { emptyBox } from "../../Box/boxTypes";
import { buildSummary } from "../../Content/ContentType";

const mockCollection: Collection = {
   ...emptyCollection,
   id: 'test-collection-1',
   eng: { __typename: 'Summary', title: 'Test Collection', description: 'Test Description' },
   bc: { __typename: 'Summary', title: 'Test BC Title', description: 'Test BC Description' },
   ak: { __typename: 'Summary', title: 'Test AK Title', description: 'Test AK Description' },
   contentOwner: {
      ...emptyUser,
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
   },
   box: {
      ...emptyBox,
      id: 'box-1',
      name: 'Test Box'
   },
   created: '2024-01-01T00:00:00Z',
   updated: '2024-01-01T00:00:00Z',
   items: {
      ...emptyCollectionItemList,
      items: []
   }
};

describe('CollectionDetailPage', () =>
{
   it('renders collection details when collection exists', () =>
   {
      const initialState = { collections: { items: [mockCollection] } };

      renderPageWithPath('/collections/test-collection-1',
                         '/collections/:collectionId',
                         <CollectionDetailPage />, initialState);

      expect(screen.getByText("Too'ma Yawłmx (Collection Details)")).toBeInTheDocument();
      expect(screen.getByText("Too'ma Yawłmx (Collection Information)")).toBeInTheDocument();
      expect(screen.getByText("Too'ma Amwaal (Collection Items) (0)")).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Collection')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test BC Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test AK Title')).toBeInTheDocument();
   });

   it('shows not found message when collection does not exist', () =>
   {
      const initialState = { collections: { items: [] } };

      renderPageWithPath('/collections/nonexistent',
                         '/collections/:collectionId',
                         <CollectionDetailPage />, initialState);

      expect(screen.getByText('Collection not found')).toBeInTheDocument();
   });

   it('opens add item modal when add button clicked', () =>
   {
      const initialState = { collections: { items: [mockCollection] } };

      renderPageWithPath('/collections/test-collection-1',
                         '/collections/:collectionId',
                         <CollectionDetailPage />, initialState);

      fireEvent.click(screen.getByText("Sag̱aytliitsx Amwaal (Add Item)"));
      expect(screen.getByText("Sag̱aytliitsx Amwaal ada Too'ma (Add Items to Collection)"))
        .toBeInTheDocument();
   });

   it('handles remove item action', () =>
   {
      const mockCollectionWithItems: Collection = {
         ...mockCollection,
         items: {
            ...emptyCollectionItemList,
            items: [{
               ...emptyCollectionItem,
               id: 'item-1',
               collectionItemsId: 'test-collection-1',
               collectionItemDocumentId: 'doc-1',
               document: {
                  ...emptyDocument,
                  id: 'doc-1',
                  eng: buildSummary('Test Document')
               },
               order: 1,
               created: '2024-01-01T00:00:00Z'
            }]
         }
      };

      const initialState = { collections: { items: [mockCollectionWithItems] } };

      const { store } = renderPageWithPath('/collections/test-collection-1',
                                           '/collections/:collectionId',
                                           <CollectionDetailPage />, initialState);

      const removeButton = screen.getByTitle('Remove from collection');
      fireEvent.click(removeButton);

      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({
            type: collectionActions.removeItem.type,
            payload: { collectionId: 'test-collection-1', itemId: 'item-1' }
         })
      );
   });
});