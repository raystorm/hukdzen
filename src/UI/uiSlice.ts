import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState, initialUiState } from './uiTypes';

const uiSlice = createSlice({
   name: 'ui',
   initialState: initialUiState,
   reducers: {
      setProcessing: (state, action: PayloadAction<boolean>) => {
         state.isProcessing = action.payload;
      },
   },
});


export const {
   actions: uiActions,
   reducer: uiReducer
} = uiSlice;

export default uiSlice;