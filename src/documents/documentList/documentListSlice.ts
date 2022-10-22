import { createSlice } from '@reduxjs/toolkit';
import { DocumentDetails } from '../DocumentTypes'


const documentListSlice = createSlice({
   name: 'documentList',
   initialState: [],
   reducers: 
   {
      getAllDocuments: (state, action) => { },
      getOwnedDocuments: (state, action) => { },
      getRecentDocuments: (state, action) => { },
      setDocumentsList: (state, action) => { return state = action.payload; },
   }
})

export const { 
    actions: documentListActions, 
    reducer: documentListReducer 
} = documentListSlice;

export default documentListSlice;