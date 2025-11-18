import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Xbiis } from '../Box/boxTypes';
import { sortDirection } from '../docs/docList/documentListTypes';

export interface sort {
   field:     string;
   direction: sortDirection;
}

interface BrowseState {
   selectedBox: Xbiis | null;
   visibleFields: string[];
   sort: sort;
}

const initialState: BrowseState = {
   selectedBox: null,
   visibleFields: ['eng_title', 'bc_title', 'ak_title'],
   sort: {
      field:     'eng_title',
      direction: sortDirection.ASC,
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
   },
});

export const { actions: browseActions, reducer: browseReducer } = browseSlice;
export default browseSlice;