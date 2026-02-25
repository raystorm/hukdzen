import {call, put, takeLatest, takeLeading} from 'redux-saga/effects'
import {PayloadAction} from '@reduxjs/toolkit';

import {generateClient} from "@aws-amplify/api";
import {GraphQLOptions, GraphQLResult} from "@aws-amplify/api-graphql";

import { ModelDocumentDetailsFilterInput, } from "../../graphql/API";
import { emptySearchResultItem, SortDirection } from "../../Search/searchTypes";
import type {
              SearchQueryVariables, SearchResults, SearchResultItem
            } from "../../Search/searchTypes";
import * as queries from "../../graphql/queries";

import { logger } from "../../utils/logger";

import {documentListActions} from './documentListSlice';
import {DocumentDetails} from '../DocumentTypes';
import {getCurrentAmplifyUser} from "../../User/userSaga";
import { Alert, buildErrorAlert } from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import { DocumentList, emptyDocList, SearchParams } from "./documentListTypes";
import {DocumentDetailsFieldDefinition} from "../../types/fieldDefitions";
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

export function getAllDocuments()
{
   logger.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return client.graphql({ query: queries.listDocumentDetails, });
}

/**
 *   Gets All Visible Documents for nonAdmin Users.
 *   @param boxUsers List of Boxes the User Has access to.
 */
