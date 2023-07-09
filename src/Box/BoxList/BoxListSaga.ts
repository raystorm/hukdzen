import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';
import {Amplify, API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import config from "../../aws-exports";

import BoxListSlice, { boxListActions } from './BoxListSlice';
import { Xbiis } from '../boxTypes';
import { BoxList } from './BoxListType';
import {ListXbiisQuery, ModelBoxUserFilterInput, ModelXbiisFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";

Amplify.configure(config);

export function getAllBoxes()
{
   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListXbiisQuery>>({
     query: queries.listXbiis,
   });
}

export function getAllOwnedBoxesForUserId(userId: string)
{
   console.log(`Loading All boxes owned by: ${userId}`);

   const filter: ModelXbiisFilterInput = { xbiisOwnerId: { eq: userId } };

   return API.graphql<GraphQLQuery<ListXbiisQuery>>({
      query: queries.listXbiis,
      variables: { filter: filter },
   });
}

export function* handleGetBoxList(action: PayloadAction<BoxList, string>): any
{
  try 
  { //@ts-ignore
    const response = yield call(getAllBoxes, action.payload);
    console.log(`Boxes to Load ${JSON.stringify(response)}`);
    yield put(boxListActions.setAllBoxes(response.data.listXbiis));
  }
  catch (error)
  {
     const msg = `Failed to GET List of Boxes: ${JSON.stringify(error)}`;
     console.log(msg);
     // console.trace(); //stack trace for debug
     const message = buildErrorAlert(msg);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* watchBoxListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLeading(boxListActions.getAllBoxes.type, handleGetBoxList);
}