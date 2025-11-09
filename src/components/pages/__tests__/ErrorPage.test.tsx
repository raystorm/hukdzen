import react from 'react'
import { MemoryRouter } from 'react-router';
import { screen, } from '@testing-library/react'

import { renderWithProviders, contains, startsWith } from '../../../__utils__/testUtilities';
import ErrorPage, { NotFound } from '../ErrorPage';


describe('Error Page', () => { 
  test('renders correctly', () => {
    const pageUrl = '/test/error/page';
    renderWithProviders(
          <MemoryRouter initialEntries={[{pathname: pageUrl}]} >
            <ErrorPage />
          </MemoryRouter>
    );

    //embedded <br /> breaks the getByText
    //expect(screen.getByText(NotFound)).toBeInTheDocument();

    expect(screen.getByText(startsWith('404'))).toBeInTheDocument();
    expect(screen.getByText(contains('Not Found'))).toBeInTheDocument();

    //check for URL in the error message
    expect(screen.getByText(contains(pageUrl))).toBeInTheDocument();
  });
});