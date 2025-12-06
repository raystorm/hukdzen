import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithState } from '../../__utils__/testUtilities';
import CollectionEditableForm from '../CollectionEditableForm';
import type { Collection } from '../CollectionTypes';

const mockCollection: Collection = {
   id: 'test-collection-1',
   eng_title: 'Test Collection',
   bc_title: 'Test BC Title',
   ak_title: 'Test AK Title',
   eng_description: 'Test Description',
   bc_description: 'Test BC Description',
   ak_description: 'Test AK Description',
   collectionOwner: {
      id: 'user-1',
      name: 'Test User',
      email: 'test@example.com'
   },
   box: {
      id: 'box-1',
      name: 'Test Box'
   },
   created: '2024-01-01T00:00:00Z',
   updated: '2024-01-01T00:00:00Z',
   items: { items: [] }
};

describe('CollectionEditableForm', () => {
   it('renders form fields in view mode', () => {
      const mockToggleEdit = vi.fn();
      
      renderWithState({}, 
         <CollectionEditableForm
            collection={mockCollection}
            isEditing={false}
            onToggleEdit={mockToggleEdit}
         />
      );

      expect(screen.getByDisplayValue('Test Collection')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test BC Title')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test AK Title')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
   });

   it('enables fields when editing', () => {
      const mockToggleEdit = vi.fn();
      
      renderWithState({}, 
         <CollectionEditableForm
            collection={mockCollection}
            isEditing={true}
            onToggleEdit={mockToggleEdit}
         />
      );

      const titleField = screen.getByDisplayValue('Test Collection');
      expect(titleField).not.toBeDisabled();
      expect(screen.getByTitle('Save')).toBeInTheDocument();
      expect(screen.getByTitle('Cancel')).toBeInTheDocument();
   });

   it('calls onToggleEdit when edit button clicked', () => {
      const mockToggleEdit = vi.fn();
      
      renderWithState({}, 
         <CollectionEditableForm
            collection={mockCollection}
            isEditing={false}
            onToggleEdit={mockToggleEdit}
         />
      );

      fireEvent.click(screen.getByText('Edit'));
      expect(mockToggleEdit).toHaveBeenCalledOnce();
   });

   it('disables fields when not editing', () => {
      const mockToggleEdit = vi.fn();
      
      renderWithState({}, 
         <CollectionEditableForm
            collection={mockCollection}
            isEditing={false}
            onToggleEdit={mockToggleEdit}
         />
      );

      const titleField = screen.getByDisplayValue('Test Collection');
      expect(titleField).toBeDisabled();
   });
});