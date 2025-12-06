// logger.ts

function sanitizeArg(arg: any): any
{
   if (typeof arg === 'string')
   {  // Strip carriage returns, newlines, and ANSI escape sequences
      return arg.replace(/[\r\n]/g, '')
                .replace(/\x1b\[[0-9;]*m/g , '');
   }
   return arg;
}

function sanitizeArgs(args: any[]): any[] { return args.map(sanitizeArg); }

export const logger = {
   log: (...args: any[]) => console.log(...sanitizeArgs(args)),
   warn: (...args: any[]) => console.warn(...sanitizeArgs(args)),
   error: (...args: any[]) => console.error(...sanitizeArgs(args)),
   info: (...args: any[]) => console.info(...sanitizeArgs(args)),
};
