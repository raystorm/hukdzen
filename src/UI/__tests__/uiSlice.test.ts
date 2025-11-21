import { describe, it, expect } from 'vitest';
import { uiReducer, uiActions } from '../uiSlice';
import { initialUiState } from '../uiTypes';

describe('uiSlice', () => {
   it('should return the initial state', () => {
      expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialUiState);
   });

   it('should handle setProcessing', () => {
      const actual = uiReducer(initialUiState, uiActions.setProcessing(true));
      expect(actual.isProcessing).toBe(true);
   });

   it('should handle setProcessing false', () => {
      const state = { isProcessing: true };
      const actual = uiReducer(state, uiActions.setProcessing(false));
      expect(actual.isProcessing).toBe(false);
   });
});