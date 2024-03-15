import {SnackbarContent, CustomContentProps, closeSnackbar} from 'notistack'
import React from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Alert, {AlertColor} from "@mui/material/Alert";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';


export interface AlertMessageProps extends CustomContentProps
{ severity?: AlertColor; }

/**
 *  Custom Component to Display styled User Alert Feedback Notifications
 */
export const AlertMessage = //(props: AlertMessageProps, ref: React.ForwardedRef<HTMLDivElement>) => {
       React.forwardRef<HTMLDivElement, AlertMessageProps>((props, ref) =>
{
   const {
     id,
     message,
     variant,
     severity = 'info',
     ...other
   } = props;

   //const handleClose = () => { dispatch(alertBarActions.HideAlertBox()); }
   const handleClose = () => { closeSnackbar(id); }

   return (
     <SnackbarContent ref={ref} role='alert' {...other} >
       <Alert severity={severity} variant="filled">
         <AlertTitle><strong>{severity.toUpperCase()}</strong></AlertTitle>
         {message}
         <IconButton aria-label='Close' style={{color: 'inherit'}}
                     onClick={handleClose} >
           <HighlightOffIcon />
         </IconButton>
       </Alert>
     </SnackbarContent>
   );
});