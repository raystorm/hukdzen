import React from 'react';
import { screen } from '@testing-library/react';

import BoxRequestPage from '../BoxRequestPage';
import { renderPage, renderPageWithPath } from '../../__utils__/testUtilities';
import { BOX_REQUEST_NEW_PATH } from '../../components/shared/constants';
import userList from '../../__utils__/__fixtures__/userList.json';

const mockUser = userList.items[0];

describe('BoxRequestPage', () => {

   test('renders correctly', () => {
      renderPage(BOX_REQUEST_NEW_PATH, <BoxRequestPage />, { user: mockUser });

      expect(screen.getByText(/Request a New Box/i)).toBeInTheDocument();
      expect(screen.getByText(/Submit a request to create a new box/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Requested Box Name/i)).toBeInTheDocument();
   });

   test('does not render at wrong path', () => {
      const { container } = renderPageWithPath('/wrong/path', BOX_REQUEST_NEW_PATH,
                                               <BoxRequestPage />, { user: mockUser });

      expect(container).toBeEmptyDOMElement();
   });
});
