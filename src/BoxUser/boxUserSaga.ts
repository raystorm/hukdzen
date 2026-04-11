import { call, put, takeEvery, takeLatest, takeLeading, } from 'redux-saga/effects'
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from "uuid";
import { generateClient } from '@aws-amplify/api';

import { AccessLevel, BoxUserInput } from "../graphql/API";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from "../utils/logger";
import { validateResponse } from "../utils/saga.utilities";

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import { Alert, buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";
import { boxUserActions } from "./BoxUserSlice";
import { BoxUser } from "./BoxUserType";
import { uiActions } from "../UI/uiSlice";
import { printErrorMessage } from "../error";

const client = generateClient();

export function getBoxUserById(id: string)
{
  logger.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return client.graphql({ query: queries.getBoxUser, variables: {id: id} });
}

export function createBoxUser(bu: BoxUser)
{
  let id = bu.id ? bu.id : randomUUID();
  const createMe : BoxUserInput = {
    id:     id,
    userId: bu.userUserId,
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
    userId: bu.userUserId,
    boxId:  bu.boxUserBoxId,
    role:   bu.role,
  }
  //owners always have WRITE role, so no need to update it
  if ( bu.userUserId === bu.box.boxOwnerId )
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
    const boxUser = validateResponse(response, r => r.data.getBoxUser, 'BoxUser');
    yield put(boxUserActions.setBoxUser(boxUser));
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
  try
  {
    yield put(uiActions.setProcessing(true));
    
    logger.log('handleCreateBoxUser', action);
    const response = yield call(createBoxUser, action.payload);
    const created = validateResponse(response, r => r.data.createBoxUserGuarded, 'BoxUser');
    yield put(boxUserActions.createBoxUserSuccess(created));
    
    const message = buildSuccessAlert('BoxUser Created');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to create BoxUser', error);
    yield put(boxUserActions.createBoxUserFailure(printErrorMessage(error)));
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleUpdateBoxUser(action: PayloadAction<BoxUser>): any
{
  try
  {
    yield put(uiActions.setProcessing(true));
    
    logger.log('handleUpdateBoxUser', action);
    const boxUser = action.payload;
    const response = yield call(updateBoxUser, boxUser);
    const updated = validateResponse(response, r => r.data.updateBoxUserGuarded, 'BoxUser');
    yield put(boxUserActions.updateBoxUserSuccess(updated));
    
    const message = buildSuccessAlert('BoxUser Updated');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to update BoxUser', error);
    yield put(boxUserActions.updateBoxUserFailure(printErrorMessage(error)));
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleRemoveBoxUser(action: PayloadAction<BoxUser>)
{
  try
  {
    yield put(uiActions.setProcessing(true));
    
    logger.log('handleRemoveBoxUser', action);
    const boxUser = action.payload;

    if ( boxUser.userUserId === boxUser.box.boxOwnerId )
    {
      yield put(boxUserActions.removeBoxUserFailure('Cannot remove owner from box.'));
      const message = buildErrorAlert('Cannot remove owner from box.');
      yield put(alertBarActions.DisplayAlertBox(message));
      return;
    }

    const response = yield call(removeBoxUserbyId, action.payload.id);
    yield put(boxUserActions.removeBoxUserSuccess());
    
    const message = buildSuccessAlert('BoxUser Removed.');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to remove BoxUser', error);
    yield put(boxUserActions.removeBoxUserFailure(printErrorMessage(error)));
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
}

export function* handleRemoveBoxUserById(action: PayloadAction<string>)
{
  try
  {
    yield put(uiActions.setProcessing(true));
    
    logger.log('handleRemoveBoxUser', action);
    const response = yield call(removeBoxUserbyId, action.payload);
    yield put(boxUserActions.removeBoxUserByIdSuccess());
    
    const message = buildSuccessAlert('BoxUser Removed.');
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to remove BoxUser', error);
    yield put(boxUserActions.removeBoxUserByIdFailure(printErrorMessage(error)));
    yield put(alertBarActions.DisplayAlertBox(message));
  }
  finally { yield put(uiActions.setProcessing(false)); }
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