/*
 *  Test file to prove TextExtractor works properly for supported file types
 */
const {
   isTextFile, isOfficeDocument, getOfficeDocumentText
} = require('../TextExtractor');


describe('TextExtractor', () =>
{
   test.each([['txt', 'being', true], ['text', 'being', true],
              ['md', 'being', true], ['csv', 'being', true], ['img', 'NOT', false]
             ])
   ('should correctly identify %s as %s a text file extension',
    (ext, isOrNot, expected) =>
    { expect(isTextFile(`/path/to/file.${ext}`)).toBe(expected); }
   );

   test.each([["docx", 'being', true], ["pptx", 'being', true],
              ["xlsx", 'being', true],
              ["odt", 'being',  true], ["odp", 'being',  true],
              ["ods", 'being',  true],
              ["pdf", 'being',  true], ["img", 'NOT',   false],
              ['txt', 'NOT',   false], ['text', 'NOT',  false],
              ['md', 'NOT',    false], ['csv', 'NOT',   false]
            ])
   ('should correctly identify %s as %s a parsable Office file extension',
    (ext, isOrNot, expected) =>
    { expect(isOfficeDocument(`/path/to/file.${ext}`)).toBe(expected); }
   );

   test('should parse OpenOffice Writer(odt) files correctly',
        async () =>
   {
      const path = '../../../../../testFiles/Meeting-poster.odt';
      const contents = await getOfficeDocumentText(path);
      expect(contents).toContain('yawłmx');
   });

   //TODO: test getOfficeDocumentText for other types

});