import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { emptyDocumentDetails } from './initialDocumentDetails';
import {DocumentDetails} from "./DocumentTypes";


const documentSlice = createSlice({
    name: 'document',
    initialState: emptyDocumentDetails,
    reducers: {
        selectDocument:          (state, action: PayloadAction<DocumentDetails>) => { return action.payload },
        selectDocumentById:      (state, action: PayloadAction<string>) => {
           return state; //magic happens in DocumentSaga
        },
        createDocument: (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        updateDocumentMetadata:  (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        updateDocumentVersion:   (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        removeDocument: (state, action: PayloadAction<DocumentDetails>) => { return emptyDocumentDetails; },
        clearDocument: (state) => { return emptyDocumentDetails; },
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;