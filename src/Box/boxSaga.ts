import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';

import type { CreateBoxInput, UpdateBoxInput, } from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from '../utils/logger';
import { validateResponse } from '../utils/saga.utilities';

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import type { Alert } from "../AlertBar/AlertBarTypes";
import { buildFriendlyErrorAlert, buildSuccessAlert } from "../AlertBar/AlertBarTypes";

import type { Box } from './boxTypes';
import { BoxPurpose } from './boxTypes';
import { boxActions } from './boxSlice';
import { buildDomainInvariantError } from "../error";
import { printErrorMessage } from '../error';

const client = generateClient();

export function getBoxById(id: string) 
{
  logger.log('Loading box:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({ query: queries.getBox, variables: {id: id} });
}

export const getBoxForUserId = (userId: string) =>
{
  logger.log('Loading User box for user:', userId);

  return client.graphql({ query: queries.listBoxes,
                          variables: {
                            filter: {
                              boxOwnerId: { eq: userId },
                              purpose: { eq: BoxPurpose.USER }
                            }
                          }})

}

export function createBox(box: Box)
{
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not creatable'); }

  const createMe : CreateBoxInput = {
    id:           randomUUID(),
    name:         box.name,
    waa:          box.waa,
    purpose:      box.purpose,
    defaultRole:  box.defaultRole,
    boxOwnerId: box.boxOwnerId
  }

  return client.graphql({
    query: mutations.createBoxGuarded,
    variables: { input: createMe }
  });
}

export function updateBox(box: Box)
{
  const updateMe : UpdateBoxInput = {
    id:           box.id,
    name:         box.name,
    waa:          box.waa,
    purpose:      box.purpose,
    defaultRole:  box.defaultRole,
    boxOwnerId: box.boxOwnerId,
  }

  //ensure name doesn't change for user boxes
  if ( BoxPurpose.USER === box.purpose ) { delete updateMe.name; }
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not editable'); }

  return client.graphql({
    query: mutations.updateBoxGuarded,
    variables: { input: updateMe }
  });
}

export function removeBox(box: Box)
{
  if ( BoxPurpose.USER === box.purpose )
  { throw buildDomainInvariantError('User Boxes cannot be removed'); }
  if ( BoxPurpose.DEFAULT === box.purpose )
  { throw buildDomainInvariantError('Default Box is not removable'); }

  return client.graphql({
      query: mutations.deleteBox,
      variables: { input: { id: box.id } }
  })
}

export function* handleGetBoxById(action: PayloadAction<string>): any
{
  try
  {
    logger.log('handleGetBoxById', action);
    const response = yield call(getBoxById, action.payload);
    const box = validateResponse(response, r => r.data.getBox, 'Box');
    yield put(boxActions.getBoxByIdSuccess(box));
  }
  catch (error)
  {
    logger.error(error);
    yield put(boxActions.getBoxByIdFailure(printErrorMessage(error)));
    const message = buildFriendlyErrorAlert('Failed to GET Box', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBox(action: PayloadAction<Box>): any
{
  let message: Alert | undefined;
  try
  {
    logger.log('handleCreateBox', action);
    const response = yield call(createBox, action.payload);
    const box = validateResponse(response, r => r.data.createBox, 'Box');
    
    yield put(boxActions.createBoxSuccess(box));
    
    // Silent for personal box creation during onboarding
    if ( BoxPurpose.USER !== action.payload.purpose )
    { message = buildSuccessAlert('Box Created'); }
  }
  catch (error)
  {
    logger.error(error);
    yield put(boxActions.createBoxFailure(printErrorMessage(error)));
    message = buildFriendlyErrorAlert('ERROR Creating Box', error);
  }
  if ( message )
  { yield put(alertBarActions.DisplayAlertBox(message)); }
}

export function* handleUpdateBox(action: PayloadAction<Box>): any
{
  let message: Alert;
  try
  {
    logger.log('handleUpdateBox', action);

    const response = yield call(updateBox, action.payload);
    const box = validateResponse(response, r => r.data.updateBox, 'Box');
    yield put(boxActions.updateBoxSuccess(box));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    logger.error(error);
    yield put(boxActions.updateBoxFailure(printErrorMessage(error)));
    message = buildFriendlyErrorAlert('ERROR Updating Box', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveBox(action: PayloadAction<Box>): any
{
  let message: Alert;
  try
  {
    logger.log('handleRemoveBox', action);
    const response = yield call(removeBox, action.payload);
    yield put(boxActions.removeBoxSuccess(action.payload));
    message = buildSuccessAlert('Box Removed.');
  }
  catch (error)
  {
    logger.error(error);
    yield put(boxActions.removeBoxFailure(printErrorMessage(error)));
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