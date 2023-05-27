import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {ListBoxUsersQuery, ListXbiisQuery, ModelBoxUserFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {BoxUserList} from "./BoxUserListType";
import {boxUserListActions} from "./BoxUserListSlice";
import { Gyet, } from "../../User/userType";
import {BoxRole} from "../../BoxRole/BoxRoleType";
import {Xbiis} from "../../Box/boxTypes";
import {getAllBoxRolesForBoxId} from "../../BoxRole/BoxRoleList/BoxRoleListSaga";
import {emptyBoxRoleList} from "../../BoxRole/BoxRoleList/BoxRoleListType";


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

   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxUsersQuery>>({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}

export function getAllBoxUsersForBoxRoleId(id: string)
{
   const filter: ModelBoxUserFilterInput = { boxUserBoxRoleId: { eq: id } };

   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxUsersQuery>>({
      query: queries.listBoxUsers,
      variables: { filter: filter }
   });
}


export function* handleGetBoxUserList(action: PayloadAction<BoxUserList, string>): any
{
  try 
  {
    const response = yield call(getAllBoxUsers);
    console.log(`Boxes to Load ${JSON.stringify(response)}`);
    yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
  }
  catch (error)
  {
     console.log(error);
     const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxUserListForUser(action: PayloadAction<Gyet, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(getAllBoxUsersForUserId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
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
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxUserListForBoxRole(action: PayloadAction<BoxRole, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(getAllBoxUsersForBoxRoleId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
      yield put(boxUserListActions.setAllBoxUsers(response.data.listBoxUsers));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}


export function* handleGetBoxUserListForBoxRoleId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxUsersForBoxRoleId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
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
      const boxResponse = yield call(getAllBoxRolesForBoxId, id);

      const boxes = { ...emptyBoxRoleList };
      for (let br of boxResponse.data.listBoxRoles.items)
      {
         if ( !br ) { continue; }
         const found = yield call(getAllBoxUsersForBoxRoleId, br.id);
         boxes.items.push(found.data.listBoxUsers.items);
      }

      console.log(`Boxes to Load ${JSON.stringify(boxes)}`);
      yield put(boxUserListActions.setAllBoxUsers(boxes));
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
      const boxResponse = yield call(getAllBoxRolesForBoxId, id);

      const boxes = { ...emptyBoxRoleList };
      for (let br of boxResponse.data.listBoxRoles.items)
      {
         if ( !br ) { continue; }
         const found = yield call(getAllBoxUsersForBoxRoleId, br.id);
         boxes.items.push(found.data.listBoxUsers.items);
      }

      console.log(`Boxes to Load ${JSON.stringify(boxes)}`);
      yield put(boxUserListActions.setAllBoxUsers(boxes));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxUsers: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchBoxUserListSaga()
{  //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(boxUserListActions.getAllBoxUsers.type,             handleGetBoxUserList);
   yield takeLeading(boxUserListActions.getAllBoxUsersForUser.type,      handleGetBoxUserListForUser);
   yield takeLeading(boxUserListActions.getAllBoxUsersForUserId.type,    handleGetBoxUserListForUserId);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBoxRole.type,   handleGetBoxUserListForBoxRole);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBoxRoleId.type, handleGetBoxUserListForBoxRoleId);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBox.type,       handleGetBoxUserListForBox);
   yield takeLeading(boxUserListActions.getAllBoxUsersForBoxId.type,     handleGetBoxUserListForBoxId);
}