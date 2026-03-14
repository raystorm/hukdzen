import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithState } from '../../../__utils__/testUtilities';
import { ContentGrid } from '../ContentGrid';

describe('ContentGrid', () => {
   it('renders items in grid container', () => {
      const items = [
         { id: '1', title: 'Test Card 1' },
         { id: '2', title: 'Test Card 2' }
      ];
      const fields = [{ key: 'title', label: 'Title' }];

      renderWithState({}, 
         <ContentGrid items={items} fields={fields} />
      );

      expect(screen.getByTestId('card-grid')).toBeInTheDocument();
      expect(screen.getByText('Test Card 1')).toBeInTheDocument();
      expect(screen.getByText('Test Card 2')).toBeInTheDocument();
   });

   it('renders empty grid when no items', () => {
      renderWithState({}, <ContentGrid items={[]} fields={[]} />);
      
      expect(screen.getByTestId('card-grid')).toBeInTheDocument();
      expect(screen.getByTestId('card-grid')).toBeEmptyDOMElement();
   });

   it('handles items with null nested fields', () => {
      const itemWithNulls = [
         { id: '1', eng: null, bc: null, ak: null }
      ];
      const fields = [
         { key: 'eng_title', label: 'English Title' },
         { key: 'bc_title', label: 'BC Title' }
      ];

      renderWithState({}, 
         <ContentGrid items={itemWithNulls} fields={fields} />
      );

      expect(screen.getByTestId('card-grid')).toBeInTheDocument();
   });
});