import React from 'react';
import {matchPath, useLocation} from "react-router-dom";
import PayPalDonateButton from "../forms/donation/PayPalDonateButton";
import AmazonButton from "../forms/donation/AmazonButton";
import {DONATE_PATH} from "../shared/constants";

const paypalGFUrl: string = 'https://paypal.com/us/fundraiser/charity/4936358';


const DonationPage = () =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(DONATE_PATH, location.pathname);

   if ( skipRender() ) { return <></>; }

   //TODO: Create a 4x4 layout
   return (
      <>
         <h2>PayPal</h2>
         <div className='twoColumn'>
            <div>
               <h3>Single Donation</h3>
               <h4>Via Paypal Giving Fund</h4>
               <PayPalDonateButton url={paypalGFUrl}/>
            </div>
            <div>
               <h3>Recurring Donations</h3>
               <h4>Via Paypal Donations</h4>
               <PayPalDonateButton/>
            </div>
         </div>
         <hr style={{margin: '10px'}}/>
         <h2>Amazon</h2>
         <div className='twoColumn'>
            <div>
               <h3>Single Payment</h3>
               <h4>Via Amazon Pay</h4>
               <AmazonButton/>
            </div>
            <div>
               <h3>Recurring Payments</h3>
               <h4>Via Amazon Pay</h4>
               <div>
                  Coming Soon.... <br/>
                  <sub>Please use PayPal for Recurring Donations for Now.</sub>
               </div>
            </div>
         </div>
      </>);
}

export default DonationPage;