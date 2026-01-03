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
   const { severity='info', message, details, open} = alertMessage;

   useEffect(() =>
   {
      //console.log(`Detecting Alert Message change: ${JSON.stringify(alertMessage)}`);
      if ( message )
      { enqueueSnackbar(message, { variant: severity, severity, details }); }
   }, [alertMessage]);

   //fake being a component, so we can send the dispatched messages to `notiStack`
   return <></>;
}

export default AlertBarNotifier;
