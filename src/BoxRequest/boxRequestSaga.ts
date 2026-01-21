import { call, put, takeLatest } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';

import { AccessLevel, BoxPurpose, CreateBoxRequestInput, UpdateBoxRequestInput, } from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from '../utils/logger';

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import type { Alert } from "../AlertBar/AlertBarTypes";
import { buildFriendlyErrorAlert, buildSuccessAlert, buildWarningAlert } from "../AlertBar/AlertBarTypes";
import { validateResponse } from '../utils/saga.utilities';

import type { User } from '../User/userType';

import type { BoxRequest } from "./boxRequestType";
import { BoxRequestStatus } from "./boxRequestType";
import { boxRequestActions } from './boxRequestSlice';
import { uiActions } from "../UI/uiSlice";
import { emptyXbiis, Xbiis } from "../Box/boxTypes";
import { createBox } from "../Box/boxSaga";

import { getAdminUsers } from '../User/UserList/userListSaga';
import { emptyFilter } from "../types";


const client = generateClient();

export function getBoxRequestById(id: string)
{
  logger.log('Loading boxRequest:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({ query: queries.getBoxRequest, variables: {id: id} });
}

/*
 export type CreateBoxRequestInput = {
 id?: string | null,
 requestedName: string,
 requestReason?: string | null,
 status: BoxRequestStatus,
 denialReason?: string | null,
 boxRequestCreatedById: string,
 boxRequestApprovedById?: string | null,
 boxRequestCreatedBoxId?: string | null,
 };
 */

export function createBoxRequest(br: BoxRequest)
{
  const createMe : CreateBoxRequestInput = {
    id:                    randomUUID(),
    requestedName:         br.requestedName,
    requestReason:         br.requestReason,
    //ALL new requests start as pending
    status:                BoxRequestStatus.PENDING,
    boxRequestCreatedById: br.boxRequestCreatedById,
  }

  return client.graphql({
    query: mutations.createBoxRequest,
    variables: { input: createMe }
  });
}

export function updateBoxRequest(br: BoxRequest)
{
  //createdby, approvedBy, and status are not updatable,
  // only in dedicated functions
  const updateMe : UpdateBoxRequestInput = {
    id:                     br.id,
    requestedName:          br.requestedName,
    requestReason:          br.requestReason,
    denialReason:           br.denialReason,
  }

  return client.graphql({
    query: mutations.updateBoxRequest,
    variables: { input: updateMe }
  });
}

export function approveBoxRequest(br: BoxRequest)
{
  //createdby, and denial are not editable here
  // only in dedicated functions
  const updateMe : UpdateBoxRequestInput = {
    id:                     br.id,
    requestedName:          br.requestedName,
    boxRequestApprovedById: br.boxRequestApprovedById,
    status:                 BoxRequestStatus.APPROVED,
    boxRequestCreatedBoxId: br.boxRequestCreatedBoxId,
  }

  return client.graphql({
    query: mutations.updateBoxRequest,
    variables: { input: updateMe }
  });
}

export function denyBoxRequest(br: BoxRequest)
{
  //createdby is not editable here
  // only in dedicated function
  const updateMe : UpdateBoxRequestInput = {
    id:                     br.id,
    requestedName:          br.requestedName,
    boxRequestApprovedById: br.boxRequestApprovedById,
    status:                 BoxRequestStatus.DENIED,
    denialReason:           br.denialReason,
  }

  return client.graphql({
    query: mutations.updateBoxRequest,
    variables: { input: updateMe }
  });
}

export function sendTemplatedEmail(to: string[], templateName: string, templateArgs: object, cc?: string[])
{
  return client.graphql({
    query: mutations.sendTemplatedEmail,
    variables: {
      to,
      cc,
      templateName,
      templateArgs: JSON.stringify(templateArgs)
    }
  });
}

export function* sendBoxRequestSubmittedNotification(boxRequest: BoxRequest): any
{
  const response = yield call(getAdminUsers);
  const admins = validateResponse<User[]>(response, r => r.data.listUsers.items, 'Admin Users');
  const adminEmails = admins.map(admin => admin.email).filter(emptyFilter);

  if ( 0 === adminEmails.length )
  {
     logger.warn('No admin email addresses found - skipping notification');
     yield put(alertBarActions.DisplayAlertBox(
        buildWarningAlert('BoxRequest created but no admin emails found for notification')
     ));
     return;
  }

  yield call(sendTemplatedEmail, adminEmails, 'BOX_REQUEST_SUBMITTED',
             {
                requesterName:    boxRequest.createdBy.name,
                boxName:          boxRequest.requestedName,
                reason:           boxRequest.requestReason,
                requestListUrl:   `${window.location.origin}/box/request/list`,
                requestDetailUrl: `${window.location.origin}/box/request/${boxRequest.id}`
             });
}

export function* sendBoxRequestApprovedNotification(boxRequest: BoxRequest): any
{
  if ( !boxRequest.createdBy?.email )
  {
     logger.warn('No requester email found - skipping notification');
     return;
  }

  yield call(sendTemplatedEmail, [boxRequest.createdBy.email], 'BOX_REQUEST_APPROVED',
             {
                requesterName: boxRequest.createdBy.name,
                boxName:       boxRequest.requestedName,
                boxUrl:        `${window.location.origin}/box/${boxRequest.boxRequestCreatedBoxId}`
             });
}

export function* sendBoxRequestDeniedNotification(boxRequest: BoxRequest): any
{
  if ( !boxRequest.createdBy?.email )
  {
     logger.warn('No requester email found - skipping notification');
     return;
  }

  yield call(sendTemplatedEmail, [boxRequest.createdBy.email], 'BOX_REQUEST_DENIED',
             {
                requesterName: boxRequest.createdBy.name,
                boxName:       boxRequest.requestedName,
                reason:        boxRequest.denialReason
             });
}


export const validateBoxRequestResponse = <T>(response: any, selector: (r: any) => T): T =>
{ return validateResponse<T>(response, selector, 'BoxRequest'); }

export function* handleGetBoxRequestById(action: PayloadAction<string>): any
{
  try
  {
    logger.log('handleGetBoxRequestById', action);
    const response = yield call(getBoxRequestById, action.payload);
    const boxRequest = validateBoxRequestResponse(response, r => r.data.getBoxRequest);
    yield put(boxRequestActions.setBoxRequest(boxRequest));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildFriendlyErrorAlert('Failed to GET BoxRequest', error);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBoxRequest(action: PayloadAction<BoxRequest>): any
{
  let message: Alert;
  try
  {
    logger.log('handleCreateBoxRequest', action);
    const response = yield call(createBoxRequest, action.payload);
    const boxRequest = validateBoxRequestResponse(response, r => r.data.createBoxRequest);
    yield put(boxRequestActions.setBoxRequest(boxRequest));

    try { yield call(sendBoxRequestSubmittedNotification, boxRequest); }
    catch (error)
    {
      logger.error('Failed to send email notification:', error);
      yield put(alertBarActions.DisplayAlertBox(
         buildFriendlyErrorAlert('BoxRequest created but admin notification failed', error)
      ));
    }
    
    message = buildSuccessAlert('BoxRequest Created');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Creating BoxRequest', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBoxRequest(action: PayloadAction<BoxRequest>): any
{
  let message: Alert;
  try
  {
    logger.log('handleUpdateBoxRequest', action);
    const response = yield call(updateBoxRequest, action.payload);
    const boxRequest = validateBoxRequestResponse(response, r => r.data.updateBoxRequest);
    yield put(boxRequestActions.setBoxRequest(boxRequest));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Updating BoxRequest', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleApproveBoxRequest(action: PayloadAction<BoxRequest>): any
{
  let message: Alert;
  try
  {
    logger.log('handleApproveBoxRequest', action);

    yield put(uiActions.setProcessing(true));

    const boxRequest = action.payload;

    const requestedBox: Xbiis = {
      ...emptyXbiis,
      name:         boxRequest.requestedName,
      purpose:      BoxPurpose.GROUP,
      defaultRole:  AccessLevel.NONE,
      owner:        boxRequest.createdBy,
      xbiisOwnerId: boxRequest.boxRequestCreatedById,
    }
    const boxResponse = yield call(createBox, requestedBox)
    const box = validateResponse(boxResponse, r => r.data.createXbiis, 'Box');

    //set the new box on the request for tracking
    const approvedRequest = { ...boxRequest, status: BoxRequestStatus.APPROVED,
                              createdBox: box, boxRequestCreatedBoxId: box.id, };

    const response = yield call(approveBoxRequest, approvedRequest);
    const approved = validateBoxRequestResponse(response, r => r.data.updateBoxRequest);
    yield put(boxRequestActions.setBoxRequest(approved));

    try { yield call(sendBoxRequestApprovedNotification, approved); }
    catch (error) { logger.error('Failed to send email notification:', error); }

    message = buildSuccessAlert('Box Approved');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Updating BoxRequest', error);
  }
  finally { yield put(uiActions.setProcessing(false)); }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleDenyBoxRequest(action: PayloadAction<BoxRequest>): any
{
  let message: Alert;
  try
  {
    logger.log('handleDenyBoxRequest', action);

    const response = yield call(denyBoxRequest, action.payload);
    const boxRequest = validateBoxRequestResponse(response, r => r.data.updateBoxRequest);
    yield put(boxRequestActions.setBoxRequest(boxRequest));

    try { yield call(sendBoxRequestDeniedNotification, boxRequest); }
    catch (error) { logger.error('Failed to send email notification:', error); }

    message = buildSuccessAlert('Box Denied');
  }
  catch (error)
  {
    logger.error(error);
    message = buildFriendlyErrorAlert('ERROR Updating BoxRequest', error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* watchBoxRequestSaga()
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(boxRequestActions.getBoxRequestById.type, handleGetBoxRequestById);
   yield takeLatest(boxRequestActions.createBoxRequest.type,  handleCreateBoxRequest);
   yield takeLatest(boxRequestActions.updateBoxRequest.type,  handleUpdateBoxRequest);

   yield takeLatest(boxRequestActions.approveBoxRequest.type, handleApproveBoxRequest);
   yield takeLatest(boxRequestActions.denyBoxRequest.type,    handleDenyBoxRequest);
}