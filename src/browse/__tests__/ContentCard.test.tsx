import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContentCard } from '../ContentCard';
import { DocumentDetails } from '../../docs/DocumentTypes';
import { renderWithState } from '../../__utils__/testUtilities';
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import { DocumentDetailsFieldDefinition } from "../../types/fieldDefitions";
import {emptyAuthor} from "../../Author/AuthorType";
import {emptyUser} from "../../User/userType";


const mockNavigate = vi.fn();
vi.mock('react-router', () => ({
   useNavigate: () => mockNavigate,
}));

const fieldDef = DocumentDetailsFieldDefinition;

const mockDocument: DocumentDetails = {
   ...emptyDocumentDetails,
   id: 'test-doc-id',
   eng_title: 'Test Document',
   bc_title: 'Test BC Title',
   ak_title: 'Test AK Title',
   eng_description: 'Test description',
   author: { ...emptyAuthor, id: 'author-1', name: 'Test Author' },
   docOwner: { ...emptyUser, id: 'owner-1', name: 'Test Owner' },
   type: 'application/pdf',
   version: 1,
};

const visibleFields = ['eng_title', 'bc_title', 'author', 'type'];

describe('ContentCard', () => {
   beforeEach(() => {
      mockNavigate.mockClear();
   });

   test('renders document fields in grid layout', () =>
   {
      renderWithState({}, 
         <ContentCard document={mockDocument} visibleFields={visibleFields} />
      );

      expect(screen.getByText(`${fieldDef.eng_title.label}:`)).toBeInTheDocument();

      expect(screen.getByText('Test Document')).toBeInTheDocument();
      expect(screen.getByText(`${fieldDef.bc_title.label}:`)).toBeInTheDocument();
      expect(screen.getByText('Test BC Title')).toBeInTheDocument();
      expect(screen.getByText(`${fieldDef.author.label}:`)).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText(`${fieldDef.type.label}:`)).toBeInTheDocument();
      expect(screen.getByText('application/pdf')).toBeInTheDocument();
   });

   test('navigates to item page when clicked', async () => {
      renderWithState({}, 
         <ContentCard document={mockDocument} visibleFields={visibleFields} />
      );

      const card = screen.getByText(`${fieldDef.eng_title.label}:`)
                         .closest('.MuiCard-root')!;
      await userEvent.click(card);

      expect(mockNavigate).toHaveBeenCalledWith('/item/test-doc-id');
   });

   test('handles empty document gracefully', () => {
      const { container } = renderWithState({}, 
         <ContentCard document={null as any} visibleFields={visibleFields} />
      );

      expect(container.firstChild).toBeNull();
   });

   test('handles missing field values', () => {
      const docWithMissingFields: DocumentDetails = {
         ...mockDocument,
         eng_title: '',
         // @ts-ignore
         author: null,
      };

      renderWithState({}, 
         <ContentCard document={docWithMissingFields} visibleFields={visibleFields} />
      );

      expect(screen.getByText(`${fieldDef.eng_title.label}:`)).toBeInTheDocument();
      expect(screen.getByText(`${fieldDef.author.label}:`)).toBeInTheDocument();
   });

   test('handles empty Object values', () =>
   {
      const docWithMissingFields: DocumentDetails = {
         ...mockDocument,
         eng_title: '',
         author: emptyAuthor,
      };

      renderWithState({},
         <ContentCard document={docWithMissingFields} visibleFields={visibleFields} />
      );

      expect(screen.getByText(`${fieldDef.eng_title.label}:`)).toBeInTheDocument();
      expect(screen.getByText(`${fieldDef.author.label}:`)).toBeInTheDocument();
   });

   test('displays number values correctly', () => {
      renderWithState({}, 
         <ContentCard document={mockDocument} visibleFields={['version']} />
      );

      expect(screen.getByText(`${fieldDef.version.label}:`)).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
   });
});