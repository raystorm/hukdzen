import {AlertColor} from "@mui/material/Alert";

declare module 'notistack' {
   /**
    *  Allows for Custom Severity Prop for Alert Notifications
    *  can be passed to `enqueueSnackbar`
    *  Based on:
    *  https://notistack.com/features/customization#custom-variant-(typescript)
    */
   interface VariantOverrides {
      // updates `info` variant with the
      // "extra" props it takes in options of `enqueueSnackbar`
      default: { severity?: AlertColor; }
      info:    { severity?: AlertColor; }
      success: { severity?: AlertColor; }
      warning: { severity?: AlertColor; }
      error:   { severity?: AlertColor; }
   }
}