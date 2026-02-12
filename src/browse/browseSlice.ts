import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Xbiis } from '../Box/boxTypes';
import { BrowseFilters, emptyBrowseState, sort } from "./browseTypes";

export const initialBrowseState = emptyBrowseState;

const browseSlice = createSlice({
   name:         'browse',
   initialState: initialBrowseState,
   reducers:     {
      setSelectedBox: (state, action: PayloadAction<Xbiis>) =>
      { state.selectedBox = action.payload; },
      setVisibleFields: (state, action: PayloadAction<string[]>) =>
      { state.visibleFields = action.payload; },
      setSort: (state, action: PayloadAction<sort>) =>
      { state.sort = action.payload; },
      setFilters: (state, action: PayloadAction<Partial<BrowseFilters>>) =>
      { state.filters = { ...state.filters, ...action.payload }; },
      clearFilters: (state) => { state.filters = emptyBrowseState.filters; },
   },
});

export const { actions: browseActions, reducer: browseReducer } = browseSlice;
export default browseSlice;