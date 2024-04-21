import {call, put, takeLeading} from 'redux-saga/effects'
import {PayloadAction} from '@reduxjs/toolkit';

import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {GraphQLOptions, GraphQLResult} from "@aws-amplify/api-graphql";

import {
   ListDocumentDetailsQuery, ModelDocumentDetailsConnection,
   ModelDocumentDetailsFilterInput, SearchableDocumentDetailsConnection,
   SearchableDocumentDetailsFilterInput,
   SearchableDocumentDetailsSortInput,
   SearchableSortDirection,
   SearchDocumentDetailsQuery, SearchDocumentDetailsQueryVariables
} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

import {documentListActions} from './documentListSlice';
import {DocumentDetails} from '../DocumentTypes';
import {getCurrentAmplifyUser} from "../../User/userSaga";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {SearchParams, sortDirection} from "./documentListTypes";
import {DocumentDetailsFieldDefinition} from "../../types/fieldDefitions";
import {BoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {DefaultRole, Role} from "../../Role/roleTypes";
import {DefaultBox} from "../../Box/boxTypes";
import {getAllBoxUsersForUserId} from "../../BoxUser/BoxUserList/BoxUserListSaga";
import {appSelect} from "../../app/hooks";
import {buildBoxUser} from "../../BoxUser/BoxUserType";
import {User} from "../../User/userType";
import {AlertBarProps} from "../../AlertBar/AlertBarNotifier";
import {unknownAuthor} from "../../Author/AuthorType";
import {updateDocument} from "../documentSaga";

//TODO: Doc security

export function getAllDocuments()
{
   console.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
      query: queries.listDocumentDetails,
   });
}

/**
 *   Gets All Visible Documents for nonAdmin Users.
 *   @param boxUsers List of Boxes the User Has access to.
 */
