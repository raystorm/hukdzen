/*
 *  Error types and Error Handling helpers.
 */

/**
 *  Helper method to convert an error object into a printable string message.
 *  @param error object to print
 */
export const printErrorMessage = (error: unknown): string =>
{
   if ( error && typeof error === "object" && "message" in error )
   { return String(error!.message); }
   if (typeof error === "string") { return error; }
   if (typeof error === "object" && error !== null)
   { return JSON.stringify(error); }
   return String(error);
}

/*
 *  Error Builders, consistent error messaging.
 */

export class HukdzenError extends Error
{
   details?: string;

   constructor(message: string, details?: string)
   {
      super(message);
      this.name = "HukdzenError";
      this.details = details;
   }
}


export const buildInvalidGraphQLError = (detail?: string) =>
   buildError('Missing Server Response Data', detail)

export const buildDomainInvariantError = (detail?: string) =>
   buildError('App Attempted to set an Invalid Value', detail);

export const buildMissingRequiredFieldError = (detail?: string) =>
   buildError('Missing Required Field sent from the server', detail);

const buildError = (friendly: string, detail?: string) =>
   new HukdzenError(friendly, detail);
