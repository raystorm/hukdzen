import { describe, test, expect } from 'vitest';

// Import the translator class
const Translator = require('../translator.js');

describe('Translator', () =>
{
   let translator;

   beforeEach(() => { translator = new Translator(); });

   describe('BC to Alaskan translation', () =>
   {
      test('translates basic BC characters to Alaskan', () => {
         expect(translator.translateToAlaskan('ee')).toBe('ai');
         expect(translator.translateToAlaskan('ii')).toBe('ee');
         expect(translator.translateToAlaskan('oo')).toBe('oa');
         expect(translator.translateToAlaskan('uu')).toBe('oo');
         expect(translator.translateToAlaskan('ü')).toBe('uu');
      });

      test('translates BC consonants to Alaskan', () => {
         expect(translator.translateToAlaskan("ts'")).toBe("'ds");
         expect(translator.translateToAlaskan("t'")).toBe("'d");
         expect(translator.translateToAlaskan("k'w")).toBe("'kw");
         expect(translator.translateToAlaskan("k'y")).toBe("'ky");
         expect(translator.translateToAlaskan("k'")).toBe("'k");
         expect(translator.translateToAlaskan('dz')).toBe('ds');
         expect(translator.translateToAlaskan('ay')).toBe('ie');
         expect(translator.translateToAlaskan('x')).toBe('ck');
         expect(translator.translateToAlaskan('ł')).toBe('hl');
         expect(translator.translateToAlaskan('s')).toBe('sh');
         expect(translator.translateToAlaskan("p'")).toBe("'b");
      });

      test('translates BC special characters to Alaskan', () => {
         expect(translator.translateToAlaskan('ḵ')).toBe('gg');
         expect(translator.translateToAlaskan("ḵ'")).toBe("'gg");
         expect(translator.translateToAlaskan('g̱')).toBe('gg');
      });

      test('translates BC words to Alaskan', () => {
         expect(translator.translateToAlaskan('heeł')).toBe('haihl');
         expect(translator.translateToAlaskan("ḵ'uu")).toBe("'ggoo");
      });
   });

   describe('Alaskan to BC translation', () => {
      test('translates basic Alaskan characters to BC', () => {
         expect(translator.translateToBC('ai')).toBe('ee');
         expect(translator.translateToBC('ee')).toBe('ii');
         expect(translator.translateToBC('oa')).toBe('oo');
         expect(translator.translateToBC('oo')).toBe('uu');
         expect(translator.translateToBC('uu')).toBe('ü');
      });

      test('translates Alaskan consonants to BC', () => {
         expect(translator.translateToBC("'ds")).toBe("ts'");
         expect(translator.translateToBC("'d")).toBe("t'");
         expect(translator.translateToBC("'kw")).toBe("k'w");
         expect(translator.translateToBC("'ky")).toBe("k'y");
         expect(translator.translateToBC("'k")).toBe("k'");
         expect(translator.translateToBC('ds')).toBe('dz');
         expect(translator.translateToBC('ie')).toBe('ay');
         expect(translator.translateToBC('ck')).toBe('x');
         expect(translator.translateToBC('hl')).toBe('ł');
         expect(translator.translateToBC('sh')).toBe('s');
         expect(translator.translateToBC("'b")).toBe("p'");
      });

      test('translates Alaskan special characters to BC', () => {
         expect(translator.translateToBC('gg')).toBe('g̱');
         expect(translator.translateToBC("gg'")).toBe("'g̱");
      });

      test('translates Alaskan words to BC', () => {
         expect(translator.translateToBC('haihl')).toBe('heeł');
         expect(translator.translateToBC('ggoo')).toBe('g̱uu');
      });
   });

   describe('edge cases', () => {
      test('handles empty string', () => {
         expect(translator.translateToBC('')).toBe('');
         expect(translator.translateToAlaskan('')).toBe('');
      });

      test('handles null and undefined', () => {
         expect(translator.translateToBC(null)).toBe('');
         expect(translator.translateToBC(undefined)).toBe('');
         expect(translator.translateToAlaskan(null)).toBe('');
         expect(translator.translateToAlaskan(undefined)).toBe('');
      });

      test('handles non-string input', () => {
         expect(translator.translateToBC(123)).toBe(123);
         expect(translator.translateToAlaskan(123)).toBe(123);
      });

      test('preserves text without translation mappings', () => {
         expect(translator.translateToBC('hello world')).toBe('hello world');
         expect(translator.translateToAlaskan('hello world')).toBe('hello world');
      });

      test('handles case insensitive translation', () => {
         expect(translator.translateToBC('EE')).toBe('II');
         expect(translator.translateToBC('Ee')).toBe('Ii');
         expect(translator.translateToAlaskan('EE')).toBe('AI');
         expect(translator.translateToAlaskan('Ee')).toBe('Ai');
      });
   });

   describe('case preservation', () => {
      test('preserves all uppercase', () => {
         expect(translator.translateToAlaskan('HEEŁ')).toBe('HAIHL');
         expect(translator.translateToBC('HAIHL')).toBe('HEEŁ');
      });

      test('preserves all lowercase', () => {
         expect(translator.translateToAlaskan('heeł')).toBe('haihl');
         expect(translator.translateToBC('haihl')).toBe('heeł');
      });

      test('preserves title case', () => {
         expect(translator.translateToAlaskan('Heeł')).toBe('Haihl');
         expect(translator.translateToBC('Haihl')).toBe('Heeł');
      });

      test('preserves mixed case in complex words', () => {
         expect(translator.translateToAlaskan('HEEł')).toBe('HAIhl');
         expect(translator.translateToBC('HAIhl')).toBe('HEEł');
      });

      test('translates Sm\'algyax to Shm\'algyack', () => {
         expect(translator.translateToAlaskan('Sm\'algyax')).toBe('Shm\'algyack');
      });

      test('translates Shm\'algyack to Sm\'algyax', () => {
         expect(translator.translateToBC('Shm\'algyack')).toBe('Sm\'algyax');
      });

      test('handles case variations of Sm\'algax', () => {
         expect(translator.translateToAlaskan('SM\'ALGYAX')).toBe('SHM\'ALGYACK');
         expect(translator.translateToAlaskan('sm\'algyax')).toBe('shm\'algyack');
         expect(translator.translateToAlaskan('Sm\'Algyax')).toBe('Shm\'Algyack');
      });
   });

   describe('round trip translation', () => {
      test('BC to Alaskan and back preserves meaning', () => {
         const bcText = "heeł ḵ'uu";
         const alaskanText = translator.translateToAlaskan(bcText);
         const backToBC = translator.translateToBC(alaskanText);
         
         // Note: Due to the nature of the mappings, exact round-trip may not always work
         // but the meaning should be preserved
         expect(alaskanText).toBe("haihl 'ggoo");
         expect(backToBC).toBe("heeł 'g̱uu");

         //validate round trip with Sm'algyax
         const smalgyax  = "Sm'algya̱x";
         const smalgyack = "Shm'algyack";

         expect(translator.translateToAlaskan(smalgyax)).toBe(smalgyack);
         //loses _ on the second 'a' in translation
         expect(translator.translateToBC(smalgyack)).toBe("Sm'algyax");
      });
   });
});