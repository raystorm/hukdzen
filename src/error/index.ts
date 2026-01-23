/*
 *  Error types and Error Handling helpers.
 */

/** Helper type to capture known possible error fields */
type printableError = {
   message?: unknown;
   details?: unknown;
   cause?: unknown;
};

/**
 *  Helper method to convert an error object into a printable string message.
 *  Note: supports Details from HukdzenError and nested Causes.
 *  @param error object to print
 */
export const printErrorMessage = (error: unknown): string =>
{
   if ( error && typeof error === "object" && "message" in error )
   {
      const err = error as printableError;

      let message = err.message ? String(err.message) : "Unknown Error";

      //assume details can only exist with message
      if ( err.details) { message += `: ${err.details}`; }

      if ( err.cause ) //assume cause can only exist with message
      { message += ` Caused By: ${printErrorMessage(err.cause)}`; }

      return message;
   }

   if ( typeof error === "string" ) { return error; }
   if ( typeof error === "object" && error !== null )
   { return JSON.stringify(error); }
   return String(error);
}

/*
 *  Error Builders, consistent error messaging.
 */

/** Generic Error type for the application,
 *  includes optional details field, and support for cause chains */
export class HukdzenError extends Error
{
   details?: string;

   constructor(message: string, details?: string, options?: { cause?: unknown })
   {
      super(message, options);
      this.name = "HukdzenError";
      this.details = details;
   }
}


export const buildInvalidGraphQLError = (detail?: string, cause?: unknown) =>
   buildError('Missing Server Response Data', detail, cause)

export const buildDomainInvariantError = (detail?: string) =>
   buildError('App Attempted to set an Invalid Value', detail);

export const buildMissingRequiredFieldError = (detail?: string) =>
   buildError('Missing Required Field sent from the server', detail);

export const buildError = (friendly: string, detail?: string, cause?: unknown) =>
   new HukdzenError(friendly, detail, { cause });
