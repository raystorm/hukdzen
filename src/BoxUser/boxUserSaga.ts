import { call, put, takeEvery, takeLatest, takeLeading, } from 'redux-saga/effects'
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from "uuid";
import { generateClient } from '@aws-amplify/api';

import { AccessLevel, BoxUserInput } from "../graphql/API";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from "../utils/logger";

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import { Alert, buildErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";
import { boxUserActions } from "./BoxUserSlice";
import { BoxUser } from "./BoxUserType";

const client = generateClient();

export function getBoxUserById(id: string)
{
  logger.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return client.graphql({ query: queries.getBoxUserDetailed, variables: {id: id} });
}

export function createBoxUser(bu: BoxUser)
{
  let id = bu.id ? bu.id : randomUUID();
  const createMe : BoxUserInput = {
    id:     id,
    userId: bu.boxUserUserId,
    boxId:  bu.boxUserBoxId,
    role:   bu.role,
  }

  return client.graphql({
    query: mutations.createBoxUserGuarded,
    variables: { input: createMe }
  });
}


export function updateBoxUser(bu: BoxUser)
{
  const updateMe : BoxUserInput = {
    id:     bu.id,
    userId: bu.boxUserUserId,
    boxId:  bu.boxUserBoxId,
    role:   bu.role,
  }
  //owners always have WRITE role, so no need to update it
  if ( bu.boxUserUserId === bu.box.xbiisOwnerId )
  { updateMe.role = AccessLevel.WRITE; }

  return client.graphql({
    query: mutations.updateBoxUserGuarded,
    variables: { input: updateMe }
  });
}

export function removeBoxUserbyId(id: string)
{
  return client.graphql({
    query: mutations.deleteBoxUser,
    variables: { input: { id: id } }
  })
}

export function* handleGetBoxUserById(action: PayloadAction<string>): any
{
  try
  {
    logger.log('handleGetBoxUserById', action);
    const response = yield call(getBoxUserById, action.payload);
    //yield put(boxUserActions.setBoxUser(response.data.getBoxUser));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildErrorAlert(`Failed to GET BoxUser: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBoxUser(action: PayloadAction<BoxUser>): any
{
  let message: Alert;
  try
  {
    logger.log('handleCreateBoxUser', action);
    const response = yield call(createBoxUser, action.payload);
    //yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Created');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`ERROR Creating BoxUser:\n${JSON.stringify(error)}`);
    //TODO: move out, after fixing alertBar to stack
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleUpdateBoxUser(action: PayloadAction<BoxUser>): any
{
  let message: Alert;
  try
  {
    logger.log('handleUpdateBoxUser', action);

    const boxUser = action.payload;
    const response = yield call(updateBoxUser, boxUser);
    //yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Updated');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`ERROR Updating BoxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBoxUser(action: PayloadAction<BoxUser>)
{
  let message: Alert;
  try
  {
    logger.log('handleRemoveBoxUser', action);

    const boxUser = action.payload;

    if ( boxUser.boxUserUserId === boxUser.box.xbiisOwnerId )
    {
      message = buildErrorAlert('Cannot remove owner from box.');
      yield put(alertBarActions.DisplayAlertBox(message));
      return;
    }

    const response = yield call(removeBoxUserbyId, action.payload.id);
    message = buildSuccessAlert('BoxUser Removed.');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Error Removing boxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBoxUserById(action: PayloadAction<string>)
{
  let message: Alert;
  try
  {
    logger.log('handleRemoveBoxUser', action);
    const response = yield call(removeBoxUserbyId, action.payload);
    message = buildSuccessAlert('BoxUser Removed.');
  }
  catch (error)
  {
    logger.error(error);
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