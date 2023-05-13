import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios, { AxiosResponse } from "axios";
import { DocumentDetails } from '../DocumentTypes';
import documentListSlice, { documentListActions } from './documentListSlice';
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {ListDocumentDetailsQuery, ListXbiisQuery, ModelDocumentDetailsFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {getCurrentAmplifyUser} from "../../User/userSaga";
import {GraphQLOptions} from "@aws-amplify/api-graphql";

type getDocListResponse = {
    documents: DocumentDetails[] 
};

export function getAllDocuments()
{
   console.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
   });
}

export function getOwnedDocuments(userId: string) {

   const filter: ModelDocumentDetailsFilterInput = {
      documentDetailsDocOwnerId: { eq: userId },
   }

   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
      variables: { filter: filter }
   });
}

export function getRecentDocuments(userId: string) {

   const filter: ModelDocumentDetailsFilterInput = {
      documentDetailsDocOwnerId: { eq: userId },
   };
   const sort = { direction: 'DESC', field: 'created' };

   const graphql: GraphQLOptions =  {
      query: queries.listDocumentDetails,
      variables: { filter: filter, sort: sort }
   }

   console.log(`Load Recent Docs Query: ${JSON.stringify(graphql, null, 2)}`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>(graphql);
}

export function SearchForDocuments(keywords: string) { return getAllDocuments(); }

export function* handleGetOwnedDocuments(action: PayloadAction<DocumentDetails[]>): any
{
   try
   {
      const amplifyUser = yield getCurrentAmplifyUser();
      const response = yield call(getOwnedDocuments, amplifyUser.username)
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error) { console.log(error); }
}

export function* handleGetRecentDocuments(action: PayloadAction<DocumentDetails[]>): any
{
   try
   {
      const amplifyUser = yield getCurrentAmplifyUser();
      const response = yield call(getRecentDocuments, amplifyUser.username)
      console.log(`found recent docs: ${JSON.stringify(response)}`);
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error) { console.log(error); }
}

export function* handleGetAllDocuments(action: PayloadAction<DocumentDetails[], string>): any
{
   try
   {
      const response = yield call(getAllDocuments);
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error) { console.log(error); }
}

export function* handleSearchDocuments(action: PayloadAction<DocumentDetails[], string>): any
{ //TODO: implement w/ open search
  return handleGetAllDocuments(action);
}

export function* watchDocumentListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(documentListActions.getAllDocuments.type,
                     handleGetAllDocuments);
   yield takeLeading(documentListActions.getOwnedDocuments.type,
                     handleGetOwnedDocuments);
   yield takeLeading(documentListActions.getRecentDocuments.type,
                     handleGetRecentDocuments);
   yield takeLeading(documentListActions.searchForDocuments.type,
                     handleSearchDocuments);
}