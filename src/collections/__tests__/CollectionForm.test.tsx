import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {renderWithState, startsWith} from '../../__utils__/testUtilities';
import CollectionForm, {newTitle} from '../CollectionForm';
import * as hooks from '../../app/hooks';
import * as translatorHooks from '../../components/hooks/useTranslator';
import {DocumentDetailsFieldDefinition} from "../../types/fieldDefitions";

// Mock hooks
const mockDispatch = vi.fn();
const mockTranslateField = vi.fn();
vi.spyOn(hooks, 'useAppDispatch').mockReturnValue(mockDispatch);
vi.spyOn(translatorHooks, 'useTranslator').mockReturnValue({
   translateField: mockTranslateField
});

const mockState = {
   currentUser: { id: 'user1', name: 'Test User' },
   box: { id: 'box1', name: 'Test Box' },
};

const TITLE_LABEL = DocumentDetailsFieldDefinition.eng_title.label;

describe('CollectionForm', () => {
   const mockOnClose = vi.fn();

   beforeEach(() => {
      mockDispatch.mockClear();
      mockTranslateField.mockClear();
      mockOnClose.mockClear();
   });

   it('should render create form when open', () => {
      renderWithState(mockState, <CollectionForm open={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(newTitle)).toBeInTheDocument();
      expect(screen.getByLabelText(startsWith(TITLE_LABEL))).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
   });

   it('should not render when closed', () => {
      renderWithState(mockState, <CollectionForm open={false} onClose={mockOnClose} />);
      
      expect(screen.queryByText(newTitle)).not.toBeInTheDocument();
   });

   it('should dispatch create action on form submit', () => {
      renderWithState(mockState, <CollectionForm open={true} onClose={mockOnClose} />);
      
      fireEvent.change(screen.getByLabelText(startsWith(TITLE_LABEL)), {
         target: { value: 'New Collection' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      
      expect(mockDispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: 'collections/createCollectionRequest' })
      );
      expect(mockOnClose).toHaveBeenCalled();
   });

   it('should render translate buttons for BC and AK fields', () => {
      renderWithState(mockState, <CollectionForm open={true} onClose={mockOnClose} />);
      
      const translateButtons = screen.getAllByTitle(/Translate/);
      expect(translateButtons).toHaveLength(4); // BC title, BC desc, AK title, AK desc
   });

   it('should call translateField when translate button is clicked', () => {
      mockTranslateField.mockReturnValue('Translated Text');
      
      renderWithState(mockState, <CollectionForm open={true} onClose={mockOnClose} />);
      
      // Add text to BC title
      fireEvent.change(screen.getByLabelText(DocumentDetailsFieldDefinition.bc_title.label),
                       { target: { value: 'BC Test Title' } });
      
      // Click first translate button (BC title)
      const translateButtons = screen.getAllByTitle('Translate BC to AK');
      fireEvent.click(translateButtons[0]);
      
      expect(mockTranslateField).toHaveBeenCalledWith(
         'BC Test Title',
         translatorHooks.TranslationDirection.BC_TO_AK
      );
   });

   it('should reset form when reset button is clicked', () => {
      renderWithState(mockState, <CollectionForm open={true} onClose={mockOnClose} />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText(startsWith(TITLE_LABEL)),
                       { target: { value: 'Test Title' } });
      
      // Reset form
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
      
      expect(screen.getByLabelText(startsWith(TITLE_LABEL))).toHaveValue('');
   });
});