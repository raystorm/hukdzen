import react from 'react'
import { MemoryRouter } from 'react-router';
import { screen,  } from '@testing-library/react'

import { renderWithProviders, contains } from '../../../utilities/testUtilities';
import ErrorPage, { NotFound } from '../ErrorPage';


describe('Error Page', () => { 
  test('renders correctly', () => {
    const pageUrl = '/test/error/page';
    renderWithProviders(
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ErrorPage />
          </MemoryRouter>
    );
    
    expect(screen.getByText(NotFound)).toBeInTheDocument();

    //check for URL in the error message
    expect(screen.getByText(contains(pageUrl))).toBeInTheDocument();
  });
});