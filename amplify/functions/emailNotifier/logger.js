/* helper code to escape and sanitize logs */

function sanitizeArg(arg)
{
   if (typeof arg === 'string')
   {  // Strip carriage returns, newlines, and ANSI escape sequences
      return arg.replace(/[\\r\\n]/g, '')
                .replace(/\\x1b\\[[0-9;]*m/g , '');
   }
   if ( arg && typeof arg === 'object')
   {
      try { return JSON.stringify(arg, orderedReplacer, 2); }
      catch(error) { return `Log Serialization Error: ${error.message}`; }
   }

   return arg;
}

function sanitizeArgs(args) { return args.map(sanitizeArg); }

/**
 * Produces a deterministic JSON shape for logging.
 * Sorts object keys and prints standardized Dates so logs stay —
 * predictable, diff‑friendly, and easy to scan or grep across Lambda invocations.
 *
 * Arrays preserve their original order. Only object fields are reordered.
 */
function orderedReplacer(key, value)
{
   if (value === undefined) { return undefined; }

   if (value instanceof Date) { return value.toISOString(); }
   if (value instanceof Error) { return printErrorMessage(value); }
   if (value && typeof value === 'object' && !Array.isArray(value))
   {
      return Object.keys(value).sort()
                   .reduce((acc, k) => {
                      acc[k] = value[k];
                      return acc;
                   }, {});
   }

   return value;
}

function printErrorMessage(error)
{
   if ( error instanceof Error )
   {
      let message = error.message || "Unknown Error";

      if ( error.cause) //assume cause can only exist with message
      {
         if (error.cause instanceof Error)
         { message += ` Caused By: ${printErrorMessage(error.cause)}`; }
         else if (typeof error.cause === "string")
         { message += ` Caused By: ${error.cause}`; }
      }
      return message;
   }

   if ( typeof error === "string" ) { return error; }
   return String(error);
}

const logger =
{
   log:   (...args) => console.log(...sanitizeArgs(args)),
   info:  (...args) => console.info(...sanitizeArgs(args)),
   warn:  (...args) => console.warn(...sanitizeArgs(args)),
   error: (...args) => console.error(...sanitizeArgs(args)),
};

module.exports = { logger };
