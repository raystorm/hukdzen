/* helper code to escape and sanitize logs */

function sanitizeArg(arg)
{
   if (typeof arg === 'string')
   {  // Strip carriage returns, newlines, and ANSI escape sequences
      return arg.replace(/[\r\n]/g, '')
                .replace(/\x1b\[[0-9;]*m/g , '');
   }
   return arg;
}

function sanitizeArgs(args) { return args.map(sanitizeArg); }

const logger =
{
   log:   (...args) => console.log(...sanitizeArgs(args)),
   info:  (...args) => console.info(...sanitizeArgs(args)),
   warn:  (...args) => console.warn(...sanitizeArgs(args)),
   error: (...args) => console.error(...sanitizeArgs(args)),
};

module.exports = { logger };
