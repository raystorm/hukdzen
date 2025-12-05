import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useSkipRender } from '../useSkipRender';

const renderHookWithRouter = (path: string, expectedPath: string) => {
   return renderHook(() => useSkipRender(expectedPath), {
      wrapper: ({ children }) => (
         <MemoryRouter initialEntries={[path]}>
            {children}
         </MemoryRouter>
      ),
   });
};

describe('useSkipRender', () => {
   it('should return false when on correct path', () => {
      const { result } = renderHookWithRouter('/collections', '/collections');
      
      expect(result.current()).toBe(false);
   });

   it('should return true when on different path', () => {
      const { result } = renderHookWithRouter('/dashboard', '/collections');
      
      expect(result.current()).toBe(true);
   });

   it('should return false when path matches pattern', () => {
      const { result } = renderHookWithRouter('/user/123', '/user/:id');
      
      expect(result.current()).toBe(false);
   });
});