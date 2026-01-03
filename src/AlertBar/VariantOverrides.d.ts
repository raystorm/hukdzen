import 'notistack';
import type { AlertViewExtras } from "./AlertBarTypes";

declare module 'notistack' {

   /**
    *  Allows for Custom Severity Prop for Alert Notifications
    *  can be passed to `enqueueSnackbar`
    *  Based on:
    *  https://notistack.com/features/customization#custom-variant-(typescript)
    */
   interface VariantOverrides {
      // updates all severity variants with the
      // "extra" props it takes in options of `enqueueSnackbar`
      default: AlertViewExtras;
      info:    AlertViewExtras;
      success: AlertViewExtras;
      warning: AlertViewExtras;
      error:   AlertViewExtras;
   }
}