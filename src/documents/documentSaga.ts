import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios from "axios";
import { DocumentDetails } from './DocumentTypes';
import documentSlice, { documentActions } from './documentSlice';

type getDocListResponse = {
    documents: DocumentDetails[] 
};

const docListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';

export function getDocumentById(id: string) 
{
   return axios.get<getDocListResponse>(docListUrl)
               .then(list => list.data.documents.find(doc => doc.id === id));
    
}

export function* handleGetDocumentById(action: typeof documentActions.selectDocumentById): any
{
  try 
  {
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    const response = yield call(getDocumentById, action.arguments);
    //const { data } = response;
    yield put(documentActions.selectDocument(response));
  }
  catch (error) { console.log(error); }
}


export function* watchDocumentSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(documentActions.selectDocumentById.type, 
                    handleGetDocumentById);
}