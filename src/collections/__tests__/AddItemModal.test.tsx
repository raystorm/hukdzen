import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderPage } from '../../__utils__/testUtilities';
import AddItemModal, {addItemTitle} from '../AddItemModal';
import mockDocuments from '../../data/docList.json';

const mockCollections = [
   {
      id: 'collection-1',
      eng_title: 'Test Collection 1',
      bc_title: 'Test BC Collection',
      ak_title: 'Test AK Collection',
      items: { items: [] }
   },
   {
      id: 'collection-2',
      eng_title: 'Test Collection 2',
      bc_title: '',
      ak_title: '',
      items: { items: [] }
   }
];

describe('AddItemModal', () => {
   const mockProps = {
      open: true,
      onClose: vi.fn(),
      collectionId: 'current-collection',
      onAddItems: vi.fn()
   };

   it('renders modal with tabs when open', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      expect(screen.getByText(addItemTitle)).toBeInTheDocument();
      expect(screen.getByText('Amwaal (Documents)')).toBeInTheDocument();
      expect(screen.getByText("Too'ma (Collections)")).toBeInTheDocument();
   });

   it('shows documents in first tab', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      expect(screen.getByText('Sample Doc 1')).toBeInTheDocument();
      expect(screen.getByText('Sample Doc 2')).toBeInTheDocument();
   });

   it('shows collections in second tab', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));
      
      expect(screen.getByText('Test Collection 1')).toBeInTheDocument();
      expect(screen.getByText('Test Collection 2')).toBeInTheDocument();
   });

   it('filters out current collection from available collections', () => {
      const collectionsWithCurrent = [
         ...mockCollections,
         {
            id: 'current-collection',
            eng_title: 'Current Collection',
            bc_title: '',
            ak_title: '',
            items: { items: [] }
         }
      ];

      const initialState = {
         collections: { items: collectionsWithCurrent },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText("Too'ma (Collections)"));
      
      expect(screen.getByText('Test Collection 1')).toBeInTheDocument();
      expect(screen.queryByText('Current Collection')).not.toBeInTheDocument();
   });

   it('enables add button when items selected', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      const addButton = screen.getByText(/Add Selected/);
      expect(addButton).toBeDisabled();

      // Select a document
      fireEvent.click(screen.getByText('Sample Doc 1'));
      expect(screen.getByText('Sag̱aytliitsx nah ksi guu (Add Selected) (1)')).toBeEnabled();
   });

   it('calls onAddItems with selected items', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      // Select a document
      fireEvent.click(screen.getByText('Sample Doc 1'));
      
      // Click add button
      fireEvent.click(screen.getByText('Sag̱aytliitsx nah ksi guu (Add Selected) (1)'));

      expect(mockProps.onAddItems).toHaveBeenCalledWith([
         { documentId: 'a40ed2ed-41e6-4e6b-8746-1e332ad71d08' }
      ]);
   });

   it('calls onClose when cancel clicked', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: mockDocuments
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      fireEvent.click(screen.getByText('Cancel'));
      expect(mockProps.onClose).toHaveBeenCalled();
   });

   it('shows empty state when no documents available', () => {
      const initialState = {
         collections: { items: mockCollections },
         documentList: { items: [] }
      };

      renderPage('/test', <AddItemModal {...mockProps} />, initialState);

      expect(screen.getByText('No documents available')).toBeInTheDocument();
   });
});