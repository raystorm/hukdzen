import { createSlice } from '@reduxjs/toolkit';
import { DocumentDetails } from '../DocumentTypes'


const documentListSlice = createSlice({
   name: 'documentList',
   initialState: [] as DocumentDetails[],
   reducers: 
   {
      getAllDocuments: (state, action) => { return state; },
      getOwnedDocuments: (state, action) => { return state; },
      getRecentDocuments: (state, action) => { return state; },
      setDocumentsList: (state, action) => { return state = action.payload; },
   }
})

export const { 
    actions: documentListActions, 
    reducer: documentListReducer 
} = documentListSlice;

export default documentListSlice;