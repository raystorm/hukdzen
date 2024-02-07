import React, {useEffect, useState} from 'react';
import {TextField} from "@mui/material";

const thanks: string =( 'Thank you for Donating'
                      + ' to support the applications continued success'
                      + ' and development.');

const AmazonButton = () =>
{
   const [amazonAmount, setAmazonAmount] = useState('10');

   useEffect(() =>
   {
      const scriptSource: string = 'https://static-na.payments-amazon.com/OffAmazonPayments/us/js/Widgets.js';
      //const script = <script async src={scriptSource}/>;
      const script = document.createElement('script');
      script.src = scriptSource;
      script.async = true;

      document.head.appendChild(script);

      return () => { document.head.removeChild(script); }
   }, []);

   return (<>
      <TextField
         label='Set Donation Amount'
         value={amazonAmount}
         onChange={e => setAmazonAmount(e.target.value)}/>
      <div
         data-ap-widget-type="expressPaymentButton"
         data-ap-signature="ieaC9XkmCOqU7My8Y6FcUM8yQKOEvMNqWz1yy26IhrY%3D"
         data-ap-seller-id="AWO2CKSVV7L0V"
         data-ap-access-key="AKIAIXZKP63MQ47KU4QQ"
         data-ap-lwa-client-id="amzn1.application-oa2-client.9125bdea3c824436818f933382b952d9"

         data-ap-return-url="https://Smalgyax-Files.org"
         data-ap-cancel-return-url="https://Smalgyax-Files.org"

         data-ap-currency-code="USD"
         data-ap-amount={amazonAmount}

         data-ap-note={thanks}

         data-ap-shipping-address-required="false"
         data-ap-payment-action="AuthorizeAndCapture"
      >
      </div>
   </>);
}

export default AmazonButton;