import { ensureRequireShim, getOfficeDocumentText, isOfficeDocument, isTextFile } from '../TextExtractor';

const algyaxalgyax = [ "Algyax", "yawkł", "üünx",
   "T'sm g̱alüünx wil dip lu tgi dooł ła̱'a̱sk nag̱oog̱a dm dip yetst.",
   "ẅa̱a̱x", "ḵ'a'aam", "a̱x'a̱xłk", "g̱ag̱oot", "ḏakda̱xł"];

const testFiles = '../../../testFiles';

describe('TextExtractor', () =>
{
   let algyaxPattern: string;
   let algyaxMatcher: RegExp;

   beforeAll(() =>
   {
      algyaxPattern = '\\s*';
      for (const algyax of algyaxalgyax)
      { algyaxPattern += `${algyax}\\s*`; }
      algyaxMatcher = new RegExp(algyaxPattern, 'gu');
   });

   test.each([['txt', 'being', true], ['text', 'being', true],
              ['md', 'being', true], ['csv', 'being', true],
              ['img', 'NOT', false]
             ])
   ('should correctly identify %s as %s a text file extension',
    (ext, isOrNot, expected) =>
    { expect(isTextFile(`/path/to/file.${ext}`)).toBe(expected); }
   );

   test.each([["docx", 'being', true],  ["pptx", 'being', true],
              ["xlsx", 'being', true],
              ["odt", 'being',  true],  ["odp",  'being', true],
              ["ods", 'being',  true],
              ["pdf", 'being',  true],  ["img",  'NOT',   false],
              ['txt', 'NOT',    false], ['text', 'NOT',   false],
              ['md', 'NOT',     false], ['csv',  'NOT',   false]
            ])
   ('should correctly identify %s as %s a parsable Office file extension',
    (ext, isOrNot, expected) =>
    { expect(isOfficeDocument(`/path/to/file.${ext}`)).toBe(expected); }
   );

   test('should extract test from LibreOffice Writer(odt) files correctly', async () =>
   {
      const path = `${testFiles}/Meeting-poster.odt`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toContain('yawłmx');
   });

   test('should extract test from MS Word(docx) files correctly', async () =>
   {
      const path = `${testFiles}/test-doc.docx`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from LibreOffice Calc(ods) files correctly', async () =>
   {
      const path = `${testFiles}/test-sheet.ods`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from MS Excel(xlsx) files correctly', async () =>
   {
     const path = `${testFiles}/test-sheet.xlsx`;
     const contents = await getOfficeDocumentText(path);
     expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from LibreOffice Impress(odp) files correctly', async () =>
   {
      const path = `${testFiles}/Test-presentation.odp`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   test('should extract test from MS PowerPoint(pptx) files correctly', async () =>
   {
      const path = `${testFiles}/Test-presentation.pptx`;
      const contents = await getOfficeDocumentText(path);
      expect(contents).toMatch(algyaxMatcher);
   });

   describe('ensureRequireShim', () =>
   {
      const g = globalThis as any;
      let original: unknown;

      beforeEach(() => { original = g.require; });
      afterEach(() =>
      {
         if (undefined === original) { delete g.require; }
         else { g.require = original; }
      });

      test('defines require.ensure when a global require exists without it', async () =>
      {
         g.require = () => undefined;

         ensureRequireShim();

         expect(typeof g.require.ensure).toBe('function');
         const callback = jest.fn();
         g.require.ensure([], callback);
         await new Promise(resolve => setImmediate(resolve));
         expect(callback).toHaveBeenCalledTimes(1);
      });

      test('keeps an existing require.ensure', () =>
      {
         const existing = jest.fn();
         g.require = Object.assign(() => undefined, { ensure: existing });

         ensureRequireShim();

         expect(g.require.ensure).toBe(existing);
      });

      test('does nothing when there is no global require', () =>
      {
         delete g.require;

         expect(() => ensureRequireShim()).not.toThrow();
         expect(g.require).toBeUndefined();
      });
   });
});
