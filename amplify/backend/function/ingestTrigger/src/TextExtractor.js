const officeParser = require("officeparser");

const textExtensions = ["txt", "text", "md", "csv"];

const officeExtensions = ["docx", "pptx", "xlsx",
                                  "odt", "odp", "ods",
                                  //TODO: move PDF to AWS Textract
                                  "pdf"];

const officeParserConfig =
{
   newlineDelimiter: " ",  // Separate new lineNs with a space instead of the default \n.
   ignoreNotes: true,      // Ignore notes while parsing presentation files like pptx or odp.
   tempFilesLocation: '/tmp',
}


const getOfficeDocumentText = async (fileContents) =>
{
   console.log(`Parsing File`);

   try
   {
      const foundText = await officeParser.parseOfficeAsync(fileContents, officeParserConfig)
      console.log(`parsed data: ${foundText}`);
      return foundText;
   }
   catch(err)
   {
      console.error(`Error Parsing file: ${err}`);
      console.error(err);
      throw err  //duck
   }
   finally { console.log('Finished parsing file.'); }
}

const getExtension = (path) => {
      return path.substring(path.lastIndexOf('.')+1);
}

/*
 *  assume parse-ability based on file extension
 *  <strong>NOTE:</strong> Officeparser behaves the same way.
 */

const isTextFile = (path) => {
   //TODO: look into using FileType/MimeType from DocumentDetails
   if ( !path.includes('.') ) { return false; }
   const extension = getExtension(path);
   const canParse = textExtensions.includes(extension);
   console.log(`File ${path} is Parsable: ${canParse} for ${extension}`);
   return canParse;
}



const isOfficeDocument = (path) =>
{
   /*
    * TODO: look into using FileType/MimeType from DocumentDetails
    *       Would require renames for compatibility w/ OfficeParser logic
    */
   if ( !path.includes('.') ) { return false; }
   const extension = getExtension(path);
   const canParse = officeExtensions.includes(extension);
   console.log(`File ${path} is Parsable: ${canParse} for ${extension}`);
   return canParse;
};

module.exports = { isTextFile, isOfficeDocument, getOfficeDocumentText };