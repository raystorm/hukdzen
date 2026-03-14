import {call, put, takeLatest, takeLeading} from 'redux-saga/effects'
import {PayloadAction} from '@reduxjs/toolkit';

import {generateClient} from "@aws-amplify/api";
import {GraphQLOptions, GraphQLResult} from "@aws-amplify/api-graphql";

import { ModelDocumentFilterInput, } from "../../graphql/API";
import { emptySearchResultItem, SortDirection } from "../../Search/searchTypes";
import type {
              SearchQueryVariables, SearchResults, SearchResultItem
            } from "../../Search/searchTypes";
import * as queries from "../../graphql/queries";

import { logger } from "../../utils/logger";
import { validateResponseList } from "../../utils/saga.utilities";

import { documentListActions } from './documentListSlice';
import { Document } from '../DocumentTypes';
import {getCurrentAmplifyUser} from "../../User/userSaga";
import { buildFriendlyErrorAlert } from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import { DocumentList, emptyDocList, SearchParams } from "./documentListTypes";
import {DocumentFieldDefinition} from "../../types/fieldDefitions";
import { BoxUserList } from "../../BoxUser/BoxUserList/BoxUserListType";
import {DefaultRole, Role} from "../../Role/roleTypes";
import {DefaultBox} from "../../Box/boxTypes";
import {getAllBoxUsersForUserId} from "../../BoxUser/BoxUserList/BoxUserListSaga";
import {appSelect} from "../../app/hooks";
import {buildBoxUser} from "../../BoxUser/BoxUserType";
import {User} from "../../User/userType";
import {unknownAuthor} from "../../Author/AuthorType";
import {uiActions} from "../../UI/uiSlice";

const client = generateClient();

const validateDocumentListResponse = (response: any, selector: (r: any) => any): DocumentList =>
{
   const list = validateResponseList(response, selector, 'DocumentList');
   return attemptDocListFix(list);
}

export function getAllDocuments()
{
   logger.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return client.graphql({ query: queries.listDocuments, });
}

/**
 *   Gets All Visible Documents for nonAdmin Users.
 *   @param boxUsers List of Boxes the User Has access to.
 */
export function getAllVisibleDocuments(boxUsers: BoxUserList)
{
   logger.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return client.graphql({
      query: queries.listDocuments,
      variables: { filter: buildBoxListFilterForBoxUsers(boxUsers) }
   });
}

/**
 *  Gets the list of Documents owned by the user.
 *  *NOTE*: ID is assumed to be current User, so we ignore boxUser Perms checking.
 *  @param userId owner user ID
 */
export function getOwnedDocuments(userId: string)
{
   const filter: ModelDocumentFilterInput = {
      documentContentOwnerUserId: { eq: userId },
   }

   return client.graphql({
      query: queries.listDocuments,
      variables: { filter: filter }
   });
}

/**
 *  Gets Documents Owned by User, in DESC order based on most recently updated.
 *  *NOTE*: ID is assumed to be current User, so ignore boxUser Perms checking.
 *  @param userId owner user ID
 */
export function getRecentDocuments(userId: string)
{
   const filter: ModelDocumentFilterInput = {
      documentContentOwnerUserId: { eq: userId },
   };
   const sort = { direction: 'DESC', field: 'updated' };

   const graphql: GraphQLOptions =  {
      query: queries.listDocuments,
      variables: { filter: filter, sort: sort }
   }

   logger.log('Load Recent Docs Query:', graphql);
   return client.graphql(graphql);
}

export function getAllDocumentsForBox(boxId: string) {
   const filter: ModelDocumentFilterInput = {
      documentBoxXbiisId: { eq: boxId }
   };
   return client.graphql({
                            query: queries.listDocuments,
                            variables: { filter }
                         });
}

