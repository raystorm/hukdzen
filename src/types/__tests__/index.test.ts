import { describe, test, expect } from 'vitest';
import { printName, printWaa, printableName,
         compareObjects, hasId,
         printTitles, printableTitles
       } from '../index';

describe('printName', () =>
{
   test('returns empty string if name is null/undefined', () => {
      expect(printName(null)).toBe('');
      expect(printName(undefined)).toBe('');
   });

   test('prints name only when waa is missing', () => {
      const obj: printableName = { name: 'Alice' };
      expect(printName(obj)).toBe('Alice');
   });

   test('prints name with waa when provided', () => {
      const obj: printableName = { name: 'Alice', waa: 'Extra' };
      expect(printName(obj)).toBe('Alice (Extra)');
   });

   it('omits waa if empty string', () => {
      const obj: printableName = { name: 'Alice', waa: '' };
      expect(printName(obj)).toBe('Alice');
   });

   test('prints only waa when name is missing', () => {
      const obj = { waa: 'Extra' };
      //@ts-expect-error Testing missing name property
      expect(printName(obj)).toBe(' (Extra)');
   });
});

describe('printWaa', () => {
   test('returns empty string if waa object is null', () => {
      expect(printWaa(null)).toBe('');
   });

   test('prints waa with name in parentheses', () => {
      const obj: printableName = { name: 'Bob', waa: 'Extra' };
      expect(printWaa(obj)).toBe('Extra (Bob)');
   });

   it('prints only name in parentheses if waa is empty', () => {
      const obj: printableName = { name: 'Bob', waa: '' };
      expect(printWaa(obj)).toBe(' (Bob)');
   });

   test('prints only name in parentheses if waa is missing', () => {
      const obj: printableName = { name: 'Bob', };
      expect(printWaa(obj)).toBe(' (Bob)');
   });
});

describe('compareObjects', () => {
   test('returns true when typename and id match', () => {
      const a: hasId = { __typename: 'Doc', id: '123' };
      const b: hasId = { __typename: 'Doc', id: '123' };
      expect(compareObjects(a, b)).toBe(true);
   });

   test('returns false when typename differs', () => {
      const a: hasId = { __typename: 'Doc', id: '123' };
      const b: hasId = { __typename: 'Other', id: '123' };
      expect(compareObjects(a, b)).toBe(false);
   });

   test('returns false when id differs', () => {
      const a: hasId = { __typename: 'Doc', id: '123' };
      const b: hasId = { __typename: 'Doc', id: '456' };
      expect(compareObjects(a, b)).toBe(false);
   });
});

describe('printTitles', () => {
   test('returns empty string if titles is null', () => {
      expect(printTitles(null)).toBe('');
   });

   test('joins non-empty titles with slashes', () =>
   {
      const obj: printableTitles = {
         eng_title: 'English', bc_title: 'BC', ak_title: 'AK'
      };
      expect(printTitles(obj)).toBe('English / BC / AK');
   });

   test('omits empty titles', () => {
      const obj: printableTitles = {
         eng_title: 'English', bc_title: '', ak_title: 'AK'
      };
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('omits null titles', () => {
      const obj: printableTitles = {
         eng_title: 'English',
         //@ts-expect-error testing null
         bc_title: null,
         ak_title: 'AK'
      };
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('handles missing title fields', () => {
      const obj = { eng_title: 'English', ak_title: 'AK' };
      //@ts-expect-error testing missing bc_title field
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('handles all titles empty', () => {
      const obj: printableTitles = {
         eng_title: '', bc_title: '', ak_title: ''
      };
      expect(printTitles(obj)).toBe('');
   });

   test('preserves 0 as a valid title', () => {
      const obj: printableTitles = {
         eng_title: 'English', bc_title: '0', ak_title: ''
      };
      expect(printTitles(obj)).toBe('English / 0');
   });
});
