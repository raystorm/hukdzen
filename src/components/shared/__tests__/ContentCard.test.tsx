import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithState } from '../../../__utils__/testUtilities';
import { ContentCard } from '../ContentCard';

describe('ContentCard', () => {
   it('renders field content', () => {
      const fields = [{ label: 'Title', value: 'Test Content' }];
      
      renderWithState({},  <ContentCard fields={fields} />);

      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Title:')).toBeInTheDocument();
   });

   it('calls onClick when card is clicked', () => {
      const mockClick = vi.fn();
      const fields = [{ label: 'Title', value: 'Clickable Content' }];
      
      renderWithState({}, <ContentCard fields={fields} onClick={mockClick} />);

      const card = screen.getByText('Clickable Content').closest('.MuiCard-root');
      fireEvent.click(card!);

      expect(mockClick).toHaveBeenCalledOnce();
   });

   it('does not show pointer cursor when no onClick', () => {
      const fields = [{ label: 'Title', value: 'Non-clickable Content' }];
      
      renderWithState({}, <ContentCard fields={fields} />);

      const card = screen.getByText('Non-clickable Content').closest('.MuiCard-root');
      expect(card).toHaveStyle('cursor: default');
   });

   it('shows pointer cursor when onClick provided', () => {
      const mockClick = vi.fn();
      const fields = [{ label: 'Title', value: 'Clickable Content' }];
      
      renderWithState({}, <ContentCard fields={fields} onClick={mockClick} />);

      const card = screen.getByText('Clickable Content').closest('.MuiCard-root');
      expect(card).toHaveStyle('cursor: pointer');
   });

   it('uses custom grid sizing', () => {
      const fields = [{ label: 'Title', value: 'Custom Grid' }];
      
      renderWithState({},
         <ContentCard fields={fields} gridSize={{ xs: 6, md: 3 }} />
      );

      const gridItem = screen.getByText('Custom Grid').closest('.MuiGrid-item');
      expect(gridItem).toHaveClass('MuiGrid-grid-xs-6');
      expect(gridItem).toHaveClass('MuiGrid-grid-md-3');
   });
});