import { createSlice } from '@reduxjs/toolkit';
import { DocumentDetails } from '../DocumentTypes'
import { documentActions } from '../documentSlice';


const documentListSlice = createSlice({
   name: 'documentList',
   initialState: [] as DocumentDetails[],
   reducers: 
   {
      getAllDocuments: (state, action) => { return state; },
      getOwnedDocuments: (state, action) => { return state; },
      getRecentDocuments: (state, action) => { return state; },
      setDocumentsList: (state, action) => { return state = action.payload; },
   },
   //TODO move the remove/create reducers here
   extraReducers: (builder) => {
      builder
        .addCase(documentActions.createDocumentRequested, (state, action) => 
         {
            state.push(action.payload);
            return state;
         })
        .addCase=(documentActions.removeDocumentRequested, 
                  (state: any, action:any) => {
            state.filter((doc: DocumentDetails) => doc.id !== action.payload.id);
            return state;
         })
   }
})

export const { 
    actions: documentListActions, 
    reducer: documentListReducer 
} = documentListSlice;

export default documentListSlice;