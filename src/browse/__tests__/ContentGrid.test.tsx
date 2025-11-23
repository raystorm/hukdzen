import { vi } from 'vitest';
import { screen } from '@testing-library/react';

import { ContentGrid } from '../ContentGrid';
import { DocumentDetails } from '../../docs/DocumentTypes';
import {renderPage, renderWithState} from '../../__utils__/testUtilities';
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import {emptyAuthor} from "../../Author/AuthorType";

//TODO: use canned /data/ .json files
const mockDocuments: DocumentDetails[] = [
   {
      ...emptyDocumentDetails,
      id: 'doc-1',
      eng_title: 'First Document',
      author: { ...emptyAuthor, id: 'author-1', name: 'Author One' },
   },
   {
      ...emptyDocumentDetails,
      id: 'doc-2',
      eng_title: 'Second Document',
      author: { ...emptyAuthor, id: 'author-2', name: 'Author Two' },
   },
];

const visibleFields = ['eng_title', 'author'];

describe('ContentGrid', () => {
   test('renders multiple content cards', () => {
      renderPage("/",
         <ContentGrid documents={mockDocuments} visibleFields={visibleFields} />
      );

      expect(screen.getByTestId('card-grid').childNodes)
         .toHaveLength(mockDocuments.length);

      expect(screen.getByText('First Document')).toBeInTheDocument();
      expect(screen.getByText('Second Document')).toBeInTheDocument();
      expect(screen.getByText('Author One')).toBeInTheDocument();
      expect(screen.getByText('Author Two')).toBeInTheDocument();
   });

   test('renders empty grid when no documents', () => {
      renderPage("/",
         <ContentGrid documents={[]} visibleFields={visibleFields} />
      );

      expect(screen.getByTestId('card-grid').childNodes).toHaveLength(0);
   });

   test('passes visible fields to each card', () => {
      renderPage("/",
         <ContentGrid documents={mockDocuments} visibleFields={['eng_title']} />
      );

      expect(screen.getByTestId('card-grid').childNodes)
        .toHaveLength(mockDocuments.length);

      expect(screen.getByText('First Document')).toBeInTheDocument();
      expect(screen.getByText('Second Document')).toBeInTheDocument();
      // Author fields should not be visible since not in visibleFields
      expect(screen.queryByText('Author:')).not.toBeInTheDocument();
   });
});