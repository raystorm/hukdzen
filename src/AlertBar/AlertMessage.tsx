import { SnackbarContent, CustomContentProps } from 'notistack'
import React from "react";
import AlertTitle from "@mui/material/AlertTitle";
import Alert, {AlertColor} from "@mui/material/Alert";

export interface AlertMessageProps extends CustomContentProps {
  severity?: AlertColor;
}

/**
 *  Custom Component to Display styled User Alert Feedback Notifications
 */
export const AlertMessage = //(props: AlertMessageProps, ref: React.ForwardedRef<HTMLDivElement>) => {
       React.forwardRef<HTMLDivElement, AlertMessageProps>((props, ref) => {
    const {
        id,
        message,
        variant,
        severity = 'info',
        ...other
    } = props;

    return (
        <SnackbarContent ref={ref} role='alert' {...other} >
            <Alert severity={severity} variant="filled">
                <AlertTitle><strong>{severity.toUpperCase()}</strong></AlertTitle>
                {message}
            </Alert>
        </SnackbarContent>
    );
});