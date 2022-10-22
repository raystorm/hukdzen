import { createSlice } from '@reduxjs/toolkit';
import { initialDocumentDetail } from './initialDocumentDetails';


const documentSlice = createSlice({
    name: 'document',
    initialState: initialDocumentDetail,
    reducers: {
        selectDocument: (state, action) => { return state = action.payload },
        selectDocumentById: (state, action) => {
           return state; //magic happens in DocumentListSaga
        },
        createDocumentRequested: (state) => {
           return state = initialDocumentDetail; 
        },
        removeDocumentRequested: (state, action) => {
           //TODO: implement later, make nullable
           return state = initialDocumentDetail;
        }
    }
})

export const { 
    actions: documentActions, 
    reducer: documentReducer 
} = documentSlice;

export default documentSlice;