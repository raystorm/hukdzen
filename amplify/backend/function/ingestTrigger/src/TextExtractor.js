const officeParser = require("officeparser");
const { logger } = require("./logger");

const textExtensions = ["txt", "text", "md", "csv"];

const officeExtensions = ["docx", "pptx", "xlsx", "odt", "odp", "ods", "pdf"];

const officeParserConfig =
{
   newlineDelimiter: " ",  // Separate new lineNs with a space instead of the default \n.
   ignoreNotes: true,      // Ignore notes while parsing presentation files like pptx or odp.
   tempFilesLocation: '/tmp',
}

/*
 *  File Plan Notes:
 *  assume parse-ability based on file extension
 *  <strong>NOTE:</strong> Officeparser behaves the same way.
 */

/**
 *  gets the file extension from the file path
 *  @param path
 *  @returns {string} the file extension
 */
const getExtension = (path) => { return path.substring(path.lastIndexOf('.')+1); }

/**
 *  checks the file extension to see if it's a known text file type
 *  @param path
 *  @returns {boolean} flag indicating if the file should be a text file
 */
const isTextFile = (path) =>
{
   //TODO: look into using FileType/MimeType from DocumentDetails
   if ( !path.includes('.') ) { return false; }
   const extension = getExtension(path);
   const isText = textExtensions.includes(extension);
   //logger.log('File', path, 'is text:', isText, 'for', extension);
   return isText;
}

/**
 *  checks the file extension to see if it's a supported file type
 *  for office document parsing (text extraction)
 *  @param path
 *  @returns {boolean} flag indicating if the file should be a parsable office document
 */
const isOfficeDocument = (path) =>
{
   /*
    * TODO: look into using FileType/MimeType from DocumentDetails
    *       Would require renames for compatibility w/ OfficeParser logic
    */
   if ( !path.includes('.') ) { return false; }
   const extension = getExtension(path);
   const canParse = officeExtensions.includes(extension.toLowerCase());
   //logger.log('File', path, ' is Parsable:', canParse, 'for', extension);
   return canParse;
};

/**
 *  async Wrapper for officeParser.parseOfficeAsync to get the text
 *  @param fileContents
 *  @returns {Promise<string>}
 */
const getOfficeDocumentText = async (fileContents) =>
{
   //logger.log('Parsing File');
   try
   {
      let foundText = await officeParser.parseOfficeAsync(fileContents, officeParserConfig)
      foundText = foundText.replace(/\s+/g, ' ').trim();
      //logger.log('parsed data:', foundText);
      /*
       * TODO: Keep on eye on searching, think about post processing here.
       *       + string mangling for better searchability
       *         * \t -> ' '
       *         * \n -> ' '
       *         * etc.
       *       + analyzer processing
       *       + tokenization
       */
      return foundText;
   }
   catch(err)
   {
      logger.error('Error Parsing file:', err);
      //logger.error(err);
      throw err  //duck
   }
   finally { } //logger.log('Finished parsing file.'); }
}

module.exports = { isTextFile, isOfficeDocument, getOfficeDocumentText };