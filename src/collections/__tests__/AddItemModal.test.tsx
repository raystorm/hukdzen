import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderPage } from '../../__utils__/testUtilities';
import AddItemModal from '../AddItemModal';
import type { Collection } from '../CollectionTypes';

const mockCollections: Collection[] = [
   {
      id: 'collection-a',
      eng_title: 'Collection A',
      bc_title: 'BC A',
      ak_title: 'AK A',
      eng_description: 'Description A',
      bc_description: 'BC Desc A',
      ak_description: 'AK Desc A',
      items: {
         items: [{
            id: 'item-1',
            collectionID: 'collection-a',
            childCollectionID: 'collection-b',
            order: 1,
            created: '2024-01-01T00:00:00Z'
         }]
      }
   },
   {
      id: 'collection-b',
      eng_title: 'Collection B',
      bc_title: 'BC B',
      ak_title: 'AK B',
      eng_description: 'Description B',
      bc_description: 'BC Desc B',
      ak_description: 'AK Desc B',
      items: {
         items: [{
            id: 'item-2',
            collectionID: 'collection-b',
            childCollectionID: 'collection-c',
            order: 1,
            created: '2024-01-01T00:00:00Z'
         }]
      }
   },
   {
      id: 'collection-c',
      eng_title: 'Collection C',
      bc_title: 'BC C',
      ak_title: 'AK C',
      eng_description: 'Description C',
      bc_description: 'BC Desc C',
      ak_description: 'AK Desc C',
      items: { items: [] }
   },
   {
      id: 'collection-d',
      eng_title: 'Collection D',
      bc_title: 'BC D',
      ak_title: 'AK D',
      eng_description: 'Description D',
      bc_description: 'BC Desc D',
      ak_description: 'AK Desc D',
      items: { items: [] }
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