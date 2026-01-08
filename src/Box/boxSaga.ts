import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';

import type { CreateXbiisInput, UpdateXbiisInput, } from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from '../utils/logger';

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import type { Alert } from "../AlertBar/AlertBarTypes";
import { buildFriendlyErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";

import type { Xbiis } from './boxTypes';
import { BoxPurpose } from './boxTypes';
import { boxActions } from './boxSlice';
import { buildDomainInvariantError, buildInvalidGraphQLError } from "../error";

const client = generateClient();

export function getBoxById(id: string) 
{
  logger.log('Loading box:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({ query: queries.getXbiis, variables: {id: id} });
}

export const getUserBoxFor = (userId: string) =>
{
  logger.log('Loading User box for user:', userId);

  return client.graphql({ query: queries.listXbiis,
                          variables: {
                            filter: {
                              xbiisOwnerId: { eq: userId },
                              purpose: { eq: BoxPurpose.USER }
                            }
                          }})

}

export function createBox(box: Xbiis)
{
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not creatable'); }

  const createMe : CreateXbiisInput = {
    id:           randomUUID(),
    name:         box.name,
    waa:          box.waa,
    purpose:      box.purpose,
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
    purpose:      box.purpose,
    defaultRole:  box.defaultRole,
    xbiisOwnerId: box.xbiisOwnerId,
  }

  //ensure name doesn't change for user boxes
  if ( BoxPurpose.USER === box.purpose ) { delete updateMe.name; }
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not editable'); }

  return client.graphql({
    query: mutations.updateXbiis,
    variables: { input: updateMe }
  });
}

export function removeBox(box: Xbiis)
{
  if ( BoxPurpose.USER === box.purpose )
  { throw buildDomainInvariantError('User Boxes cannot be removed'); }
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not removable'); }

  return client.graphql({
      query: mutations.deleteXbiis,
      variables: { input: { id: box.id } }
  })
}

export function* handleGetBoxById(action: PayloadAction<string>): any
{
  try
  {
    logger.log('handleGetBoxById', action);
    const response = yield call(getBoxById, action.payload);
    const box = response?.data?.getXbiis;
    if ( !box )
    { throw buildInvalidGraphQLError('getXbiis from AWS missing.'); }
    yield put(boxActions.setBox(box));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to GET Box', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBox(action: PayloadAction<Xbiis>): any
{
  let message: Alert;
  try
  {
    logger.log('handleCreateBox', action);
    const response = yield call(createBox, action.payload);
    const box = response?.data?.createXbiis;
    if ( !box )
    { throw buildInvalidGraphQLError('createXbiis from AWS missing.'); }
    yield put(boxActions.setBox(box));
    message = buildSuccessAlert('Box Created');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Creating Box', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBox(action: PayloadAction<Xbiis>): any
{
  let message: Alert;
  try
  {
    logger.log('handleUpdateBox', action);

    const response = yield call(updateBox, action.payload);
    const box = response?.data?.updateXbiis;
    if ( !box )
    { throw buildInvalidGraphQLError('updateXbiis from AWS missing.'); }
    yield put(boxActions.setBox(box));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Updating Box', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBox(action: PayloadAction<Xbiis>): any
{
  let message: Alert;
  try
  {
    logger.log('handleRemoveBox', action);
    const response = yield call(removeBox, action.payload);
    message = buildSuccessAlert('Box Removed.');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Removing Box', error);
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