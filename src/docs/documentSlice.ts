import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { emptyDocument } from './initialDocumentDetails';
import {Document, MoveDocument} from "./DocumentTypes";

interface DocumentState {
   item:  Document;
   error: string | null;
}

const initialState: DocumentState = {
   item:  emptyDocument,
   error: null,
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        getDocumentById: (state, action: PayloadAction<string>) => {
           return state;
        },
        getDocumentByFileKey: (state, action: PayloadAction<string>) => { return state; },
        setDocument:     (state, action: PayloadAction<Document>) => {
           state.item = action.payload;
           state.error = null;
        },
        createDocument:  (state, action: PayloadAction<Document>) => {
           state.item = action.payload;
           state.error = null;
        },
        updateDocumentMetadata:  (state, action: PayloadAction<Document>) => {
           state.error = null;
        },
        updateDocumentMetadataSuccess:  (state, action: PayloadAction<Document>) => {
           state.item = action.payload;
           state.error = null;
        },
        updateDocumentMetadataFailure:  (state, action: PayloadAction<string>) => {
           state.error = action.payload;
        },
        updateDocumentVersion:   (state, action: PayloadAction<Document>) => {
           state.item = action.payload;
           state.error = null;
        },
        removeDocument:  (state, action: PayloadAction<Document>) => {
           state.error = null;
        },
        removeDocumentSuccess:  (state) => {
           state.item = emptyDocument;
           state.error = null;
        },
        removeDocumentFailure:  (state, action: PayloadAction<string>) => {
           state.error = action.payload;
        },
        clearDocument:   (state) => {
           state.item = emptyDocument;
           state.error = null;
        },
        moveDocument:    (state, action: PayloadAction<MoveDocument>) => {
           state.error = null;
        },
        moveDocumentSuccess:    (state) => {
           state.error = null;
        },
        moveDocumentFailure:    (state, action: PayloadAction<string>) => {
           state.error = action.payload;
        },
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;