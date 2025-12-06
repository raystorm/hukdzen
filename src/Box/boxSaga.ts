import { call, put, takeLatest } from 'redux-saga/effects'
import {PayloadAction} from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';

import { CreateXbiisInput, UpdateXbiisInput, } from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import {isDev, isDevLocation} from "../utils/location";

import {AlertBarProps} from "../AlertBar/AlertBarNotifier";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";

import { Xbiis } from './boxTypes';
import { boxActions } from './boxSlice';

const client = generateClient();

export function getBoxById(id: string) 
{
  if ( isDev() )
  { console.log('Loading box:', id, 'from DynamoDB via Appsync (GraphQL)'); }
  return client.graphql({ query: queries.getXbiis, variables: {id: id} });
}

export function createBox(box: Xbiis)
{
  const createMe : CreateXbiisInput = {
    id:           randomUUID(),
    name:         box.name,
    waa:          box.waa,
    defaultRole:  box.defaultRole,
    xbiisOwnerId: box.xbiisOwnerId
  }

  return client.graphql({
    query: mutations.createXbiis,
    variables: { input: createMe }
  });
}

export function updateBox(box: Xbiis)
{
  const updateMe : UpdateXbiisInput = {
    id:           box.id,
    name:         box.name,
    waa:          box.waa,
    defaultRole:  box.defaultRole,
    xbiisOwnerId: box.xbiisOwnerId,
  }

  return client.graphql({
    query: mutations.updateXbiis,
    variables: { input: updateMe }
  });
}

export function removeBoxById(id: string)
{
  return client.graphql({
      query: mutations.deleteXbiis,
      variables: { input: { id: id } }
  })
}

export function* handleGetBoxById(action: PayloadAction<string>): any
{
  try
  {
    if ( isDev() ) { console.log('handleGetBoxById', action); }
    const response = yield call(getBoxById, action.payload);
    yield put(boxActions.setBox(response.data.getXbiis));
  }
  catch (error)
  {
    console.error(error);
    const message = buildErrorAlert(`Failed to GET Box: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBox(action: PayloadAction<Xbiis>): any
{
  let message: AlertBarProps;
  try
  {
    if ( isDev() ) { console.log('handleCreateBox', action); }
    const response = yield call(createBox, action.payload);
    yield put(boxActions.setBox(response));
    message = buildSuccessAlert('Box Created');
  }
  catch (error)
  {
    console.error(error);
    message = buildErrorAlert(`ERROR Creating Box: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBox(action: PayloadAction<Xbiis>): any
{
  let message: AlertBarProps;
  try
  {
    if ( isDev() ) { console.log('handleUpdateBox', action); }
    const response = yield call(updateBox, action.payload);
    yield put(boxActions.setBox(response));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    console.error(error);
    message = buildErrorAlert(`ERROR Updating Box: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBox(action: PayloadAction<Xbiis>): any
{
  let message: AlertBarProps;
  try
  {
    if ( isDev() ) { console.log('handleRemoveBox', action); }
    const response = yield call(removeBoxById, action.payload.id);
    message = buildSuccessAlert('Box Removed.');
  }
  catch (error)
  {
    console.error(error);
    message = buildErrorAlert(`ERROR Removing Box: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* watchBoxSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(boxActions.createBox.type,  handleCreateBox);
   yield takeLatest(boxActions.getBoxById.type, handleGetBoxById);
   yield takeLatest(boxActions.updateBox.type,  handleUpdateBox);

   yield takeLatest(boxActions.removeBox.type,  handleRemoveBox);
}