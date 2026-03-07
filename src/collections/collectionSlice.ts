import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
   Collection, AddItemsPayload, RemoveItemPayload, ReorderItemPayload
} from './CollectionTypes';

interface CollectionState {
   items: Collection[];
   error: string | null;
}

const initialState: CollectionState = {
   items: [],
   error: null,
};

const collectionSlice = createSlice({
   name: 'collections',
   initialState,
   reducers: {
      getCollections:    (state) => { return state; },
      getCollectionById: (state, action: PayloadAction<string>) => { return state; },
      setCollections:    (state, action: PayloadAction<Collection[]>) =>
                         { state.items = action.payload; },
      createCollection:  (state, action: PayloadAction<Collection>) =>
                         { state.error = null; },
      createCollectionSuccess: (state, action: PayloadAction<Collection>) => {
         state.error = null;
      },
      createCollectionFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      updateCollection:  (state, action: PayloadAction<Collection>) =>
                         { state.error = null; },
      updateCollectionSuccess: (state, action: PayloadAction<Collection>) => {
         state.error = null;
      },
      updateCollectionFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      addItems:          (state, action: PayloadAction<AddItemsPayload>) =>
                         { state.error = null; },
      addItemsSuccess:   (state) => {
         state.error = null;
      },
      addItemsFailure:   (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      removeItem:        (state, action: PayloadAction<RemoveItemPayload>) =>
                         { state.error = null; },
      removeItemSuccess: (state) => {
         state.error = null;
      },
      removeItemFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
      reorderItem:       (state, action: PayloadAction<ReorderItemPayload>) =>
                         { state.error = null; },
      reorderItemSuccess: (state) => {
         state.error = null;
      },
      reorderItemFailure: (state, action: PayloadAction<string>) => {
         state.error = action.payload;
      },
   },
});

export const {
 actions: collectionActions,
 reducer: collectionReducer,
} = collectionSlice;