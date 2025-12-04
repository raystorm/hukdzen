import { describe, test, expect, beforeEach } from 'vitest';
import TranslatorWrapper from '../translatorWrapper';

describe('TranslatorWrapper', () => {
   let wrapper: TranslatorWrapper;

   beforeEach(() => { wrapper = new TranslatorWrapper(); });

   test('creates instance successfully', () => {
      expect(wrapper).toBeInstanceOf(TranslatorWrapper);
   });

   test('translateToBC performs actual BC to Alaskan translation', () => {
      const result = wrapper.translateToBC('ai');
      expect(result).toBe('ee'); // ai -> ee in BC orthography
   });

   test('translateToAlaskan performs actual Alaskan to BC translation', () => {
      const result = wrapper.translateToAlaskan('ee');
      expect(result).toBe('ai'); // ee -> ai in Alaskan orthography
   });

   test('handles empty strings', () => {
      expect(wrapper.translateToBC('')).toBe('');
      expect(wrapper.translateToAlaskan('')).toBe('');
   });

   test('handles text with no translation mappings', () => {
      expect(wrapper.translateToBC('hello')).toBe('hello');
      expect(wrapper.translateToAlaskan('hello')).toBe('hello');
   });
});