import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithState, renderPage } from '../../__utils__/testUtilities';
import { COLLECTIONS_PATH } from '../../components/shared/constants';
import CollectionList from '../CollectionList';
import * as hooks from '../../app/hooks';

// Mock useAppDispatch to prevent saga execution
vi.spyOn(hooks, 'useAppDispatch').mockReturnValue(vi.fn());

describe('CollectionList', () => {
   it('should render loading state', () => {
      renderPage(COLLECTIONS_PATH, <CollectionList />, {
         collections: { items: [] },
         ui: { isProcessing: true }
      });
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
   });

   it('should render empty state', () => {
      renderPage(COLLECTIONS_PATH, <CollectionList />, {
         collections: { items: [] },
         ui: { isProcessing: false }
      });
      
      expect(screen.getByText('No collections found. Create your first collection to get started.')).toBeInTheDocument();
   });

   it('should render when on correct path', () => {
      renderPage(COLLECTIONS_PATH, <CollectionList />, {
         collections: { items: [] },
         ui: { isProcessing: false }
      });
      
      expect(screen.getByText('Collections')).toBeInTheDocument();
   });

   it('should not render when on wrong path', () => {
      renderPage('/dashboard', <CollectionList />, {
         collections: { items: [] },
         ui: { isProcessing: false }
      });
      
      expect(screen.queryByText('Collections')).not.toBeInTheDocument();
   });
});