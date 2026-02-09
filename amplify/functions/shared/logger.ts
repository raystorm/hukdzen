/* helper code to escape and sanitize logs */

function sanitizeArg(arg: any): any
{
   if (typeof arg === 'string')
   {  // Strip carriage returns, newlines, and ANSI escape sequences
      return arg.replace(/[\r\n]/g, '')
                .replace(/\x1b\[[0-9;]*m/g , '');
   }
   if ( arg && typeof arg === 'object')
   {
      try { return JSON.stringify(arg, safeOrderedReplacer(), 2); }
      catch(error: any) { return `Log Serialization Error: ${error.message}`; }
   }

   return arg;
}

function sanitizeArgs(args: any[]): any[] { return args.map(sanitizeArg); }


/**
 * protects against circular references when stringifying objects
 *  while also sorting keys for consistent output
 */
function safeOrderedReplacer()
{
   const seen = new WeakSet();

   /**
    * Produces a deterministic JSON shape for logging.
    * Sorts object keys and prints standardized Dates so logs stay —
    * predictable, diff‑friendly, and easy to scan or grep across Lambda invocations.
    *
    * Arrays preserve their original order. Only object fields are reordered.
    */
   return function orderedReplacer(key: string, value: any): any
   {
      if (value === undefined) { return undefined; }

      if (value && typeof value === "object")
      {
         if (seen.has(value)) { return "[Circular]"; }
         seen.add(value);
      }

      if (value instanceof Date)  { return value.toISOString(); }
      if (value instanceof Error) { return printErrorMessage(value); }
      if (value && typeof value === "object" && !Array.isArray(value))
      {
         return Object.keys(value).sort()
                      .reduce((acc:any, k:any) => {
                         acc[k] = value[k];
                         return acc;
                      }, {});
      }

      return value;
   }
}

interface PrintableError
{
   message?: string;
   details?: string;
   cause?: unknown;
}

/**
 *  Helper method to convert an error object into a printable string message.
 *  Note: supports Details from HukdzenError and nested Causes.
 *  @param error object to print
 *  @param visited set of already-visited errors to prevent circular cause chains
 */
export function printErrorMessage(error: unknown, visited = new Set<unknown>()): string
{
   if ( error && typeof error === "object" && "message" in error )
   {
      if (visited.has(error)) { return "[Circular]" }
      visited.add(error);

      const err = error as PrintableError;

      let message = err.message ? String(err.message) : "Unknown Error";

      //assume details can only exist with message
      if ( err.details) { message += `: ${err.details}`; }

      if ( err.cause ) //assume cause can only exist with message
      { message += ` Caused By: ${printErrorMessage(err.cause, visited)}`; }

      return message;
   }

   if ( typeof error === "string" ) { return error; }
   if ( typeof error === "object" && error !== null )
   {
      try { return JSON.stringify(error, safeOrderedReplacer()); }
      catch { return String(error); }
   }
   return String(error);
}

export const logger =
{
   log:   (...args: any[]) => console.log(...sanitizeArgs(args)),
   info:  (...args: any[]) => console.info(...sanitizeArgs(args)),
   warn:  (...args: any[]) => console.warn(...sanitizeArgs(args)),
   error: (...args: any[]) => console.error(...sanitizeArgs(args)),
};
