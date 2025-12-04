import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { vi } from 'vitest';
import { useTranslator, TranslationDirection } from '../useTranslator';
import { loadTestStore } from '../../../__utils__/testUtilities';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';

// Mock the translator wrapper using the same path as the useTranslator import
vi.mock('../../shared/translatorWrapper', () => {
   const mockInstance = {
      translateToAlaskan: vi.fn((text) => `ak_${text}`),
      translateToBC: vi.fn((text) => `bc_${text}`)
   };
   
   return { default: vi.fn(() => mockInstance) };
});

describe('useTranslator', () => {
   let store: any;
   let renderTranslatorHook: () => any;

   beforeEach(() => {
      store = loadTestStore({});
      vi.clearAllMocks();
      
      renderTranslatorHook = () => {
         return renderHook(() => useTranslator(), {
            wrapper: ({ children }: { children: React.ReactNode }) =>
                        <Provider store={store}>{children}</Provider>
         });
      };
   });

   describe('translateField', () => {
      test('translates BC to AK successfully', () => {
         const { result } = renderTranslatorHook();
         
         const translated = result.current.translateField(
            'test bc text', TranslationDirection.BC_TO_AK
         );

         expect(translated).toBe('ak_test bc text');
         expect(store.dispatch).toHaveBeenCalledWith(
            alertBarActions.DisplayAlertBox(expect.objectContaining({
               severity: 'success',
               message: 'Translation completed'
            }))
         );
      });

      test('translates AK to BC successfully', () => {
         const { result } = renderTranslatorHook();
         
         const translated = result.current.translateField(
            'test ak text', TranslationDirection.AK_TO_BC
         );

         expect(translated).toBe('bc_test ak text');
         expect(store.dispatch).toHaveBeenCalledWith(
            alertBarActions.DisplayAlertBox(expect.objectContaining({
               severity: 'success',
               message: 'Translation completed'
            }))
         );
      });

      test('returns null when source is empty', () => {
         const { result } = renderTranslatorHook();
         
         const translated = result.current.translateField(
            '', TranslationDirection.BC_TO_AK
         );

         expect(translated).toBeNull();
         expect(store.dispatch).toHaveBeenCalledWith(
            alertBarActions.DisplayAlertBox(expect.objectContaining({
               severity: 'error',
               message: 'Cannot translate: Source text is empty'
            }))
         );
      });

      test('handles whitespace-only source text', () => {
         const { result } = renderTranslatorHook();
         
         const translated = result.current.translateField(
            '   ', TranslationDirection.BC_TO_AK
         );

         expect(translated).toBeNull();
         expect(store.dispatch).toHaveBeenCalledWith(
            alertBarActions.DisplayAlertBox(expect.objectContaining({
               severity: 'error',
               message: 'Cannot translate: Source text is empty'
            }))
         );
      });


   });
});