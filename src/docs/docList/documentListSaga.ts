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
   console.log("load all docs via REST.");
   return axios.get<getDocListResponse>(docListUrl);   
}

//TODO: implement once we have endpoints (or GraphQL API)
export function getOwnedDocuments() { return getAllDocuments(); }


export function getRecentDocuments() { return getAllDocuments(); }

export function SearchForDocuments(keywords: string) { return getAllDocuments(); }


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
      case documentListActions.searchForDocuments.type:
          getter = SearchForDocuments;
          break;
      case documentListActions.getAllDocuments.type:
      default:
        getter = getAllDocuments;
    }
    //console.log(`Load Documents via ${getter.toString()}`);
    response = yield call(getter, action.payload);
    const { data } = response;
    //console.log(`Documents to Load ${JSON.stringify(data.documents)}`);
    yield put(documentListActions.setDocumentsList(data.documents));
  }
  catch (error) { console.log(error); }
}

export function* watchDocumentListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(documentListActions.getAllDocuments.type,
                     handleGetDocumentList);
   yield takeLeading(documentListActions.getOwnedDocuments.type,
                     handleGetDocumentList);
   yield takeLeading(documentListActions.getRecentDocuments.type,
                     handleGetDocumentList);
   yield takeLeading(documentListActions.searchForDocuments.type,
                     handleGetDocumentList);
}