import React, { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { alertBarActions } from './AlertBarSlice';


/**
 *  This is a Notifier,
 *  Picks up on Dispatched AlertBar Messages
 *  and queues them for `NotiStack` to display.
 */
const AlertBarNotifier = () =>
{
   const alertQueue = useAppSelector(state => state.alertMessage.queue);
   const dispatch = useAppDispatch();

   useEffect(() =>
   {
      if ( 0 < alertQueue.length )
      {
         const alert = alertQueue[0];
         const { severity='info', message, details } = alert;
         if ( message )
         {
            enqueueSnackbar(message, { variant: severity, severity, details });
            dispatch(alertBarActions.HideAlertBox());
         }
      }
   }, [alertQueue, dispatch]);

   //fake being a component, so we can send the dispatched messages to `notiStack`
   return <></>;
}

export default AlertBarNotifier;
