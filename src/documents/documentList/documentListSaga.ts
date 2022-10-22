import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios, { AxiosResponse } from "axios";
import { DocumentDetails } from '../DocumentTypes';
import documentListSlice, { documentListActions } from './documentListSlice';
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';

type getDocListResponse = {
    documents: DocumentDetails[] 
};

const docListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';


export function getAllDocuments()
{
   return axios.get<getDocListResponse>(docListUrl);
}

//TODO: implement once we have endpoints (or GraphQL API)
export function getOwnedDocuments() { return getAllDocuments(); }


export function getRecentDocuments() { return getAllDocuments(); }


export function* handleGetDocumentList(action: PayloadAction<DocumentDetails[], string>): any
{
  try 
  {
    let response = null;
    //TODO: correctly type this
    let getter: any; //() => Promise<AxiosResponse<getDocListResponse, any>>; 
    switch(action.type)
    {
      case documentListActions.getOwnedDocuments.type:
        getter = getOwnedDocuments;
        break;
      case documentListActions.getRecentDocuments.type:
        getter = getRecentDocuments;
        break;
      case documentListActions.getAllDocuments.type:
      default:
        getter = getAllDocuments;

    }
    response = yield call(getter, action.payload );
    //const { data } = response;
    yield put(documentListActions.setDocumentsList(response));
  }
  catch (error) { console.log(error); }
}

export function* watchDocumentSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(documentListActions.getAllDocuments.type,
                     handleGetDocumentList);
   yield takeLeading(documentListActions.getOwnedDocuments.type,
                     handleGetDocumentList);
   yield takeLeading(documentListActions.getRecentDocuments.type,
                     handleGetDocumentList);
}