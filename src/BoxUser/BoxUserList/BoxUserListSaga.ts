import { call, put, race, take, takeEvery, takeLeading } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from "@aws-amplify/api";

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {
   DeleteBoxUserMutationVariables, BoxUserFilterInput,
   ModelBoxUserFilterInput, ListBoxUsersQueryVariables
} from "../../graphql/API";

import { logger } from '../../utils/logger';
import { validateResponseList } from "../../utils/saga.utilities";
import { printErrorMessage } from "../../error";

import { Alert, buildFriendlyErrorAlert } from "../../AlertBar/AlertBarTypes";
import { buildErrorAlert, buildSuccessAlert } from "../../AlertBar/AlertBarTypes";
import { alertBarActions } from "../../AlertBar/AlertBarSlice";
import type { BoxUserList } from "./BoxUserListType";
import { boxUserListActions } from "./BoxUserListSlice";
import type { User } from "../../User/userType";
import type { Xbiis } from "../../Box/boxTypes";
import { boxUserActions } from "../BoxUserSlice";
import { BoxList } from "../../Box/BoxList/BoxListType";

const client = generateClient();

export function getAllBoxUsers()
{ return client.graphql({ query: queries.listBoxUsers, }); }

export function getAllBoxUsersForUserId(id: string)
{
   const filter: BoxUserFilterInput = { boxUserUserId: { eq: id } };

   logger.log('Loading All boxUsers for user:', id);
   return client.graphql({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}

export function getAllBoxUsersForUserIdAndBoxList(id: string, boxes: BoxList)
{
   const filter: ModelBoxUserFilterInput = { boxUserUserId: { eq: id } };
   if ( 0 < boxes.items.length )
   {
      const boxFilters = boxes.items.map( box => ( { boxUserBoxId: { eq: box?.id } } ) );
      if ( 0 < boxFilters.length ) { filter.or = boxFilters; }
   }

   logger.log("FILTER SENT TO APPSYNC(User and BoxList):", JSON.stringify(filter, null, 2));
   return client.graphql({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}

export function getAllBoxUsersForBoxId(id: string)
{
   const filter: BoxUserFilterInput = { boxUserBoxId: { eq: id } };
   //const buFilter: BoxUserFilterInput = { filter: filter };
   const vars: ListBoxUsersQueryVariables = { filter: filter };

   logger.log('Loading All boxUsers for boxId:', id);
   logger.log("FILTER SENT TO APPSYNC(boxId):", JSON.stringify(filter, null, 2));
   return client.graphql({
      query: queries.listBoxUsers,
      variables: vars,
   });
}

export function removeBoxUser(id: string)
{
   const selector: DeleteBoxUserMutationVariables = { input: { id: id } };

   logger.log('Removing All BoxUser listings for user:', id);
   return client.graphql({
                            query: mutations.deleteBoxUser,
                            variables: selector,
                         });
}

/*
export const removeAllBoxUsersForUserId = (id: string) => {
   const filter: ModelBoxUserFilterInput = { boxUserUserId: { eq: id } };

   console.log('Removing All BoxUser listings for user:', id`);
   return client.graphql({
      query: mutations.deleteBoxUser,
      variables: { input: filter }
   })
}

export const removeAllBoxUsersForBoxId = (id: string) => {
   const filter: ModelBoxUserFilterInput = { boxUserBoxId: { eq: id } };

   console.log('Removing All BoxUser listings for user:', id);
   return client.graphql({
      query: mutations.deleteBoxUser,
      variables: { input: filter }
   })
}
*/

const validateBoxUserListResponse = <L extends { items: (any | null)[] | null }>
                                    (response: any, selector: (r: any) => L) =>
{ return validateResponseList<L>(response, selector, 'BoxUsersList'); }


export function* handleGetBoxUserList(action: PayloadAction<BoxUserList, string>): any
{
  try 
  {
    const response = yield call(getAllBoxUsers);
    logger.log('BoxUsers to Load', response);
    const boxUsersList = validateBoxUserListResponse(response,
                                                     r => r.data.listBoxUsers)
    yield put(boxUserListActions.setAllBoxUsers(boxUsersList));
  }
  catch (error)
  {
     logger.error(error);
     const message = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',  error);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxUserListForUser(action: PayloadAction<User, string>): any
{
   const idAction = boxUserListActions.getAllBoxUsersForUserId(action.payload.id);
   yield* handleGetBoxUserListForUserId(idAction);
}

export function* handleGetBoxUserListForUserId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxUsersForUserId, id);
      logger.log('BoxUsers to Load', response);
      const boxUsersList = validateBoxUserListResponse(response,
                                                       r => r.data.listBoxUsers)
      yield put(boxUserListActions.setAllBoxUsers(boxUsersList));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',  error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxUserListForBox(action: PayloadAction<Xbiis, string>): any
{
   const idAction = boxUserListActions.getAllBoxUsersForBoxId(action.payload.id);
   yield* handleGetBoxUserListForBoxId(idAction);
}

export function* handleGetBoxUserListForBoxId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxUsersForBoxId, id);

      logger.log('BoxUsers to Load from BoxId', response);
      const boxUsersList = validateBoxUserListResponse(response,
                                                       r => r.data.listBoxUsers)
      yield put(boxUserListActions.setAllBoxUsers(boxUsersList));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',  error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForUser(action: PayloadAction<User, string>): any
{
   const id = action.payload.id;
   const remove = boxUserListActions.removeAllBoxUsersForUserId(id);
   yield* handleRemoveBoxUserListForUserId(remove);
}

export function* handleRemoveBoxUserListForUserId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const boxUsers = yield call(getAllBoxUsersForUserId, id);
      const boxUsersList = validateBoxUserListResponse(boxUsers,
                                                       r => r.data.listBoxUsers);

      for (const boxUser of boxUsersList.items )
      { yield call(removeBoxUser, boxUser.id); }
      
      yield put(boxUserListActions.removeAllBoxUsersForUserIdSuccess());
   }
   catch (error)
   {
      logger.error(error);
      yield put(boxUserListActions.removeAllBoxUsersForUserIdFailure(printErrorMessage(error)));
      const message = buildFriendlyErrorAlert('Failed to Remove List of BoxUsers',  error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForBox(action: PayloadAction<Xbiis, string>): any
{
   const id = action.payload.id;
   const remove = boxUserListActions.removeAllBoxUsersForBoxId(id);
   yield* handleRemoveBoxUserListForBoxId(remove);
}

export function* handleRemoveBoxUserListForBoxId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const boxUsers = yield call(getAllBoxUsersForBoxId, id);
      const boxUsersList = validateBoxUserListResponse(boxUsers,
                                                       r => r.data.listBoxUsers);

      for (const boxUser of boxUsersList.items ) { yield call(removeBoxUser, boxUser.id); }
      //const response = yield call(removeAllBoxUsersForBoxId, id);
      //yield put(boxUserListActions.setAllBoxUsers(response.data.deleteBoxUser));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to Remove List of BoxUsers',  error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleUpdateAllBoxUsersForUser(action: PayloadAction<BoxUserList, string>): any
{
   let message: Alert;
   try
   {
      logger.log('handleUpdateAllBoxUsersForUser - start');
      const id = action.payload.items[0]?.user?.id;
      if ( !id ) { return; }
      
      // Dispatch remove and wait for completion
      yield put(boxUserListActions.removeAllBoxUsersForUserId(id));
      
      const removeResult = yield race({
         success: take(boxUserListActions.removeAllBoxUsersForUserIdSuccess.type),
         failure: take(boxUserListActions.removeAllBoxUsersForUserIdFailure.type),
      });
      
      if (removeResult.failure)
      {
         message = buildErrorAlert('Failed to remove existing BoxUsers');
         yield put(alertBarActions.DisplayAlertBox(message));
         return;
      }
      
      logger.log('handleUpdateAllBoxUsersForUser - removed users, now creating');
      
      // Now safe to create
      for(let bu of action.payload.items )
      {
         if ( !bu ) { continue; }
         yield put(boxUserActions.createBoxUser(bu));
      }
      
      message = buildSuccessAlert('BoxUserList updated');
      logger.log(message.message);
   }
   catch (error)
   {
      logger.log(error);
      const message = buildFriendlyErrorAlert('Failed to UPDATE List of BoxUsers:', error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchBoxUserListSaga()
{  //findAll, findMostRecent, findOwned
   yield takeLeading(boxUserListActions.getAllBoxUsers.type,             handleGetBoxUserList);
   yield takeLeading(boxUserListActions.getAllBoxUsersForUser.type,      handleGetBoxUserListForUser);
   yield takeLeading(boxUserListActions.getAllBoxUsersForUserId.type,    handleGetBoxUserListForUserId);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBox.type,       handleGetBoxUserListForBox);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBoxId.type,     handleGetBoxUserListForBoxId);

   yield takeEvery(boxUserListActions.removeAllBoxUsersForUser.type,     handleRemoveBoxUserListForUser);
   yield takeEvery(boxUserListActions.removeAllBoxUsersForUserId.type,   handleRemoveBoxUserListForUserId);
   yield takeEvery(boxUserListActions.removeAllBoxUsersForBox.type,      handleRemoveBoxUserListForBox);
   yield takeEvery(boxUserListActions.removeAllBoxUsersForBoxId.type,    handleRemoveBoxUserListForBoxId);

   yield takeLeading(boxUserListActions.updateAllBoxUsersForUser.type,   handleUpdateAllBoxUsersForUser);
}