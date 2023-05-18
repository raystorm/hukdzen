import { createSlice } from '@reduxjs/toolkit';
import { emptyDocumentDetails } from './initialDocumentDetails';


const documentSlice = createSlice({
    name: 'document',
    initialState: emptyDocumentDetails,
    reducers: {
        selectDocument: (state, action) => { return state = action.payload },
        selectDocumentById: (state, action) => {
           return state; //magic happens in DocumentListSaga
        },
        createDocumentRequested: (state, action) => {
           return state = action.payload;
        },
        removeDocumentRequested: (state, action) => {
           //TODO: implement later, make nullable
           return state = emptyDocumentDetails;
        },
        updateDocumentMetadata: (state, action) => {
            return state = action.payload;
        },
        updateDocumentVersion: (state, action) => {
             return state = action.payload;
        },
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;