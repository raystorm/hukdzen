import React, { useEffect } from 'react';

import { enqueueSnackbar } from 'notistack';

import { useAppSelector } from "../app/hooks";


/**
 *  This is a Notifier,
 *  Picks up on Dispatched AlertBar Messages
 *  and queues them for `NotiStack` to display.
 */
const AlertBarNotifier = () =>
{
   const alertMessage = useAppSelector(state => state.alertMessage);
   const { severity='info', message, hidden, open} = alertMessage;

   useEffect(() =>
   {
      //console.log(`Detecting Alert Message change: ${JSON.stringify(alertMessage)}`);
      if ( message )
      {
         const json = JSON.stringify({message: message, hidden: hidden})
         enqueueSnackbar(json, { severity: severity, variant: `${severity}`, });
      }
   }, [alertMessage]);

   //fake being a component, so we can send the dispatched messages to `notiStack`
   return <></>;
}

export default AlertBarNotifier;
