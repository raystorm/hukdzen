import { AlertColor } from "@mui/material/Alert";
import { HukdzenError, printErrorMessage } from "../error";

export interface AlertMessage
{
   severity?: AlertColor;
   message?:  string;
   hidden?:   string;
   open:      boolean;
}

export const emptyAlert: AlertMessage = {
   severity: undefined,
   message:  undefined,
   open:     false,
}

const buildAlert = (severity: AlertColor, message: string, hidden?: string): AlertMessage =>
      ({ severity, message, hidden, open: true });

export const buildInfoAlert = (message: string, hidden?: string): AlertMessage =>
{ return buildAlert('info', message, hidden); }

export const buildSuccessAlert = (message: string, hidden?: string): AlertMessage =>
{ return buildAlert('success', message, hidden); }

export const buildWarningAlert = (message: string, hidden?: string): AlertMessage =>
{ return buildAlert('warning', message, hidden); }

export const buildErrorAlert = (message: string, hidden?: string): AlertMessage =>
{ return buildAlert('error', message, hidden); }

export const buildAlertFromHukdzenError = (error: HukdzenError): AlertMessage => {
   return buildAlert('error', error.message, error.technicalError);
}

export const buildFriendlyErrorAlert = (message: string, error: unknown): AlertMessage =>
{
   if ( error instanceof HukdzenError)
   { return buildAlert('error', message, error.technicalError); }
   return buildAlert('error', message, printErrorMessage(error));
}
