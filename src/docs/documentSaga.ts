import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios from 'axios';
import { DocumentDetails } from './DocumentTypes';
import documentSlice, { documentActions } from './documentSlice';

type getDocListResponse = {
    documents: DocumentDetails[] 
};

const docListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';

export function getDocumentById(id: string) 
{
  console.log("REST CALL to get document: " + id);
  return axios.get<getDocListResponse>(docListUrl)
              .then(list => list.data.documents.find(doc => doc.id === id));
}

export function createDocument(document: DocumentDetails) 
{
  /* TODO: PUT rest call for update * /
  console.log("REST CALL to get document: " + id);
  return axios.get<getDocListResponse>(docListUrl)
              .then(list => list.data.documents.find(doc => doc.id === id));
  */

  //error checks
  if ( document.version > 1 )
  {
    //TODO: throw an error
  }

  
  return document
}

export function updateDocument(document: DocumentDetails) 
{
  /* TODO: PUT rest call for update * /
  console.log("REST CALL to get document: " + id);
  return axios.get<getDocListResponse>(docListUrl)
              .then(list => list.data.documents.find(doc => doc.id === id));
  */

  /*
  const oldDocument:DocumentDetails; //TODO: get previous version.

  if ( document.version <= oldDocument.version )
  {
    //TODO: throw an Error, version MUST in crease for a new upload
  }
  */
  
  return document
}

//TODO: find correct type for action
export function* handleGetDocumentById(action: any): any
{
  try 
  {
    console.log(`handleGetDocumentById ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    const response = yield call(getDocumentById, action.payload);
    //const { data } = response;
    yield put(documentActions.selectDocument(response));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateDocumentMetadata(action: any): any
{
  try 
  {
    console.log(`handleUpdateDocumentMetadata ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    //const response = yield call(getDocumentById, action.payload);
    //const { data } = response;
    yield put(documentActions.selectDocument(action.payload));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateDocumentVersion(action: any): any
{
  try 
  {
    console.log(`handleUpdateDocumentVersion ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    //const response = yield call(getDocumentById, action.payload);
    //const { data } = response;
    yield put(documentActions.selectDocument(action.payload));
  }
  catch (error) { console.log(error); }
}

export function* watchDocumentSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(documentActions.selectDocumentById.type, 
                    handleGetDocumentById);
   //TODO: should this be takeLatest?
   yield takeEvery(documentActions.updateDocumentMetadata.type,
                   handleUpdateDocumentMetadata);
   yield takeEvery(documentActions.updateDocumentVersion.type,
                   handleUpdateDocumentVersion);

}