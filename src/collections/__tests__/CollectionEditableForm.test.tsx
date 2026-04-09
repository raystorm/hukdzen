import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithState } from '../../__utils__/testUtilities';
import CollectionEditableForm from '../CollectionEditableForm';
import type { Collection } from '../CollectionTypes';
import {emptyCollection, emptyCollectionItemList} from '../CollectionTypes';
import {emptyUser} from "../../User/userType";
import {emptyBox} from "../../Box/boxTypes";

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
   items: { ...emptyCollectionItemList, items: [] }
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
      expect(screen.getByText('Amadzap (Edit)')).toBeInTheDocument();
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

      fireEvent.click(screen.getByText('Amadzap (Edit)'));
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