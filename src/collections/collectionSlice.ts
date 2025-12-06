import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
   Collection, 
   AddItemsPayload, 
   RemoveItemPayload, 
   ReorderItemPayload 
} from './CollectionTypes';

interface CollectionState { items: Collection[]; }

const initialState: CollectionState = { items: [], };

const collectionSlice = createSlice({
   name: 'collections',
   initialState,
   reducers: {
      loadCollectionsRequest: (state) => { return state; },
      loadCollectionRequest: (state, action: PayloadAction<string>) =>
                             { return state; },
      setCollections: (state, action: PayloadAction<Collection[]>) =>
                      { state.items = action.payload; },
      createCollectionRequest: (state, action: PayloadAction<Collection>) =>
                               { return state; },
      updateCollectionRequest: (state, action: PayloadAction<Collection>) =>
                               { return state; },
      addItemsRequest: (state, action: PayloadAction<AddItemsPayload>) =>
                       { return state; },
      removeItemRequest: (state, action: PayloadAction<RemoveItemPayload>) =>
                         { return state; },
      reorderItemRequest: (state, action: PayloadAction<ReorderItemPayload>) =>
                          { return state; },
   },
});

export const collectionActions = collectionSlice.actions;
export default collectionSlice.reducer;