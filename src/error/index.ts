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
