import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Xbiis } from '../Box/boxTypes';

interface BrowseState {
   selectedBox: Xbiis | null;
   visibleFields: string[];
}

const initialState: BrowseState = {
   selectedBox: null,
   visibleFields: ['eng_title', 'bc_title', 'ak_title'],
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
   },
});

export const { actions: browseActions, reducer: browseReducer } = browseSlice;
export default browseSlice;