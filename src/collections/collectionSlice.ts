import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
   Collection, AddItemsPayload, RemoveItemPayload, ReorderItemPayload
} from './CollectionTypes';

interface CollectionState { items: Collection[]; }

const initialState: CollectionState = { items: [], };

const collectionSlice = createSlice({
   name: 'collections',
   initialState,
   reducers: {
      getCollections:    (state) => { return state; },
      getCollectionById: (state, action: PayloadAction<string>) => { return state; },
      setCollections:    (state, action: PayloadAction<Collection[]>) =>
                         { state.items = action.payload; },
      createCollection:  (state, action: PayloadAction<Collection>) =>
                         { return state; },
      updateCollection:  (state, action: PayloadAction<Collection>) =>
                         { return state; },
      addItems:          (state, action: PayloadAction<AddItemsPayload>) =>
                         { return state; },
      removeItem:        (state, action: PayloadAction<RemoveItemPayload>) =>
                         { return state; },
      reorderItem:       (state, action: PayloadAction<ReorderItemPayload>) =>
                         { return state; },
   },
});

export const {
 actions: collectionActions,
 reducer: collectionReducer,
} = collectionSlice;