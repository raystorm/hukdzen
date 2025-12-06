import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Collection } from './CollectionTypes';

interface CollectionState {
   items: Collection[];
}

const initialState: CollectionState = {
   items: [],
};

const collectionSlice = createSlice({
   name: 'collections',
   initialState,
   reducers: {
      loadCollectionsRequest: (state) => {
         return state;
      },
      loadCollectionRequest: (state, action: PayloadAction<string>) => {
         return state;
      },
      setCollections: (state, action: PayloadAction<Collection[]>) => {
         state.items = action.payload;
      },
      createCollectionRequest: (state, action: PayloadAction<Collection>) => {
         return state;
      },
      updateCollectionRequest: (state, action: PayloadAction<Collection>) => {
         return state;
      },
      addItemsRequest: (state, action: PayloadAction<{ collectionId: string; items: { documentId?: string; childCollectionId?: string }[] }>) => {
         return state;
      },
      removeItemRequest: (state, action: PayloadAction<{ collectionId: string; itemId: string }>) => {
         return state;
      },
      reorderItemRequest: (state, action: PayloadAction<{ collectionId: string; itemId: string; direction: 'up' | 'down' }>) => {
         return state;
      },
   },
});

export const collectionActions = collectionSlice.actions;
export default collectionSlice.reducer;