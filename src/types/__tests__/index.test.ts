import { describe, test, expect } from 'vitest';
import { printName, printWaa, printableName,
         compareObjects, hasId
       } from '../index';
import { printableTitles, printTitles } from "../../Content/ContentType";

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
         eng: { title: 'English' }, bc: { title: 'BC' }, ak: { title: 'AK' }
      };
      expect(printTitles(obj)).toBe('English / BC / AK');
   });

   test('omits empty titles', () => {
      const obj: printableTitles = {
         eng: { title: 'English' }, bc: { title: '' }, ak: { title: 'AK' }
      };
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('omits null titles', () => {
      const obj: printableTitles = {
         eng: { title: 'English' },
         //@ts-expect-error testing null
         bc: { title: null },
         ak: { title: 'AK' }
      };
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('handles missing title fields', () => {
      const obj = { eng: { title: 'English' }, ak: { title: 'AK' } };
      //@ts-expect-error testing missing bc_title field
      expect(printTitles(obj)).toBe('English / AK');
   });

   test('handles all titles empty', () => {
      const obj: printableTitles = {
         eng: { title: '' }, bc: { title: '' }, ak: { title: '' }
      };
      expect(printTitles(obj)).toBe('');
   });

   test('preserves 0 as a valid title', () => {
      const obj: printableTitles = {
         eng: { title: 'English' }, bc: { title: '0' }, ak: { title: '' }
      };
      expect(printTitles(obj)).toBe('English / 0');
   });
});
