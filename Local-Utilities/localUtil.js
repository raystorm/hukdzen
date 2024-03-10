const { Command } = require('commander');
const fs = require('fs');
const officeParser = require('officeparser');
const extractor = require('ingesttrigger/TextExtractor');

const program = new Command()

program.name('local-util')
       .description('Local test and helper utils')
       .version('0.0.1')

program.command('hello')
       .description('greet someone')
       .action(() => { console.log('Hello!'); });
program.command('testFile')
       .description('Test a file can have text extracted for search')
       .argument('<path>',  'Path to File')
       .action( async (path) =>
         {
            let text = 'Unable to Parse File (Unknown type).';
            if ( extractor.isTextFile(path) )
            {
               text = 'Text File: ';
               text += fs.readFileSync(path, 'utf8');
            }
            else if ( extractor.isOfficeDocument(path) )
            {
               text = 'Office Document: ';
               text += await extractor.getOfficeDocumentText(path);
               //text = text.replace(/\t/g, ' ').trim();
            }
            console.log(text);
         });

//Kicks off the program to run.
program.parse(process.argv);
