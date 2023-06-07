import { createSlice } from '@reduxjs/toolkit';
import { emptyDocumentDetails } from './initialDocumentDetails';


const documentSlice = createSlice({
    name: 'document',
    initialState: emptyDocumentDetails,
    reducers: {
        selectDocument:          (state, action) => { return action.payload },
        selectDocumentById:      (state, action) => {
           return state; //magic happens in DocumentSaga
        },
        createDocumentRequested: (state, action) => { return action.payload; },
        removeDocumentRequested: (state, action) => { return emptyDocumentDetails; },
        updateDocumentMetadata:  (state, action) => { return action.payload; },
        updateDocumentVersion:   (state, action) => { return action.payload; },
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;