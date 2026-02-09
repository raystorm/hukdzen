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

export const getOfficeDocumentText = async (fileContents: Buffer | string): Promise<string> =>
{
   try
   {
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
