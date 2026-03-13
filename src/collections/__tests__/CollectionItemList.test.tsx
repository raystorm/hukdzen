import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { renderPage } from '../../__utils__/testUtilities';

import { emptyDocument } from "../../docs/initialDocumentDetails";
import { emptyCollection, emptyCollectionItem } from '../CollectionTypes';

import CollectionItemList from '../CollectionItemList';
import type { CollectionItem } from '../CollectionTypes';
import { buildSummary } from "../../Content/ContentType";

const mockItems: CollectionItem[] = [
   {
      ...emptyCollectionItem,
      id: 'item-1',
      collectionCollectionId: 'collection-1',
      collectionItemDocumentId: 'doc-1',
      document: {
         ...emptyDocument,
         id: 'doc-1',
         eng: buildSummary('Test Document'),
         bc: buildSummary('Test BC Doc'),
         ak: buildSummary('Test AK Doc')
      },
      order: 1,
      created: '2024-01-01T00:00:00Z'
   },
   {
      ...emptyCollectionItem,
      id: 'item-2',
      collectionCollectionId: 'collection-1',
      collectionItemChildCollectionId: 'child-collection-1',
      childCollection: {
         ...emptyCollection,
         id: 'child-collection-1',
         eng_title: 'Child Collection',
         bc_title: 'Child BC Collection',
         ak_title: 'Child AK Collection'
      },
      order: 2,
      created: '2024-01-01T00:00:00Z'
   }
];

describe('CollectionItemList', () => {
   it('renders empty state when no items', () => {
      const mockHandlers = {
         onAddItem: vi.fn(),
         onRemoveItem: vi.fn(),
         onMoveUp: vi.fn(),
         onMoveDown: vi.fn()
      };

      renderPage('/test', <CollectionItemList items={[]} {...mockHandlers} />);

      expect(screen.getByText("Too'ma Amwaal (Collection Items) (0)")).toBeInTheDocument();
      expect(screen.getByText(/No items in this collection yet/)).toBeInTheDocument();
      expect(screen.getByText('Sag̱aytliitsx Amwaal (Add Item)')).toBeInTheDocument();
   });

   it('renders items with correct titles and types', () => {
      const mockHandlers = {
         onAddItem: vi.fn(),
         onRemoveItem: vi.fn(),
         onMoveUp: vi.fn(),
         onMoveDown: vi.fn()
      };

      renderPage('/test',
         <CollectionItemList items={mockItems} {...mockHandlers} />
      );

      expect(screen.getByText("Too'ma Amwaal (Collection Items) (2)")).toBeInTheDocument();
      expect(screen.getByText('Test Document / Test BC Doc / Test AK Doc')).toBeInTheDocument();
      expect(screen.getByText('Child Collection / Child BC Collection / Child AK Collection')).toBeInTheDocument();
      expect(screen.getByText('Document: Test Document / Test BC Doc / Test AK Doc')).toBeInTheDocument();
      expect(screen.getByText('Collection: Child Collection / Child BC Collection / Child AK Collection')).toBeInTheDocument();
   });

   it('calls onAddItem when add button clicked', () => {
      const mockHandlers = {
         onAddItem: vi.fn(),
         onRemoveItem: vi.fn(),
         onMoveUp: vi.fn(),
         onMoveDown: vi.fn()
      };

      renderPage('/test', <CollectionItemList items={[]} {...mockHandlers} /> );

      fireEvent.click(screen.getByText('Sag̱aytliitsx Amwaal (Add Item)'));
      expect(mockHandlers.onAddItem).toHaveBeenCalledOnce();
   });

   it('calls onRemoveItem when remove button clicked', () => {
      const mockHandlers = {
         onAddItem: vi.fn(),
         onRemoveItem: vi.fn(),
         onMoveUp: vi.fn(),
         onMoveDown: vi.fn()
      };

      renderPage('/test',
         <CollectionItemList items={mockItems} {...mockHandlers} />
      );

      const removeButtons = screen.getAllByTitle('Remove from collection');
      fireEvent.click(removeButtons[0]);
      expect(mockHandlers.onRemoveItem).toHaveBeenCalledWith('item-1');
   });

   it('disables move up for first item and move down for last item', () => {
      const mockHandlers = {
         onAddItem: vi.fn(),
         onRemoveItem: vi.fn(),
         onMoveUp: vi.fn(),
         onMoveDown: vi.fn()
      };

      renderPage('/test',
         <CollectionItemList items={mockItems} {...mockHandlers} />
      );

      const moveUpButtons = screen.getAllByTitle('Move up');
      const moveDownButtons = screen.getAllByTitle('Move down');
      
      expect(moveUpButtons[0]).toBeDisabled();
      expect(moveDownButtons[1]).toBeDisabled();
   });
});