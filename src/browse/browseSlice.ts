import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Xbiis } from '../Box/boxTypes';
import { sortDirection } from '../docs/docList/documentListTypes';

export interface sort {
   field:     string;
   direction: sortDirection;
}

export interface DateRangeFilter {
   from?: string;
   to?: string;
}

export interface BrowseFilters {
   authors: string[];
   docOwners: string[];
   types: string[];
   created: DateRangeFilter;
   updated: DateRangeFilter;
   keywords: string[];
}

interface BrowseState {
   selectedBox: Xbiis | null;
   visibleFields: string[];
   sort: sort;
   filters: BrowseFilters;
}

const initialState: BrowseState = {
   selectedBox: null,
   visibleFields: ['eng_title', 'bc_title', 'ak_title'],
   sort: {
      field:     'eng_title',
      direction: sortDirection.ASC,
   },
   filters: {
      authors: [],
      docOwners: [],
      types: [],
      created: {},
      updated: {},
      keywords: [],
   },
};

const browseSlice = createSlice({
   name: 'browse',
   initialState,
   reducers: {
      setSelectedBox: (state, action: PayloadAction<Xbiis>) => {
         state.selectedBox = action.payload;
      },
      setVisibleFields: (state, action: PayloadAction<string[]>) => {
         state.visibleFields = action.payload;
      },
      setSort: (state, action: PayloadAction<sort>) => {
         state.sort = action.payload;
      },
      setFilters: (state, action: PayloadAction<Partial<BrowseFilters>>) => {
         state.filters = { ...state.filters, ...action.payload };
      },
      clearFilters: (state) => {
         state.filters = initialState.filters;
      },
   },
});

export const { actions: browseActions, reducer: browseReducer } = browseSlice;
export default browseSlice;