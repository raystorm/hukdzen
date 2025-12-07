// logger.ts
import { isDev } from './location';

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
   trace: (...args: any[]) => isDev() && console.trace(...sanitizeArgs(args)),
   log:   (...args: any[]) => isDev() && console.log(...sanitizeArgs(args)),
   debug: (...args: any[]) => isDev() && console.debug(...sanitizeArgs(args)),
   info:  (...args: any[]) => isDev() && console.info(...sanitizeArgs(args)),
   warn:  (...args: any[]) => console.warn(...sanitizeArgs(args)),
   error: (...args: any[]) => console.error(...sanitizeArgs(args)),
}