export function getAllVisibleDocuments(boxUsers: BoxUserList)
{
   logger.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return client.graphql({
      query: queries.listDocumentDetails,
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
   const filter: ModelDocumentDetailsFilterInput = {
      documentDetailsDocOwnerId: { eq: userId },
   }

   return client.graphql({
      query: queries.listDocumentDetails,
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
   const filter: ModelDocumentDetailsFilterInput = {
      documentDetailsDocOwnerId: { eq: userId },
   };
   const sort = { direction: 'DESC', field: 'updated' };

   const graphql: GraphQLOptions =  {
      query: queries.listDocumentDetails,
      variables: { filter: filter, sort: sort }
   }

   logger.log('Load Recent Docs Query:', graphql);
   return client.graphql(graphql);
}

export function getAllDocumentsForBox(boxId: string) {
   const filter: ModelDocumentDetailsFilterInput = {
      documentDetailsBoxId: { eq: boxId }
   };
   return client.graphql({
                            query: queries.listDocumentDetails,
                            variables: { filter }
                         });
}

export function SearchForDocuments(searchParams: SearchParams,
                                   boxUsers: BoxUserList | null)
{
   const ddfd = DocumentDetailsFieldDefinition;

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
       ModelDocumentDetailsFilterInput =>
{
   const filter: ModelDocumentDetailsFilterInput = {
      or: [ { documentDetailsBoxId: { eq: DefaultBox.id } } ]
   };

   for (const boxUser of boxUsers.items)
   {
      if ( !boxUser || Role.None === boxUser.role ) { continue; }
      filter.or!.push({documentDetailsBoxId: { eq: boxUser.box.id }})
   }
   return filter;
}

export function* handleGetOwnedDocuments(): any
{
   try
   {
      //const amplifyUser = yield getCurrentAmplifyUser();
      const amplifyUser = yield call(getCurrentAmplifyUser);
      const response = yield call(getOwnedDocuments, amplifyUser.username)
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
      logger.log('Found Owned Documents:', response.data.listDocumentDetails);
   }
   catch (error)
   {
      logger.error(error);
      const message = buildError('Failed to GET DocumentList:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.listDocumentDetails;
         yield put(documentListActions.setDocumentsList(attemptDocListFix(list)));
      }
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
      if (response && response.errors && Array.isArray(response.errors) && response.errors.length > 0)
      {
         const msg = getGraphQLErrorMessage(response) || 'Partial errors returned from GraphQL.';
         const alert = buildErrorAlert(`Failed to GET DocumentList: ${msg}`);
         // attempt to fix the returned list by filling missing required fields
         const list = response.data && response.data.listDocumentDetails ?
                                       response.data.listDocumentDetails : { items: [], nextToken: null };
         const fixed = attemptDocListFix(list);
         yield put(documentListActions.setDocumentsList(fixed));
         yield put(alertBarActions.DisplayAlertBox(alert));
      }
      else
      {
         yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
      }
    }
    catch(error)
    {
       logger.error(error);
       const message = buildError('Failed to GET DocumentList:', error);
       yield put(alertBarActions.DisplayAlertBox(message));
       if ( isGraphQLResult(error) )
       {
          const list = (error as GraphQLResult<any>).data.listDocumentDetails;
          yield put(documentListActions.setDocumentsList(attemptDocListFix(list)));
       }
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
         response = yield call(getAllVisibleDocuments, boxUsersResponse.data.listBoxUsers);
      }
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch(error)
   {
      logger.error(error);
      const message = buildError('Failed to GET DocumentList:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.listDocumentDetails;
         yield put(documentListActions.setDocumentsList(attemptDocListFix(list)));
      }
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
   { if ( item?.document ) { dl.items.push(item.document as DocumentDetails); } }
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
         yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
      }
      else
      {
         response = yield call(SearchForDocuments, action.payload, boxUsers);
         yield put(documentListActions.setDocumentsList(searchBandaid(response.data.search)));
      }
      logger.log('Search found:', response);
   }
   catch (error)
   {
      logger.error(error);
      const message = buildError('Failed to GET DocumentList:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
      if ( isGraphQLResult(error) )
      {
         const list  = (error as GraphQLResult<any>).data.search;
         const converted = searchBandaid(list);
         logger.log('Search converted:', converted);
         const fixed = yield call(attemptDocListFix, converted);
         logger.log('Search fixed:', fixed);
         yield put(documentListActions.setDocumentsList(fixed));
      }
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
      yield put(documentListActions.setDocumentsList(searchBandaid(response.data.search)));
   }
   catch (error)
   {
      //logger.error('AdvSearch FAILED!')
      logger.error(error);
      const message = buildError('Advanced Search Failed:', error);
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.search;
         const fixed = yield call(attemptDocListFix, searchBandaid(list));
         yield put(documentListActions.setDocumentsList(fixed));
      }
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

const isGraphQLResult = (error: any): error is GraphQLResult<any> => {
   return (error as GraphQLResult<any>).data !== undefined;
}

const getGraphQLErrorMessage = (error:  any): string | undefined => {
   const err = error as GraphQLResult<any>;
   if ( err.errors !== undefined && 0 !== err.errors.length )
   { return err.errors[0].message; }
   return undefined;
   //return err.errors !== undefined && 0 != err.errors.length;
}

const buildError = (prefix: string, error: any): Alert =>  {
   const message = getGraphQLErrorMessage(error);
   if ( message ) { return buildErrorAlert(`${prefix} ${message}`); }
   return buildErrorAlert(`${prefix} ${JSON.stringify(error)}`);
}

export const attemptDocListFix = (list: ({ items: (DocumentDetails | null)[]; })): DocumentList =>
{
   const copy: DocumentList = { __typename: "DocumentList", ...list, items: [], }
   for (const item of list.items)
   {
      if ( null == item ) { continue; } //skip completely empty rows

      let isFixed = false;
      //check for required fields
      if ( !item.documentDetailsDocOwnerId )
      {
         item.documentDetailsDocOwnerId = DefaultBox.xbiisOwnerId!;
         item.docOwner = DefaultBox.owner!;
         isFixed = true;
      }
      if (!item.documentDetailsAuthorId)
      {
         item.documentDetailsAuthorId = unknownAuthor.id;
         item.author = unknownAuthor;
         isFixed = true;
      }
      if ( !item.documentDetailsBoxId )
      {
         item.documentDetailsBoxId = DefaultBox.id;
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
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildError('Failed to GET Documents for Box:', error);
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