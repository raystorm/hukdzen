import react from 'react'
import {screen} from '@testing-library/react'

import { renderPage } from '../../../__utils__/testUtilities';
import LandingPage from "../LandingPage";

describe('LandingPage', () => {
   test('renders correctly', () => {
      renderPage('/', <LandingPage/>);

      expect(screen.getByText('Welcome to Smalgyax-Files.org')).toBeInTheDocument();
      expect(screen.getByText('Algyax Amwaal - Tsimpshian Language Treasures')).toBeInTheDocument();
   });
});
