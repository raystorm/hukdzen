import {AlertBarProps} from "./AlertBarNotifier";
import {AlertColor} from "@mui/material/Alert";

export const emptyAlert: AlertBarProps = {
   severity: undefined,
   message:  undefined,
   open:     false,
}

const buildAlert = (severity: AlertColor, message: string): AlertBarProps => {
   return { severity: severity, message: message, open:true };
}

export const buildInfoAlert = (message: string): AlertBarProps => {
   return buildAlert('info', message);
}

export const buildSuccessAlert = (message: string): AlertBarProps => {
   return buildAlert('success', message);
}

export const buildWarningAlert = (message: string): AlertBarProps => {
   return buildAlert('warning', message);
}
export const buildErrorAlert = (message: string): AlertBarProps => {
   return buildAlert('error', message);
}
