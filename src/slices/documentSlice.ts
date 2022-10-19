import { createSlice } from '@reduxjs/toolkit';
import { initialDocumentDetail } from '../types/initialValues';
import { 
    selectDocument, 
    selectDocumentById,
    createDocumentRequested,
    updateDocumentRequested,
    removeDocumentRequested,
} from '../actions/document';
//Temp import until we define a better way for local data
import DocList from '../data/docList.json';
import { DocumentDetails } from '../types';

//TODO: load from GraphQL
const getDocByIdHelper = (id: string) => { 
   return DocList.documents.find(doc => doc.id === id) as DocumentDetails;
}

const documentSlice = createSlice({
    name: 'document',
    initialState: initialDocumentDetail,
    reducers: {
        selectDocument: (state, action) => { return state = action.payload },
        selectDocumentById: ( state, action) => {
           return state = getDocByIdHelper(action.payload)
        },
        createDocumentRequested: (state) => {
           return state = initialDocumentDetail 
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

//export documentActions;
//export documentReducer;

export default documentSlice;