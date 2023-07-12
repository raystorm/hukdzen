import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {ListBoxUsersQuery, DeleteBoxUserMutation, ListXbiisQuery, ModelBoxUserFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import {buildErrorAlert, buildSuccessAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {BoxUserList} from "./BoxUserListType";
import {boxUserListActions} from "./BoxUserListSlice";
import { User, } from "../../User/userType";
import {Xbiis} from "../../Box/boxTypes";
import {createBoxUser} from "../boxUserSaga";
import {AlertBarProps} from "../../AlertBar/AlertBar";


export function getAllBoxUsers()
{
   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxUsersQuery>>({
     query: queries.listBoxUsers,
   });
}

export function getAllBoxUsersForUserId(id: string)
{
   const filter: ModelBoxUserFilterInput = { boxUserUserId: { eq: id } };

   console.log(`Loading All boxUsers for user: ${id}`);
   return API.graphql<GraphQLQuery<ListBoxUsersQuery>>({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}

export function getAllBoxUsersForBoxId(id: string)
{
   const filter: ModelBoxUserFilterInput = { boxUserBoxId: { eq: id } };

   console.log(`Loading All boxUsers for boxId: ${id}`);
   return API.graphql<GraphQLQuery<ListBoxUsersQuery>>({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}

export const removeAllBoxUsersForUserId = (id: string) => {
   const filter: ModelBoxUserFilterInput = { boxUserUserId: { eq: id } };

   console.log(`Removing All BoxUser listings for user: ${id}`);
   return API.graphql<GraphQLQuery<DeleteBoxUserMutation>>({
      query: mutations.deleteBoxUser,
      variables: { input: filter }
   })
}

export const removeAllBoxUsersForBoxId = (id: string) => {
   const filter: ModelBoxUserFilterInput = { boxUserBoxId: { eq: id } };

   console.log(`Removing All BoxUser listings for user: ${id}`);
   return API.graphql<GraphQLQuery<DeleteBoxUserMutation>>({
      query: mutations.deleteBoxUser,
      variables: { input: filter }
   })
}


export function* handleGetBoxUserList(action: PayloadAction<BoxUserList, string>): any
{
  try 
  {
    const response = yield call(getAllBoxUsers);
    console.log(`BoxUsers to Load ${JSON.stringify(response)}`);
    yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
  }
  catch (error)
  {
     console.log(error);
     const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxUserListForUser(action: PayloadAction<User, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(getAllBoxUsersForUserId, id);
      console.log(`BoxUsers to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxUserListForUserId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxUsersForUserId, id);
      console.log(`BoxUsers to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxUserListForBox(action: PayloadAction<Xbiis, string>): any
{
   try
   {
      const id = action.payload.id;
      const boxResponse = yield call(getAllBoxUsersForBoxId, id);

      console.log(`BoxUsers to Load ${JSON.stringify(boxResponse.data.listBoxUsers)}`);
      yield put(boxUserListActions.setAllBoxUsers(boxResponse.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxUserListForBoxId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const boxResponse = yield call(getAllBoxUsersForBoxId, id);

      console.log(`BoxUsers to Load ${JSON.stringify(boxResponse.data.listBoxUsers)}`);
      yield put(boxUserListActions.setAllBoxUsers(boxResponse.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForUser(action: PayloadAction<User, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(removeAllBoxUsersForUserId, id);
      console.log(`BoxUsers to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForUserId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(removeAllBoxUsersForUserId, id);
      console.log(`BoxUsers to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForBox(action: PayloadAction<Xbiis, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(removeAllBoxUsersForBoxId, id);
      yield put(boxUserListActions.setAllBoxUsers(response.data.deleteBoxUser));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleRemoveBoxUserListForBoxId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(removeAllBoxUsersForBoxId, id);
      yield put(boxUserListActions.setAllBoxUsers(response.data.deleteBoxUser));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleUpdateAllBoxUsersForUser(action: PayloadAction<BoxUserList, string>): any
{
   let message: AlertBarProps;
   try
   {
      const id = action.payload.items[0]?.id; //assume all 1 user.
      if ( !id ) { return; } //empty, nothing to do.
      const removed = yield call(removeAllBoxUsersForUserId, id);
      for(let bu of action.payload.items )
      {
         if ( !bu ) { continue; }
         yield call(createBoxUser, bu);
      }
      message = buildSuccessAlert('BoxUserList updated');
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to UPDATE List of BoxUsers: ${JSON.stringify(error)}`);
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
   yield takeEvery(boxUserListActions.removeAllBoxUsersForBox.type,      handleRemoveBoxUserListForBoxId);
   yield takeEvery(boxUserListActions.removeAllBoxUsersForBoxId.type,    handleRemoveBoxUserListForBoxId);

   yield takeLeading(boxUserListActions.updateAllBoxUsersForUser.type,   handleUpdateAllBoxUsersForUser);
}