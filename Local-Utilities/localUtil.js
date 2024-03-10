const { Command } = require('commander');
const fs = require('fs');
const extractor = require('ingesttrigger/TextExtractor');
const Translator = require('../src/components/shared/translator.js')

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

program.command('translate')
       .description('Translates between BC and AK Orthographies')
       .option('-bc, --dunn [text]', 'BC Orthography Text')
       .option('-ak, --alaskan [text]', 'Alaskan Orthography Text')
       .action( ({alaskan, dunn}) => {
          //console.log(`BC Text ${dunn}`);
          //console.log(`AK Text ${alaskan}`);
          if ( !alaskan && !dunn )
          {
             console.log('Either BC or AK text is REQUIRED for translation.');
             return;
          }
          const translator = new Translator();
          if ( alaskan )
          {
             console.log('Original Alaskan Text:');
             console.log(`\t${alaskan}`);
             console.log('Translation Result:');
             console.log(`\t${translator.translateToBC(alaskan)}`);
          }
          if ( dunn )
          {
             console.log('Original BC Text:');
             console.log(`\t${dunn}`);
             console.log('Translation Result:');
             console.log(`\t${translator.translateToAlaskan(dunn)}`);
          }
       });


//Kicks off the program to run.
program.parse(process.argv);
