import {call, put, takeEvery, takeLatest, takeLeading,} from 'redux-saga/effects'
import { v4 as randomUUID } from "uuid";
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {
  CreateBoxUserInput, CreateBoxUserMutation, DeleteBoxUserMutation,
  GetBoxUserQuery,
  UpdateBoxUserInput, UpdateBoxUserMutation,
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import {AlertBarProps} from "../AlertBar/AlertBarNotifier";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {boxUserActions} from "./BoxUserSlice";
import {BoxUser} from "./BoxUserType";
import {PayloadAction} from "@reduxjs/toolkit";


export function getBoxUserById(id: string)
{
  console.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetBoxUserQuery>>({
    query: queries.getBoxUser,
    variables: {id: id}
  });
}

export function createBoxUser(bu: BoxUser)
{
  let id = bu.id ? bu.id : randomUUID();
  const createMe : CreateBoxUserInput = {
    id:            id,
    boxUserUserId: bu.boxUserUserId,
    boxUserBoxId:  bu.boxUserBoxId,
    role:          bu.role,
  }

  return API.graphql<GraphQLQuery<CreateBoxUserMutation>>({
    query: mutations.createBoxUser,
    variables: { input: createMe }
  });
}


export function updateBoxUser(bu: BoxUser)
{
  const updateMe : UpdateBoxUserInput = {
    id:            bu.id,
    boxUserUserId: bu.boxUserUserId,
    boxUserBoxId:  bu.boxUserBoxId,
    role:          bu.role,
  }

  return API.graphql<GraphQLQuery<UpdateBoxUserMutation>>({
    query: mutations.updateBoxUser,
    variables: { input: updateMe }
  });
}

export function removeBoxUserbyId(id: string)
{
  return API.graphql<GraphQLQuery<DeleteBoxUserMutation>>({
    query: mutations.deleteBoxUser,
    variables: { input: { id: id } }
  })
}

export function* handleGetBoxUserById(action: any): any
{
  try
  {
    console.log(`handleGetBoxUserById ${JSON.stringify(action)}`);
    const response = yield call(getBoxUserById, action.payload);
    //yield put(boxUserActions.setBoxUser(response.data.getBoxUser));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET BoxUser: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBoxUser(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleCreateBoxUser ${JSON.stringify(action)}`);
    const response = yield call(createBoxUser, action.payload);
    //yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Creating BoxUser:\n${JSON.stringify(error)}`);
    //TODO: move out, after fixing alertBar to stack
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleUpdateBoxUser(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleUpdateBoxUser ${JSON.stringify(action)}`);
    const response = yield call(updateBoxUser, action.payload);
    //yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Updating BoxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBoxUser(action: PayloadAction<BoxUser>)
{
  let message: AlertBarProps;
  try {
    console.log(`handleRemoveBoxUser ${JSON.stringify(action)}`);
    const response = yield call(removeBoxUserbyId, action.payload.id);
    message = buildSuccessAlert('BoxUser Removed.');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Error Removing boxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBoxUserById(action: PayloadAction<string>)
{
  let message: AlertBarProps;
  try {
    console.log(`handleRemoveBoxUser ${JSON.stringify(action)}`);
    const response = yield call(removeBoxUserbyId, action.payload);
    message = buildSuccessAlert('BoxUser Removed.');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`Error Removing boxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchBoxUserSaga()
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(boxUserActions.createBoxUser.type,   handleCreateBoxUser);
   yield takeLatest(boxUserActions.getBoxUserById.type,   handleGetBoxUserById);
   yield takeLatest(boxUserActions.updateBoxUser.type,    handleUpdateBoxUser);

   yield takeEvery(boxUserActions.removeBoxUser.type,     handleRemoveBoxUser);
   yield takeEvery(boxUserActions.removeBoxUserById.type, handleRemoveBoxUserById);
}