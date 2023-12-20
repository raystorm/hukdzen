import React, {useEffect} from 'react';

import { enqueueSnackbar } from 'notistack';
import { AlertColor, } from '@mui/material/Alert';

import { useAppSelector } from "../app/hooks";


export interface AlertBarProps {
   severity?: AlertColor;
   message?:  string;
   open:      boolean;
}

/**
 *  This is a Notifier,
 *  Picks up on Dispatched AlertBar Messages and queues them up for `NotiStack` to display.
 */
const AlertBarNotifier = () =>
{
   const alertMessage = useAppSelector(state => state.alertMessage);
   const { severity='info', message, open} = alertMessage;

   useEffect(() =>{
      //console.log(`Detecting Alert Message change: ${JSON.stringify(alertMessage)}`);
      if ( message )
      { enqueueSnackbar(`${message}`, {severity: severity, variant: `${severity}`}); }
   }, [alertMessage]);

   //fake being a component, so we can send the dispatched messages to `notiStack`
   return <></>;
}

export default AlertBarNotifier;
