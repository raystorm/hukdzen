import { call, put, takeLatest, } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { generateClient } from '@aws-amplify/api';

import { ModelBoxRequestConnection, ModelBoxRequestFilterInput, BoxRequestStatus } from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

import { buildFriendlyErrorAlert } from "../../AlertBar/AlertBarTypes";
import { alertBarActions } from "../../AlertBar/AlertBarSlice";

import type { User } from "../../User/userType";

import { logger } from '../../utils/logger';
import { validateResponse } from "../../utils/saga.utilities";

import { boxRequestListActions } from './BoxRequestListSlice';
import { BoxRequestList } from "./BoxRequestListType";

const client = generateClient();

export function getPendingBoxRequests()
{
   return client.graphql({
      query: queries.listBoxRequestDetailed,
      variables: { filter: { status: { eq: BoxRequestStatus.PENDING } } }
   });
}

export function getClosedBoxRequests()
{
   const filter: ModelBoxRequestFilterInput = {
      or: [{ status: { eq: BoxRequestStatus.APPROVED } },
           { status: { eq: BoxRequestStatus.DENIED } }]
   };
   return client.graphql({ query: queries.listBoxRequestDetailed, variables: { filter } });
}

export function getPendingBoxRequestsForUserId(userId: string)
{
   const filter: ModelBoxRequestFilterInput = {
      boxRequestCreatedById: { eq: userId },
      status: { eq: BoxRequestStatus.PENDING }
   };
   return client.graphql({ query: queries.listBoxRequestDetailed, variables: { filter } });
}

export function getClosedBoxRequestsForUserId(userId: string)
{
   const filter: ModelBoxRequestFilterInput = {
      boxRequestCreatedById: { eq: userId },
      or: [{ status: { eq: BoxRequestStatus.APPROVED } },
           { status: { eq: BoxRequestStatus.DENIED } }]
   };
   return client.graphql({ query: queries.listBoxRequestDetailed, variables: { filter } });
}

const validateBoxRequestListResponse = (response: any): BoxRequestList =>
{
   const result = validateResponse(response, r => r.data.listBoxRequestDetailed, 'BoxRequestList');
   result.items = result.items?.filter(item => null !== item) || [];
   return result;
};

export function* getPendingBoxRequestsForAdmin()
{
   try
   {
      const response = yield call(getPendingBoxRequests);
      const brl = validateBoxRequestListResponse(response);
      yield put(boxRequestListActions.setAllBoxRequests(brl));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to GET Pending BoxRequests', error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* getClosedBoxRequestsForAdmin()
{
   try
   {
      const response = yield call(getClosedBoxRequests);
      const brl = validateBoxRequestListResponse(response);
      yield put(boxRequestListActions.setAllBoxRequests(brl));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert('Failed to GET Closed BoxRequests', error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetPendingBoxRequestList(action: PayloadAction<User>): any
{
   const user = action.payload;
   if ( user.isAdmin ) { return yield getPendingBoxRequestsForAdmin(); }

   try
   {
      const response = yield call(getPendingBoxRequestsForUserId, user.id);
      const usersBRList = validateBoxRequestListResponse(response);
      yield put(boxRequestListActions.setAllBoxRequests(usersBRList));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert(`Failed to GET Pending BoxRequests`, error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetClosedBoxRequestList(action: PayloadAction<User>): any
{
   const user = action.payload;
   if ( user.isAdmin ) { return yield getClosedBoxRequestsForAdmin(); }

   try
   {
      const response = yield call(getClosedBoxRequestsForUserId, user.id);
      const usersBRList = validateBoxRequestListResponse(response);
      yield put(boxRequestListActions.setAllBoxRequests(usersBRList));
   }
   catch (error)
   {
      logger.error(error);
      const message = buildFriendlyErrorAlert(`Failed to GET Closed BoxRequests`, error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchBoxRequestListSaga()
{
   yield takeLatest(boxRequestListActions.getAllPendingBoxRequests.type,
                    handleGetPendingBoxRequestList);
   yield takeLatest(boxRequestListActions.getAllClosedBoxRequests.type,
                    handleGetClosedBoxRequestList);
}
