import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios, { AxiosResponse } from "axios";
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';

import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {GraphQLOptions} from "@aws-amplify/api-graphql";

import {ListDocumentDetailsQuery, ListXbiisQuery, ModelDocumentDetailsFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

import documentListSlice, { documentListActions } from './documentListSlice';
import { DocumentDetails } from '../DocumentTypes';
import {getCurrentAmplifyUser} from "../../User/userSaga";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {SearchParams} from "./documentListTypes";
import {DocumentDetailsFieldDefinition} from "../../types/fieldDefitions";
import {BoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {Role} from "../../Role/roleTypes";
import {DefaultBox} from "../../Box/boxTypes";
import {getAllBoxUsers, getAllBoxUsersForUserId} from "../../BoxUser/BoxUserList/BoxUserListSaga";
import {appSelect} from "../../app/hooks";


export function getAllDocuments()
{
   console.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
   });
}

export function getAllAllowedDocuments(boxUsers: BoxUserList)
{
   console.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
      variables: { filter: buildBoxListFilterForBoxUsers(boxUsers) }
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

export function SearchForDocuments(searchParams: SearchParams)
{
   const ddfd = DocumentDetailsFieldDefinition;

   const keyword = searchParams.keyword;
   if ( !keyword || '' === keyword ) { return getAllDocuments(); } //blank search, bail

   // console.log(`Searching for keyword: (${null === keyword}) (${'null' === keyword}) ${keyword}`)

   //process SearchParams
   let field = searchParams.field;
   let fields: string[];
   if ( !field || field === 'keywords' )
   {  //list all fields to search
      fields = [ddfd.id.name,        ddfd.fileKey.name,
                ddfd.eng_title.name, ddfd.eng_description.name,
                ddfd.bc_title.name,  ddfd.bc_description.name,
                ddfd.ak_title.name,  ddfd.ak_description.name,
                'documentDetailsDocOwnerId', 'documentDetailsAuthorId'];
   }
   else fields = [field];

   //TODO: implement sort and pageable later
   const sortField = searchParams.sortField;

   const page = searchParams.page;
   const resultsPerPage = searchParams.resultsPerPage;

   const filter: ModelDocumentDetailsFilterInput = {
      or: []
   };

   for (let fld of fields)
   {
      const fieldFilter = {};
      fieldFilter[fld] = { contains: keyword };
      filter.or!.push(fieldFilter);
   }

   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
      variables: { filter: filter }
   });
}

/*
 *  TODO: Add UserBoxList Filter generator here.
 */

const buildBoxListFilterForBoxUsers = (boxUsers: BoxUserList): ModelDocumentDetailsFilterInput => {
   const filter: ModelDocumentDetailsFilterInput = {
      or: [ { documentDetailsBoxId: { eq: DefaultBox.id } } ]
   };

   //if ( 0 < boxUsers.items.length ) { filter.or = [] }
   for (const boxUser of boxUsers.items)
   {
      if ( !boxUser || Role.None === boxUser.boxRole.role ) { continue; }
      filter.or!.push({documentDetailsBoxId: { eq: boxUser.boxRole.box.id }})
   }
   return filter;
}

export function* handleGetOwnedDocuments(action: PayloadAction<DocumentDetails[]>): any
{
   try
   {
      const amplifyUser = yield getCurrentAmplifyUser();
      const response = yield call(getOwnedDocuments, amplifyUser.username)
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
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
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetAllDocuments(action: PayloadAction<DocumentDetails[], string>): any
{
   try
   {
      let response;

      const user = yield appSelect(state => state.currentUser);
      if ( user.isAdmin ) { response = yield call(getAllDocuments); }
      else
      {
         const boxUsersResponse = yield call(getAllBoxUsersForUserId, user.id);
         response = yield call(getAllAllowedDocuments, boxUsersResponse.data.listBoxUsers);
      }
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleSearchDocuments(action: PayloadAction<SearchParams, string>): any
{
   try
   {
      const response = yield call(SearchForDocuments, action.payload);
      console.log(`Search found: ${JSON.stringify(response)}`);
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchDocumentListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLeading(documentListActions.getAllDocuments.type,
                     handleGetAllDocuments);
   yield takeLeading(documentListActions.getOwnedDocuments.type,
                     handleGetOwnedDocuments);
   yield takeLeading(documentListActions.getRecentDocuments.type,
                     handleGetRecentDocuments);
   yield takeLeading(documentListActions.searchForDocuments.type,
                     handleSearchDocuments);
}