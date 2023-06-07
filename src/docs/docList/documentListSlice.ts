import { createSlice } from '@reduxjs/toolkit';
import { DocumentDetails } from '../DocumentTypes'
import { documentActions } from '../documentSlice';
import {emptyDocList} from "./documentListTypes";


const documentListSlice = createSlice({
   name: 'documentList',
   initialState: emptyDocList,
   reducers: 
   {
      getAllDocuments:    (state, action) => { return state; },
      getOwnedDocuments:  (state, action) => { return state; },
      getRecentDocuments: (state, action) => { return state; },
      setDocumentsList:   (state, action) => { return state = action.payload; },
      searchForDocuments: (state, action) => { return state; },
   },
   extraReducers: (builder) => {
      builder
        .addCase(documentActions.createDocumentRequested,
                 (state, action) =>
         {
            state.items.push(action.payload);
            return state;
         })
        .addCase(documentActions.removeDocumentRequested,
                  (state: any, action:any) => {
            state.items.filter((doc: DocumentDetails) => doc.id !== action.payload.id);
            return state;
         })
        .addMatcher((action) => {
                    return [documentActions.updateDocumentMetadata.type,
                            documentActions.updateDocumentVersion.type]
                              .includes(action.type) },
                    (state: any, action:any) => {
            let index = state.items.findIndex((item) => {
               return (item.id === action.payload.id);
            });
            state.items[index] = action.payload;
            return state;
         })
   }
})

export const { 
    actions: documentListActions, 
    reducer: documentListReducer 
} = documentListSlice;

export default documentListSlice;