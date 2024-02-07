import React from 'react';

interface PayPalDonateButtonProps {
   url? : string,
}

const PayPalDonateButton = (props: PayPalDonateButtonProps) =>
{
   const { url = "https://www.paypal.com/donate" } = props;

   return (<>
      <form action={url} method="post" target="_top">
         <input type="hidden" name="hosted_button_id" value="582TCB9ZZXTFW"/>
         <input type="image" style={{border: 0}}
                src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif"
                name="submit" title="PayPal - The safer, easier way to pay online!"
                alt="Donate with PayPal button"/>
         <img alt="" style={{border: 0}} width="1" height="1"
              src="https://www.paypal.com/en_US/i/scr/pixel.gif" />
      </form>
   </>)
};

export default PayPalDonateButton;