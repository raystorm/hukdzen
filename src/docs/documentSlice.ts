import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { emptyDocumentDetails } from './initialDocumentDetails';
import {DocumentDetails, MoveDocument} from "./DocumentTypes";


const documentSlice = createSlice({
    name: 'document',
    initialState: emptyDocumentDetails,
    reducers: {
        getDocumentById: (state, action: PayloadAction<string>) => {
           return state; //magic happens in DocumentSaga
        },
        setDocument:     (state, action: PayloadAction<DocumentDetails>) => { return action.payload },
        createDocument:  (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        updateDocumentMetadata:  (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        updateDocumentVersion:   (state, action: PayloadAction<DocumentDetails>) => { return action.payload; },
        removeDocument:  (state, action: PayloadAction<DocumentDetails>) => { return emptyDocumentDetails; },
        clearDocument:   (state) => { return emptyDocumentDetails; },
        moveDocument:    (state, action: PayloadAction<MoveDocument>) => { return state; },
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;