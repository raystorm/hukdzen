import react from 'react'
import {screen} from '@testing-library/react'

import { renderPage } from '../../../__utils__/testUtilities';
import {DONATE_PATH} from "../../shared/constants";
import DonationPage from "../DonationPage";

describe('Donation Page', () => {
   test('renders correctly', () =>
   {
      renderPage(DONATE_PATH, <DonationPage />);

      //check for expected PayPal texts
      expect(screen.getByText('PayPal')).toBeInTheDocument();
      expect(screen.getByText('Single Donation')).toBeInTheDocument();
      expect(screen.getByText('Recurring Donations')).toBeInTheDocument();

      //check for Paypal Buttons
      const payPalButtonTitle: string = 'PayPal - The safer, easier way to pay online!';
      expect(screen.getAllByTitle(payPalButtonTitle)).toHaveLength(2);

      //check for expected Amazon texts
      expect(screen.getByText('Amazon')).toBeInTheDocument();
      expect(screen.getByText('Single Payment')).toBeInTheDocument();
      expect(screen.getByText('Recurring Payments')).toBeInTheDocument();

      const single = screen.getByText('Single Payment');

      // @ts-ignore
      // eslint-disable-next-line testing-library/no-node-access
      const singleDiv = single.parentElement.getElementsByTagName('div')[2];
      expect(singleDiv).toHaveAttribute('data-ap-widget-type',
                                        'expressPaymentButton');

      //Recurring Amazon Payments not enabled yet.
      expect(screen.getByText('Coming Soon....')).toBeInTheDocument();
   });

   test('skips render when path does not match', () =>
   {
      renderPage('/INVALID/PATH', <DonationPage />);

      //check for expected PayPal texts, not to be there
      expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
      expect(screen.queryByText('Single Donation')).not.toBeInTheDocument();
      expect(screen.queryByText('Recurring Donations')).not.toBeInTheDocument();

      //check for expected Amazon texts, not to be there
      expect(screen.queryByText('Amazon')).not.toBeInTheDocument();
      expect(screen.queryByText('Single Payment')).not.toBeInTheDocument();
      expect(screen.queryByText('Recurring Payments')).not.toBeInTheDocument();
   });
});
