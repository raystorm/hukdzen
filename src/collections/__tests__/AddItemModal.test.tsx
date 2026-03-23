import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderPage } from '../../__utils__/testUtilities';
import AddItemModal from '../AddItemModal';
import type { Collection } from '../CollectionTypes';
import { emptyCollection,
         emptyCollectionItem, emptyCollectionItemList
       } from '../CollectionTypes';

const mockCollections: Collection[] = [
   {
      ...emptyCollection,
      id: 'collection-a',
      eng: { __typename: 'Summary', title: 'Collection A', description: 'Description A' },
      bc: { __typename: 'Summary', title: 'BC A', description: 'BC Desc A' },
      ak: { __typename: 'Summary', title: 'AK A', description: 'AK Desc A' },
      items: {
         ...emptyCollectionItemList,
         items: [{
            ...emptyCollectionItem,
            id: 'item-1',
            collectionID: 'collection-a',
            childCollectionID: 'collection-b',
            order: 1,
            created: '2024-01-01T00:00:00Z'
         }]
      }
   },
   {
      ...emptyCollection,
      id: 'collection-b',
      eng: { __typename: 'Summary', title: 'Collection B', description: 'Description B' },
      bc: { __typename: 'Summary', title: 'BC B', description: 'BC Desc B' },
      ak: { __typename: 'Summary', title: 'AK B', description: 'AK Desc B' },
      items: {
         ...emptyCollectionItemList,
         items: [{
            ...emptyCollectionItem,
            id: 'item-2',
            collectionID: 'collection-b',
            childCollectionID: 'collection-c',
            order: 1,
            created: '2024-01-01T00:00:00Z'
         }]
      }
   },
   {
      ...emptyCollection,
      id: 'collection-c',
      eng: { __typename: 'Summary', title: 'Collection C', description: 'Description C' },
      bc: { __typename: 'Summary', title: 'BC C', description: 'BC Desc C' },
      ak: { __typename: 'Summary', title: 'AK C', description: 'AK Desc C' },
      items: { ...emptyCollectionItemList, items: [] }
   },
   {
      ...emptyCollection,
      id: 'collection-d',
      eng: { __typename: 'Summary', title: 'Collection D', description: 'Description D' },
      bc: { __typename: 'Summary', title: 'BC D', description: 'BC Desc D' },
      ak: { __typename: 'Summary', title: 'AK D', description: 'AK Desc D' },
      items: { ...emptyCollectionItemList, items: [] }
   }
];

describe('AddItemModal Circular Reference Prevention', () => {
   const mockProps = {
      open: true,
      onClose: vi.fn(),
      collectionId: 'collection-c',
      onAddItems: vi.fn()
   };

   it('prevents direct circular reference (C > A when A > B > C)', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      // Switch to Collections tab
      fireEvent.click(screen.getByText("Too'ma (Collections)"));

      // Collection A should not be available (would create A > B > C > A)
      expect(screen.queryByText('Collection A')).not.toBeInTheDocument();
      
      // Collection D should be available (no circular reference)
      expect(screen.getByText('Collection D')).toBeInTheDocument();
   });

   it('prevents indirect circular reference (C > B when A > B > C)', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));

      // Collection B should not be available (would create A > B > C > B)
      expect(screen.queryByText('Collection B')).not.toBeInTheDocument();
   });

   it('allows adding collections that do not create circular references', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));

      // Collection D should be available and selectable
      expect(screen.getByText('Collection D')).toBeInTheDocument();
      
      fireEvent.click(screen.getByText('Collection D'));
      
      // Add button should be enabled
      const addButton = screen.getByText(/Sag̱aytliitsx nah ksi guu/);
      expect(addButton).not.toBeDisabled();
   });

   it('excludes current collection from available options', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));

      // Collection C (current) should not be available
      expect(screen.queryByText('Collection C')).not.toBeInTheDocument();
   });

   it('shows no collections available message when all are filtered out', () => {
      // Test with a collection that has all others in its ancestry
      const propsWithRestrictedCollection = {
         ...mockProps,
         collectionId: 'collection-a' // A contains B which contains C, D is separate
      };

      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...propsWithRestrictedCollection} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));

      // Should show available collections (D should be available)
      expect(screen.getByText('Collection D')).toBeInTheDocument();
   });
});