export function SearchForDocuments(searchParams: SearchParams,
                                   boxUsers: BoxUserList | null)
{
   const ddfd = DocumentFieldDefinition;

   const keyword = searchParams.keyword;

   //process SearchParams
   let field = searchParams.field;
   if ( !field ) { field = 'keywords'; }

   //assume ascending order sort.
   let sortDir = SortDirection.ASC;
   if ( SortDirection.DESC === searchParams.sortDirection)
   { sortDir = SortDirection.DESC; }

   const sortField = searchParams.sortField ?? ddfd.created.name;

   //TODO: implement pageable later
   const page = searchParams.page;
   const resultsPerPage = searchParams.resultsPerPage;

   let boxIds: string[] | undefined;
   if ( boxUsers ) { boxIds = buildBoxIdListForBoxUsers(boxUsers); }

   return client.graphql({
      query:     queries.search,
      variables: {
         field: field,
         query: keyword,
         boxIds: boxIds,
         sortDirection: sortDir,
         sortField: sortField,
      }
   });
}

export function AdvancedSearch(query: SearchQueryVariables,
                               boxUsers: BoxUserList | null)
{
   return client.graphql({
      query:     queries.search,
      variables: query,
   });
}

/*
 *  TODO: Add UserBoxList Filter generator here.
 */

export const buildBoxIdListForBoxUsers = (boxUsers: BoxUserList): string[] =>
{
   const ids = [DefaultBox.id];

   for (const boxUser of boxUsers.items)
   {
      if ( !boxUser || Role.None === boxUser.role ) { continue; }
      ids.push(boxUser.box.id);
   }
   return ids;
}

export const buildBoxListFilterForBoxUsers = (boxUsers: BoxUserList):
       ModelDocumentFilterInput =>
{
   const filter: ModelDocumentFilterInput = {
      or: [ { documentBoxXbiisId: { eq: DefaultBox.id } } ]
   };

   for (const boxUser of boxUsers.items)
   {
      if ( !boxUser || Role.None === boxUser.role ) { continue; }
      filter.or!.push({documentBoxXbiisId: { eq: boxUser.box.id }})
   }
   return filter;
}

