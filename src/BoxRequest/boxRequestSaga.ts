import { call, put, takeLatest, select } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from 'uuid';
import { generateClient } from '@aws-amplify/api';

import { AccessLevel, BoxInput, BoxPurpose } from "../graphql/API";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { logger } from '../utils/logger';
import { printErrorMessage } from '../error';

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import type { Alert } from "../AlertBar/AlertBarTypes";
import { buildFriendlyErrorAlert, buildSuccessAlert, buildWarningAlert } from "../AlertBar/AlertBarTypes";
import { validateResponse, validateResponseList } from '../utils/saga.utilities';


import type { User } from '../User/userType';

import type { BoxRequest, BoxRequestInput } from "./boxRequestType";
import { BoxRequestStatus } from "./boxRequestType";
import { boxRequestActions } from './boxRequestSlice';
import { uiActions } from "../UI/uiSlice";
import { emptyBox, Box } from "../Box/boxTypes";
import { createBox } from "../Box/boxSaga";

import { getAdminUsers, getAllUsers } from '../User/UserList/userListSaga';
import { emptyFilter } from "../types";


const client = generateClient();

export function getBoxRequestById(id: string)
{
  logger.log('Loading boxRequest:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({ query: queries.getBoxRequest, variables: {id: id} });
}

export function createBoxRequest(br: BoxRequest)
{
  const createMe : BoxRequestInput = {
    id:              randomUUID(),
    requestedName:   br.requestedName,
    requestReason:   br.requestReason,
    //ALL new requests start as pending
    status:          BoxRequestStatus.PENDING,
    createdByUserId: br.boxRequestCreatedById!,
  }

  return client.graphql({
    query: mutations.createBoxRequestGuarded,
    variables: { input: createMe }
  });
}

export function updateBoxRequest(br: BoxRequest)
{
  //createdby, approvedBy, and status are not updatable,
  // only in dedicated functions
  const updateMe : BoxRequestInput = {
    id:              br.id,
    requestedName:   br.requestedName,
    requestReason:   br.requestReason,
    createdByUserId: br.boxRequestCreatedById!,
    status:          BoxRequestStatus.PENDING, //assuming pending
  }

  return client.graphql({
    query: mutations.updateBoxRequestGuarded,
    variables: { input: updateMe }
  });
}

export function approveBoxRequest(br: BoxRequest)
{
  //createdby, and denial are not editable here
  // only in dedicated functions
  const updateMe : BoxRequestInput = {
    id:               br.id,
    requestedName:    br.requestedName,
    requestReason:    br.requestReason,
    createdByUserId:  br.boxRequestCreatedById!,
    status:           BoxRequestStatus.APPROVED,
    approvedByUserId: br.boxRequestApprovedById,
    createdBoxId:     br.boxRequestCreatedBoxId ?? br.createdBox?.id,
    createdBoxId:     br.boxRequestCreatedBoxId ?? br.createdBox?.id,
  }

  return client.graphql({
    query: mutations.updateBoxRequestGuarded,
    variables: { input: updateMe }
  });
}

export function denyBoxRequest(br: BoxRequest)
{
  //createdby is not editable here
  // only in dedicated function
  const updateMe : BoxRequestInput = {
    id:               br.id,
    requestedName:    br.requestedName,
    requestReason:    br.requestReason,
    createdByUserId:  br.boxRequestCreatedById!,
    approvedByUserId: br.boxRequestApprovedById,
    status:           BoxRequestStatus.DENIED,
    denialReason:     br.denialReason,
  }

  return client.graphql({
    query: mutations.updateBoxRequestGuarded,
    variables: { input: updateMe }
  });
}

export function sendTemplatedEmail(to: string[],
                                   templateName: string, templateArgs: object,
                                   cc?: string[], globalParams?: object)
{
  return client.graphql({
    query: mutations.sendTemplatedEmail,
    variables: {
      to,
      cc,
      templateName,
      templateArgs: JSON.stringify(templateArgs),
      globalParams: globalParams ? JSON.stringify(globalParams) : undefined
    }
  });
}

export function* sendBoxRequestSubmittedNotification(boxRequest: BoxRequest): any
{
  const response = yield call(getAdminUsers);
  const admins: User[] = validateResponseList(response, r => r.data.listUsers, 'Admin Users').items;
  logger.log('admins', admins);

  const adminEmails = admins.map(admin => admin.email).filter(email => email);

  if ( 0 === adminEmails.length )
  {
     logger.warn('No admin email addresses found - skipping notification');
     yield put(alertBarActions.DisplayAlertBox(
        buildWarningAlert('BoxRequest created but no admin emails found for notification')
     ));
     return;
  }

  const firstAdmin = admins.find(admin => admin.email);
  if (firstAdmin && firstAdmin.email)
  {
     yield call(sendTemplatedEmail, [firstAdmin.email], 'BOX_REQUEST_SUBMITTED',
                {
                   requesterName:    boxRequest.createdBy.name,
                   boxName:          boxRequest.requestedName,
                   reason:           boxRequest.requestReason,
                   requestListUrl:   `${window.location.origin}/box/request/list`,
                   requestDetailUrl: `${window.location.origin}/box/request/${boxRequest.id}`
                },
                undefined,
                { userId: firstAdmin.id, email: firstAdmin.email });
  }
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
             },
             undefined,
             { userId: boxRequest.createdBy.id, email: boxRequest.createdBy.email });
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
                denialReason:  boxRequest.denialReason
             },
             undefined,
             { userId: boxRequest.createdBy.id, email: boxRequest.createdBy.email });
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
    yield put(boxRequestActions.getBoxRequestByIdSuccess(boxRequest));
  }
  catch (error)
  {
    yield put(boxRequestActions.getBoxRequestByIdFailure(printErrorMessage(error)));
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
    const boxRequest = action.payload;
    const isAdmin = boxRequest.createdBy?.isAdmin;

    // Create the request record
    const response = yield call(createBoxRequest, boxRequest);
    const createdRequest = validateBoxRequestResponse(response, r => r.data.createBoxRequestGuarded);

    // If admin, auto-approve and create box immediately
    if ( isAdmin )
    {
      logger.log('Admin request detected - auto-approving');
      yield put(uiActions.setProcessing(true));

      const requestedBox: Box =
      {
         ...emptyBox,
         name:        createdRequest.requestedName,
         purpose:     BoxPurpose.GROUP,
         defaultRole: AccessLevel.NONE,
         owner:       createdRequest.createdBy,
         boxOwnerId:  createdRequest.boxRequestCreatedById,
      };
      const boxResponse = yield call(createBox, requestedBox);
      const box = validateResponse(boxResponse, r => r.data.createBoxGuarded, 'Box');

      const approvedRequest: BoxRequest =
      {
        ...createdRequest,
        status: BoxRequestStatus.APPROVED,
        createdBox: box,
        boxRequestCreatedBoxId: box.id,
        boxRequestApprovedById: createdRequest.boxRequestCreatedById,
      };
      const approvalResponse = yield call(approveBoxRequest, approvedRequest);
      const approved = validateBoxRequestResponse(approvalResponse, r => r.data.updateBoxRequestGuarded);
      yield put(boxRequestActions.createBoxRequestSuccess(approved));
      yield put(uiActions.setProcessing(false));

      message = buildSuccessAlert(`Box "${box.name}" created successfully! [View Box](/box/${box.id})`,
                                   `Box ID: ${box.id}`);
    }
    else
    {
      // Non-admin: send notification to admins
      yield put(boxRequestActions.createBoxRequestSuccess(createdRequest));

      try { yield call(sendBoxRequestSubmittedNotification, createdRequest); }
      catch (error)
      {
        logger.error('Failed to send email notification:', error);
        yield put(alertBarActions.DisplayAlertBox(
           buildFriendlyErrorAlert('BoxRequest created but admin notification failed', error)
        ));
      }

      message = buildSuccessAlert('BoxRequest Created');
    }
  }
  catch (error)
  {
    yield put(boxRequestActions.createBoxRequestFailure(printErrorMessage(error)));
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
    const boxRequest = validateBoxRequestResponse(response, r => r.data.updateBoxRequestGuarded);
    yield put(boxRequestActions.updateBoxRequestSuccess(boxRequest));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    yield put(boxRequestActions.updateBoxRequestFailure(printErrorMessage(error)));
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

    const requestedBox: Box = {
      ...emptyBox,
      name:         boxRequest.requestedName,
      purpose:      BoxPurpose.GROUP,
      defaultRole:  AccessLevel.NONE,
      owner:        boxRequest.createdBy!,
      boxOwnerId: boxRequest.boxRequestCreatedById!,
    }
    const boxResponse = yield call(createBox, requestedBox)
    const box = validateResponse(boxResponse, r => r.data.createBox, 'Box');

    //set the new box on the request for tracking
    const approvedRequest = { ...boxRequest, status: BoxRequestStatus.APPROVED,
                              createdBox: box, boxRequestCreatedBoxId: box.id, };

    const response = yield call(approveBoxRequest, approvedRequest);
    const approved = validateBoxRequestResponse(response, r => r.data.updateBoxRequestGuarded);
    yield put(boxRequestActions.approveBoxRequestSuccess(approved));

    try { yield call(sendBoxRequestApprovedNotification, approved); }
    catch (error) { logger.error('Failed to send email notification:', error); }

    message = buildSuccessAlert(`Box **${box.name}** approved! [View Box](/box/${box.id})`);
  }
  catch (error)
  {
    yield put(boxRequestActions.approveBoxRequestFailure(printErrorMessage(error)));
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
    const boxRequest = validateBoxRequestResponse(response, r => r.data.updateBoxRequestGuarded);
    yield put(boxRequestActions.denyBoxRequestSuccess(boxRequest));

    try { yield call(sendBoxRequestDeniedNotification, boxRequest); }
    catch (error) { logger.error('Failed to send email notification:', error); }

    message = buildSuccessAlert('Box Denied');
  }
  catch (error)
  {
    yield put(boxRequestActions.denyBoxRequestFailure(printErrorMessage(error)));
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