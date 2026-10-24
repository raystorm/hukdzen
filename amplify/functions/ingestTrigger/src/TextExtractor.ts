import officeParser from 'officeparser';
import { logger } from '../../shared/logger';

const textExtensions = ["txt", "text", "md", "csv"];
const officeExtensions = ["docx", "pptx", "xlsx", "odt", "odp", "ods", "pdf"];

const officeParserConfig =
{
   newlineDelimiter: " ",
   ignoreNotes: true,
   tempFilesLocation: '/tmp',
}

const getExtension = (path: string): string =>
{ return path.substring(path.lastIndexOf('.') + 1); }

export const isTextFile = (path: string): boolean =>
{
   if (!path.includes('.')) { return false; }
   const extension = getExtension(path);
   return textExtensions.includes(extension);
}

export const isOfficeDocument = (path: string): boolean =>
{
   if (!path.includes('.')) { return false; }
   const extension = getExtension(path);
   return officeExtensions.includes(extension.toLowerCase());
};

/**
 * officeparser's bundled pdf.js sets `require.ensure` and later calls it.
 * When esbuild bundles this Lambda as ESM, its `__require` Proxy writes the
 * property to its own target but reads it back from the real global `require`
 * (which Amplify defines via createRequire), so the call fails with
 * "<x>.ensure is not a function". Defining it on the real `require` fixes that.
 * No-op when there is no global `require` (e.g. under Jest/CommonJS).
 */
export const ensureRequireShim = (): void =>
{
   const req = (globalThis as any).require;
   if (req && 'function' !== typeof req.ensure)
   { req.ensure = (_modules: string[], callback: () => void) => { setImmediate(callback); }; }
};

export const getOfficeDocumentText = async (fileContents: Buffer | string): Promise<string> =>
{
   try
   {
      ensureRequireShim();
      let foundText = await officeParser.parseOfficeAsync(fileContents, officeParserConfig);
      foundText = foundText.replace(/\s+/g, ' ').trim();
      return foundText;
   }
   catch (err)
   {
      logger.error('Error Parsing file:', err);
      throw err;
   }
}
