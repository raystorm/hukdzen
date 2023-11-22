import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux'

import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

import { useAppSelector } from "../app/hooks";
import { alertBarActions } from "./AlertBarSlice";
import {AlertTitle} from "@mui/material";

export interface AlertBarProps {
   severity?: AlertColor;
   message?:  string;
   open:      boolean;
}

//TODO: consider stacking messages, https://github.com/iamhosseindhv/notistack
const AlertBar = () =>
{
   const dispatch = useDispatch();

   const alertMessage = useAppSelector(state => state.alertMessage);
   const { severity='info', message, open} = alertMessage;

   /*
   useEffect(() =>{
      console.log(`Detecting Alert Message change: ${JSON.stringify(alertMessage)}`);
   }, [alertMessage]);
   */

   const handleClose = () => { dispatch(alertBarActions.HideAlertBox()); }

   return (<Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                     open={open}
                     onClose={handleClose}
                     //key={'top' + 'center'}
           >
             <Alert severity={severity} variant="filled">
               <AlertTitle><strong>{severity.toUpperCase()}</strong></AlertTitle>
               {message}
             </Alert>
           </Snackbar>);
}

export default AlertBar;
