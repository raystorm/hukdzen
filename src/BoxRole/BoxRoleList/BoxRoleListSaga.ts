import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {AccessLevel, ListBoxRolesQuery, ListXbiisQuery, ModelBoxRoleFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {BoxRoleList} from "./BoxRoleListType";
import {boxRoleListActions} from "./BoxRoleListSlice";
import { Gyet, emptyGyet} from "../../User/userType";


export function getAllBoxRoles()
{
   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxRolesQuery>>({
     query: queries.listBoxRoles,
   });
}

export function getAllBoxRolesForBoxId(id: string)
{
   const filter: ModelBoxRoleFilterInput = { boxRoleBoxId: { eq: id } };

   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxRolesQuery>>({
      query: queries.listBoxRoles,
      variables: { filter: filter }
   });
}

export function getAllBoxRolesForRoleId(role: AccessLevel)
{
   const filter: ModelBoxRoleFilterInput = { role: { eq: role } };

   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListBoxRolesQuery>>({
      query: queries.listBoxRoles,
      variables: { filter: filter }
   });
}


export function* handleGetBoxRoleList(action: PayloadAction<BoxRoleList, string>): any
{
  try 
  {
    const response = yield call(getAllBoxRoles);
    console.log(`Boxes to Load ${JSON.stringify(response)}`);
    yield put(boxRoleListActions.setAllBoxRoles(response.data.listBoxRoles));
  }
  catch (error)
  {
     console.log(error);
     const message = buildErrorAlert(`Failed to GET List of BoxRoles: ${JSON.stringify(error)}`);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxRoleListForBox(action: PayloadAction<Gyet, string>): any
{
   try
   {
      const id = action.payload.id;
      const response = yield call(getAllBoxRolesForBoxId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
      yield put(boxRoleListActions.setAllBoxRoles(response.data.listBoxRoles));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxRoles: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxRoleListForBoxId(action: PayloadAction<string, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxRolesForBoxId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
      yield put(boxRoleListActions.setAllBoxRoles(response.data.listBoxRoles));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxRoles: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetBoxRoleListForRole(action: PayloadAction<AccessLevel, string>): any
{
   try
   {
      const id = action.payload;
      const response = yield call(getAllBoxRolesForRoleId, id);
      console.log(`Boxes to Load ${JSON.stringify(response)}`);
      yield put(boxRoleListActions.setAllBoxRoles(response.data.listBoxRoles));
   }
   catch (error)
   {
      console.log(error);
      const message = buildErrorAlert(`Failed to GET List of BoxRoles: ${JSON.stringify(error)}`);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchBoxRoleListSaga()
{  //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(boxRoleListActions.getAllBoxRoles.type,         handleGetBoxRoleList);
   yield takeLeading(boxRoleListActions.getAllBoxRolesForBox.type,   handleGetBoxRoleListForBox);
   yield takeLeading(boxRoleListActions.getAllBoxRolesForBoxId.type, handleGetBoxRoleListForBoxId);
   yield takeLeading(boxRoleListActions.getAllBoxRolesForRole.type,  handleGetBoxRoleListForRole);
}