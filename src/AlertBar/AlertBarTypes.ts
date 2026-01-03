import { AlertColor } from "@mui/material/Alert";
import { HukdzenError, printErrorMessage } from "../error";

export interface Alert
{
   severity?: AlertColor;
   message?:  string;
   hidden?:   string;
   open:      boolean;
}

export const emptyAlert: Alert = {
   severity: undefined,
   message:  undefined,
   open:     false,
}

const buildAlert = (severity: AlertColor, message: string, hidden?: string): Alert =>
      ({ severity, message, hidden, open: true });

export const buildInfoAlert = (message: string, hidden?: string): Alert =>
{ return buildAlert('info', message, hidden); }

export const buildSuccessAlert = (message: string, hidden?: string): Alert =>
{ return buildAlert('success', message, hidden); }

export const buildWarningAlert = (message: string, hidden?: string): Alert =>
{ return buildAlert('warning', message, hidden); }

export const buildErrorAlert = (message: string, hidden?: string): Alert =>
{ return buildAlert('error', message, hidden); }

export const buildAlertFromHukdzenError = (error: HukdzenError): Alert => {
   return buildAlert('error', error.message, error.technicalError);
}

export const buildFriendlyErrorAlert = (message: string, error: unknown): Alert =>
{
   if ( error instanceof HukdzenError)
   { return buildAlert('error', message, error.technicalError); }
   return buildAlert('error', message, printErrorMessage(error));
}
