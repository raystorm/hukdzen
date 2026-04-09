import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {screen, fireEvent, within, waitFor} from '@testing-library/react';
import {contains, renderWithState, startsWith} from '../../__utils__/testUtilities';

import * as hooks from '../../app/hooks';
import * as translatorHooks from '../../components/hooks/useTranslator';
import {DocumentFieldDefinition} from "../../types/fieldDefitions";
import {printBox, Box} from "../../Box/boxTypes";

import CollectionModalForm, {modalNewTitle} from '../CollectionModalForm';

import boxList from "../../__utils__/__fixtures__/boxList.json";
import {setupBoxListMocking} from "../../__utils__/__setup__/BoxAPI.helper";
import {boxListActions} from "../../Box/BoxList/BoxListSlice";
import userEvent from "@testing-library/user-event";
import {collectionActions} from "../collectionSlice";

// Mock hooks
const mockTranslateField = vi.fn();
vi.spyOn(translatorHooks, 'useTranslator').mockReturnValue({
   translateField: mockTranslateField
});

const mockBox: Box = boxList.items[0] as Box;

const mockState = {
   currentUser: { id: 'user1', name: 'Test User' },
   box: mockBox,
};

const TITLE_LABEL = DocumentFieldDefinition.eng.title.label;

describe('CollectionForm', () => {
   const mockOnClose = vi.fn();

   beforeEach(() => {
      setupBoxListMocking();
      mockTranslateField.mockClear();
      mockOnClose.mockClear();
   });

   it('should render create form when open', () => {
      renderWithState(mockState, <CollectionModalForm open={true} onClose={mockOnClose} />);
      
      expect(screen.getByText(modalNewTitle)).toBeInTheDocument();
      expect(screen.getByLabelText(startsWith(TITLE_LABEL))).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
   });

   it('should not render when closed', () => {
      renderWithState(mockState, <CollectionModalForm open={false} onClose={mockOnClose} />);
      
      expect(screen.queryByText(modalNewTitle)).not.toBeInTheDocument();
   });

   it('should dispatch create action on form submit', async () =>
   {
      const { store } =
            renderWithState(mockState,
                            <CollectionModalForm open={true} onClose={mockOnClose} />);
      
      fireEvent.change(screen.getByLabelText(startsWith(TITLE_LABEL)),
                       { target: { value: 'New Collection' } });

      expect(store?.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: boxListActions.getAllWritableBoxes.type })
      );

      expect(screen.getByLabelText(startsWith(TITLE_LABEL)))
        .toHaveValue('New Collection');

      //Select a box
      const changeBox = `${printBox(mockBox)}`;
      const boxField  = screen.getByTestId('collection-box');
      const boxButton = within(boxField).getByRole('combobox');

      await userEvent.click(boxButton);

      await waitFor(() => {
         expect(screen.getAllByText(contains(changeBox))[0]).toBeInTheDocument();
      }, { timeout: 5000 });
      await userEvent.click(screen.getAllByText(contains(changeBox))[0]);

      expect(screen.getByText('Create')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      
      expect(store?.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({ type: collectionActions.createCollection.type })
      );
      expect(mockOnClose).toHaveBeenCalled();
   });

   it('should render translate buttons for BC and AK fields', () => {
      renderWithState(mockState, <CollectionModalForm open={true} onClose={mockOnClose} />);
      
      const translateButtons = screen.getAllByTitle(/Translate/);
      expect(translateButtons).toHaveLength(4); // BC title, BC desc, AK title, AK desc
   });

   it('should call translateField when translate button is clicked', () => {
      mockTranslateField.mockReturnValue('Translated Text');
      
      renderWithState(mockState, <CollectionModalForm open={true} onClose={mockOnClose} />);
      
      // Add text to BC title
      fireEvent.change(screen.getByLabelText(DocumentFieldDefinition.bc.title.label),
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
      renderWithState(mockState, <CollectionModalForm open={true} onClose={mockOnClose} />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText(startsWith(TITLE_LABEL)),
                       { target: { value: 'Test Title' } });
      
      // Reset form
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
      
      expect(screen.getByLabelText(startsWith(TITLE_LABEL))).toHaveValue('');
   });
});