export function getAllVisibleDocuments(boxUsers: BoxUserList)
{
   console.log(`Loading All documents from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
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

   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>({
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

   console.log(`Load Recent Docs Query: ${JSON.stringify(graphql, null, 2)}`);
   return API.graphql<GraphQLQuery<ListDocumentDetailsQuery>>(graphql);
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
   let sortDir = SearchableSortDirection.asc;
   if ( sortDirection.DESC === searchParams.sortDirection)
   { sortDir = SearchableSortDirection.desc; }

   const sortField = searchParams.sortField ?? ddfd.created.name;

   const sorter: SearchableDocumentDetailsSortInput =
   { direction: sortDir, field: sortField as any }

   //TODO: implement pageable later
   const page = searchParams.page;
   const resultsPerPage = searchParams.resultsPerPage;

   let filter: SearchableDocumentDetailsFilterInput = {[field]: {match: keyword}};
   if ( boxUsers )
   { filter = { and: [ filter, buildBoxListFilterForBoxUsers(boxUsers)]}; }

   return API.graphql<GraphQLQuery<SearchDocumentDetailsQuery>>({
      query:     queries.searchDocumentDetails,
      variables: { filter: filter, sort: sorter }
   });
}

export function AdvancedSearch(query: SearchDocumentDetailsQueryVariables,
                               boxUsers: BoxUserList | null)
{
   return API.graphql<GraphQLQuery<SearchDocumentDetailsQuery>>({
      query:     queries.searchDocumentDetails,
      variables: query,
   });
}

/*
 *  TODO: Add UserBoxList Filter generator here.
 */

export const buildBoxListFilterForBoxUsers = (boxUsers: BoxUserList):
       ModelDocumentDetailsFilterInput | SearchableDocumentDetailsFilterInput =>
{
   const filter: ModelDocumentDetailsFilterInput | SearchableDocumentDetailsFilterInput = {
      or: [ { documentDetailsBoxId: { eq: DefaultBox.id } } ]
   };

   //if ( 0 < boxUsers.items.length ) { filter.or = [] }
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
      const amplifyUser = yield getCurrentAmplifyUser();
      const response = yield call(getOwnedDocuments, amplifyUser.username)
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
      console.log(`Found Owned Documents: ${JSON.stringify(response.data.listDocumentDetails)}`);
   }
   catch (error)
   {
      console.log(error);
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
      const amplifyUser = yield getCurrentAmplifyUser();
      const response = yield call(getRecentDocuments, amplifyUser.username)
      console.log(`found recent docs: ${JSON.stringify(response)}`);
      yield put(documentListActions.setDocumentsList(response.data.listDocumentDetails));
   }
   catch(error)
   {
      console.log(error);
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
      console.log(error);
      const message = buildError('Failed to GET DocumentList:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.listDocumentDetails;
         yield put(documentListActions.setDocumentsList(attemptDocListFix(list)));
      }
   }
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
         console.log(`getting all Allowed Documents for: ${JSON.stringify(boxUsers)}`);
         response = yield call(getAllVisibleDocuments, boxUsers);
      }
      else { response = yield call(SearchForDocuments, action.payload, boxUsers); }
      console.log(`Search found: ${JSON.stringify(response)}`);
      yield put(documentListActions.setDocumentsList(response.data.searchDocumentDetails));
   }
   catch (error)
   {
      console.log(error);
      const message = buildError('Failed to GET DocumentList:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.searchDocumentDetails;
         const fixed = yield call(attemptSearchFix, list);
         yield put(documentListActions.setDocumentsList(fixed));
      }
   }
}

export function* handleAdvancedSearch(action: PayloadAction<SearchDocumentDetailsQueryVariables, string>): any
{
   try
   {
      const query: SearchDocumentDetailsQueryVariables = {
         ...action.payload,
         filter: { ...action.payload.filter },
      };
      if ( action.payload.sort && 0 < action.payload.sort.length )
      { query.sort = [ ...action.payload.sort ]; }
      if ( action.payload.aggregates && 0 < action.payload.aggregates.length )
      { query.aggregates = [ ...action.payload.aggregates ]; }
      const currentUser: User = yield appSelect(state => state.currentUser);
      const isAdmin = currentUser.isAdmin;
      let boxUsers: BoxUserList | null = null;
      if ( !isAdmin )
      {
         const buResponse = yield call(getAllBoxUsersForUserId, currentUser.id);
         boxUsers = buResponse.data.listBoxUsers;
         if ( boxUsers )
         {
            let filter = query.filter ?? {};
            console.log(`filter search for Allowed Documents: ${JSON.stringify(boxUsers)}`);
            query.filter = {and: [filter, buildBoxListFilterForBoxUsers(boxUsers)]};
         }
      }
      let response = yield call(AdvancedSearch, query, boxUsers);
      console.log(`Search found: ${JSON.stringify(response)}`);
      yield put(documentListActions.setDocumentsList(response.data.searchDocumentDetails));
   }
   catch (error)
   {
      console.log(error);
      const message = buildError('Advanced Search Failed:', error);
      if ( isGraphQLResult(error) )
      {
         const list = (error as GraphQLResult<any>).data.searchDocumentDetails;
         const fixed = yield call(attemptSearchFix, list);
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

const buildError = (prefix: string, error: any): AlertBarProps =>  {
   const message = getGraphQLErrorMessage(error);
   if ( message ) { return buildErrorAlert(`${prefix} ${message}`); }
   return buildErrorAlert(`${prefix} ${JSON.stringify(error)}`);
}

export const attemptDocListFix = (list: ModelDocumentDetailsConnection): ModelDocumentDetailsConnection => {
   const copy: ModelDocumentDetailsConnection = { ...list, items: [], }
   for (const item of list.items)
   {
      if ( null == item ) { continue; } //skip completely empty rows

      let isFixed = false;
      //check for required fields
      if ( !item.documentDetailsDocOwnerId )
      {
         item.documentDetailsDocOwnerId = DefaultBox.xbiisOwnerId;
         item.docOwner = DefaultBox.owner;
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

//expose for testing
export function attemptSearchFix(list: SearchableDocumentDetailsConnection)
{
   const copy: SearchableDocumentDetailsConnection = { ...list, items: [], }
   for (const item of list.items)
   {
      if ( null == item ) { continue; } //skip completely empty rows

      let isFixed = false;
      //check for required fields
      if ( !item.documentDetailsDocOwnerId )
      {
         item.documentDetailsDocOwnerId = DefaultBox.xbiisOwnerId;
         item.docOwner = DefaultBox.owner;
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
      //if ( isFixed ) { call(updateDocument, item); }
   }
   return copy;
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
   yield takeLeading(documentListActions.advancedSearch.type,
                     handleAdvancedSearch);
}