const officeParser = require("officeparser");


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
      const foundText = officeParser.parseOfficeAsync(fileContents, officeParserConfig)
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

const extensions = ["docx", "pptx", "xlsx",
                            "odt", "odp", "ods",
                            //TODO: move PDF to AWS Textract
                            "pdf"];

//assume parse-ability based on file extension
const isParseable = (path) =>
{
   if ( !path.includes('.') ) { return false; }
   const extension = getExtension(path);
   const canParse = extensions.includes(extension);
   console.log(`File ${path} is Parsable: ${canParse} for ${extension}`);
   return canParse;
};


export { getOfficeDocumentText, isParseable };