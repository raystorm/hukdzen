import { AlertColor } from "@mui/material/Alert";
import { HukdzenError, printErrorMessage } from "../error";


/**
 * Alert Message Object passed from the Application to AlertBarNotifier
 */
export interface Alert
{
   severity?: AlertColor;
   message?:  string;
   details?:  string;
   open:      boolean;
}

export interface AlertState
{
   queue: Alert[];
}

export const emptyAlert: Alert = {
   severity: undefined,
   message:  undefined,
   details:  undefined,
   open:     false,
}

export const emptyAlertState: AlertState = {
   queue: []
}

const buildAlert = (severity: AlertColor, message: string, details?: string): Alert =>
      ({ severity, message, details, open: true });

export const buildInfoAlert = (message: string, details?: string): Alert =>
{ return buildAlert('info', message, details); }

export const buildSuccessAlert = (message: string, details?: string): Alert =>
{ return buildAlert('success', message, details); }

export const buildWarningAlert = (message: string, details?: string): Alert =>
{ return buildAlert('warning', message, details); }

export const buildErrorAlert = (message: string, details?: string): Alert =>
{ return buildAlert('error', message, details); }

export const buildAlertFromHukdzenError = (error: HukdzenError): Alert => {
   return buildAlert('error', error.message, error.details);
}

export const buildFriendlyErrorAlert = (message: string, error: unknown): Alert =>
{
   if ( error instanceof HukdzenError)
   { return buildAlert('error', message, error.details); }
   return buildAlert('error', message, printErrorMessage(error));
}

/** Helper type to set what extra data can be sent to Alert Message via enqueueSnackbar */
export type AlertViewExtras = {
   severity?: AlertColor;
   details?:  string;
}