export function* handleGetOwnedDocuments(): any
{
   try
   {
      const amplifyUser = yield call(getCurrentAmplifyUser);
      const response = yield call(getOwnedDocuments, amplifyUser.username)
      const docList = validateDocumentListResponse(response, r => r.data.listDocuments);
      yield put(documentListActions.setDocumentsList(docList));
      logger.log('Found Owned Documents:', docList);
   }
   catch (error)
   {
      logger.error(error);
      let msg = error;
      if ( isGraphQLResult(error) )
      {
         const list = validateDocumentListResponse(error, r => r.data.listDocuments);
         yield put(documentListActions.setDocumentsList(list));
         msg = getGraphQLErrorMessage(error) || 'Partial errors returned from GraphQL.';
      }
      const message = buildFriendlyErrorAlert('Failed to GET DocumentList', msg);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetRecentDocuments(): any
 {
    try
    {
      const amplifyUser = yield call(getCurrentAmplifyUser);
      const response = yield call(getRecentDocuments, amplifyUser.username)
      //logger.log('found recent docs:',  response);
      // If the GraphQL response contains errors but also returns data, try to fix the list

      const docList = validateDocumentListResponse(response, r => r.data.listDocuments);
      yield put(documentListActions.setDocumentsList(docList));

      if ( response && response.errors
        && Array.isArray(response.errors) && response.errors.length > 0)
      {
         const msg = getGraphQLErrorMessage(response) || 'Partial errors returned from GraphQL.';
         const alert = buildFriendlyErrorAlert('Failed to GET DocumentList', msg);
         yield put(alertBarActions.DisplayAlertBox(alert));
      }
    }
    catch(error)
    {
       logger.error(error);
       let msg = error;
       if ( isGraphQLResult(error) )
       {
          const list = validateDocumentListResponse(error, r => r.data.listDocuments);
          yield put(documentListActions.setDocumentsList(list));
          msg = getGraphQLErrorMessage(error) || 'Partial errors returned from GraphQL.';
       }
       const message = buildFriendlyErrorAlert('Failed to GET DocumentList', msg);
       yield put(alertBarActions.DisplayAlertBox(message));
    }
}

export function* handleGetAllDocuments(action: PayloadAction<Document[], string>): any
{
   try
   {
      let response;
      const user = yield appSelect(state => state.currentUser);
      if ( user.isAdmin ) { response = yield call(getAllDocuments); }
      else
      {
         const boxUsersResponse = yield call(getAllBoxUsersForUserId, user.id);
         response = yield call(getAllVisibleDocuments, boxUsersResponse.data.listBoxUsers);
      }
      const docList = validateDocumentListResponse(response, r => r.data.listDocuments);
      yield put(documentListActions.setDocumentsList(docList));
   }
   catch(error)
   {
      logger.error(error);
      let msg = error;
      if ( isGraphQLResult(error) )
      {
         const list = validateDocumentListResponse(error, r => r.data.listDocuments);
         yield put(documentListActions.setDocumentsList(list));
         msg = getGraphQLErrorMessage(error) || 'Partial errors returned from GraphQL.';
      }
      const message = buildFriendlyErrorAlert('Failed to GET DocumentList', msg);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

/**
 * Temp converter search -> documentList until we can migrate to SearchSaga
 * @param results
 */
export const searchBandaid = (results: SearchResults) =>
{ return convertSearchResultsToDocumentList(results); }

/**
 *   search function get/send Search from AWS, but need to store DocumentList.
 *   This is a temp converter until we can migrate to searchSaga
 *   @param results
 */
export const convertSearchResultsToDocumentList = (results: SearchResults) =>
{
   if ( !results?.items ) { return emptyDocList; }
   const dl = { ...emptyDocList };
   dl.items = [];
   for (const item of results.items )
   { if ( item?.document ) { dl.items.push(item.document as Document); } }
   dl.nextToken = results.nextToken;
   return dl;
}

export function* handleSearchDocuments(action: PayloadAction<SearchParams, string>): any
{
   try
   {
      const searchParams = action.payload;
      const keyword = searchParams.keyword;
      let response;
      const currentUser: User = yield appSelect(state => state.currentUser);
      const isAdmin = currentUser.isAdmin;
      let boxUsers: BoxUserList | null = null;
      if ( !isAdmin )
      {
         const buResponse = yield call(getAllBoxUsersForUserId, currentUser.id);
         boxUsers = buResponse.data.listBoxUsers;
      }
      if ( !keyword || '' === keyword.trim() )
      {
         let boxUsers = yield appSelect(state => state.boxUserList);
         if ( !boxUsers || !boxUsers.items || 0 === boxUsers.items.length )
         {
            const user = yield appSelect(state => state.currentUser);
            const boxUsersResponse = yield call(getAllBoxUsersForUserId, user.id);
            boxUsers = boxUsersResponse.data.listBoxUsers;
            boxUsers.items.push(buildBoxUser(user, DefaultBox, DefaultRole));
         }
         logger.log('getting all Allowed Documents for:', boxUsers);
         response = yield call(getAllVisibleDocuments, boxUsers);
         const docList = validateDocumentListResponse(response, r => r.data.listDocuments);
         yield put(documentListActions.setDocumentsList(docList));
      }
      else
      {
         response = yield call(SearchForDocuments, action.payload, boxUsers);
         const searchResults = validateResponseList(response, r => r.data.search, 'SearchResults');
         const converted = searchBandaid(searchResults);
         const docList = attemptDocListFix(converted);
         yield put(documentListActions.setDocumentsList(docList));
      }
      logger.log('Search found:', response);
   }
   catch (error)
   {
      logger.error(error);
      let msg = error;
      if ( isGraphQLResult(error) )
      {
         const list = validateDocumentListResponse(error, r => r.data.listDocuments);
         yield put(documentListActions.setDocumentsList(list));
         msg = getGraphQLErrorMessage(error) || 'Partial errors returned from GraphQL.';
      }
      const message = buildFriendlyErrorAlert('Failed to GET DocumentList', msg);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleAdvancedSearch(action: PayloadAction<SearchQueryVariables, string>): any
{
   try
   {
      const query: SearchQueryVariables = { ...action.payload, };

      const currentUser: User = yield appSelect(state => state.currentUser);
      const isAdmin = currentUser.isAdmin;
      let boxUsers: BoxUserList | null = null;
      if ( !isAdmin )
      {
         const buResponse = yield call(getAllBoxUsersForUserId, currentUser.id);
         boxUsers = buResponse.data.listBoxUsers;
         if ( boxUsers )
         {
            logger.log('filter search for Allowed Documents:', boxUsers);
            query.boxIds = buildBoxIdListForBoxUsers(boxUsers);
         }
      }
      let response = yield call(AdvancedSearch, query, boxUsers);
      logger.log('Search found',  response.data.search.items.length, 'item(s)');
      logger.log('Search found:', response);
      const searchResults = validateResponseList(response, r => r.data.search, 'SearchResults');
      const converted = searchBandaid(searchResults);
      const docList = attemptDocListFix(converted);
      yield put(documentListActions.setDocumentsList(docList));
      if ( response && response.errors
        && Array.isArray(response.errors) && response.errors.length > 0 )
      {
         const msg   = getGraphQLErrorMessage(response) || 'Partial errors returned from GraphQL.';
         const alert = buildFriendlyErrorAlert('Advanced Search Failed', msg);
         yield put(alertBarActions.DisplayAlertBox(alert));
      }
   }
   catch (error)
   {
      logger.error(error);
      let msg = error;
      if ( isGraphQLResult(error) )
      {
         const list = validateResponseList(error, r => r.data.search, 'SearchResults');
         const fixed = yield call(attemptDocListFix, searchBandaid(list));
         yield put(documentListActions.setDocumentsList(fixed));

         msg = getGraphQLErrorMessage(error) || 'Partial errors returned from GraphQL.';
      }
      const message = buildFriendlyErrorAlert('Advanced Search Failed', msg);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

const isGraphQLResult = (error: any): error is GraphQLResult<any> => {
   return (error as GraphQLResult<any>).data !== undefined;
}

const getGraphQLErrorMessage = (error:  any): string | undefined =>
{
   const err = error as GraphQLResult<any>;
   if ( err.errors !== undefined && 0 !== err.errors.length )
   { return err.errors[0].message; }
   return undefined;
   //return err.errors !== undefined && 0 != err.errors.length;
}

export const attemptDocListFix = (list: ({ items: (Document | null)[]; })): DocumentList =>
{
   const copy: DocumentList = { __typename: "DocumentList", ...list, items: [], }
   for (const item of list.items)
   {
      if ( null == item ) { continue; } //skip completely empty rows

      let isFixed = false;
      //check for required fields
      if ( !item.documentContentOwnerUserId )
      {
         item.documentContentOwnerUserId = DefaultBox.xbiisOwnerId!;
         item.contentOwner = DefaultBox.owner!;
         isFixed = true;
      }
      if (!item.documentAuthorId)
      {
         item.documentAuthorId = unknownAuthor.id;
         item.author = unknownAuthor;
         isFixed = true;
      }
      if ( !item.documentBoxXbiisId )
      {
         item.documentBoxXbiisId = DefaultBox.id;
         item.box = DefaultBox;
         isFixed = true;
      }
      copy.items.push(item);
      // data not sent to fix
      // if ( isFixed ) { call(updateDocument, item); }
   }
   return copy;
}

export function* handleGetDocumentsByBoxId(action: PayloadAction<string>): any
{
   try
   {
      yield put(uiActions.setProcessing(true));
      const boxId = action.payload;
      const response = yield call(getAllDocumentsForBox, boxId);
      const docList = validateDocumentListResponse(response, r => r.data.listDocuments);
      yield put(documentListActions.setDocumentsList(docList));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to GET Documents for Box', error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
   finally { yield put(uiActions.setProcessing(false)); }
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
   yield takeLatest(documentListActions.advancedSearch.type,
                     handleAdvancedSearch);
   yield takeLeading(documentListActions.getDocumentsByBoxId.type,
                     handleGetDocumentsByBoxId);
}