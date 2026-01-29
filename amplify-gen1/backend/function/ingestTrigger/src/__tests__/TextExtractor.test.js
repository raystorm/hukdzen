/*
 *  Test file to prove TextExtractor works properly for supported file types
 */
const {
   isTextFile, isOfficeDocument, getOfficeDocumentText
} = require('../TextExtractor');

/**
 *  array of common words expected in each test file
 *  @type {string[]}
 */
const algyaxalgyax = [ "Algyax", "yawkł", "üünx",
   "T'sm g̱alüünx wil dip lu tgi dooł ła̱'a̱sk nag̱oog̱a dm dip yetst.",
   "ẅa̱a̱x", "ḵ'a'aam", "a̱x'a̱xłk", "g̱ag̱oot", "ḏakda̱xł"];

/**
 *  Relative Path to testFiles Folder
 *  @type {string}
 */
const testFiles = '../../../../../testFiles';

describe('TextExtractor', () =>
{
   let algyaxPattern;
   let algyaxMatcher;

   beforeAll(() => {
      algyaxPattern = '\\s*';
      for( const algyax of algyaxalgyax )
      { algyaxPattern += `${algyax}\\s*`; }
      algyaxMatcher =  new RegExp(algyaxPattern, 'gu');
   });

   test.each([['txt', 'being', true], ['text', 'being', true],
              ['md', 'being', true], ['csv', 'being', true],
              ['img', 'NOT', false]
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

   test('should extract test from LibreOffice Writer(odt) files correctly',
        async () =>
   {
      const path = `${testFiles}/Meeting-poster.odt`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toContain('yawłmx');
   });

   test('should extract test from MS Word(docx) files correctly',
        async () =>
   {
      const path = `${testFiles}/test-doc.docx`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from LibreOffice Calc(ods) files correctly',
        async () =>
   {
      const path = `${testFiles}/test-sheet.ods`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from MS Excel(xlsx) files correctly',
        async () =>
   {
     const path = `${testFiles}/test-sheet.xlsx`;
     const contents = await getOfficeDocumentText(path);
     expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from LibreOffice Impress(odp) files correctly',
        async () =>
   {
      const path = `${testFiles}/Test-presentation.odp`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from MS PowerPoint(pptx) files correctly',
        async () =>
   {
      const path = `${testFiles}/Test-presentation.pptx`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   //TODO: test getOfficeDocumentText for other types

});