import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import BoxListSlice, { boxListActions } from './BoxListSlice';
import { Xbiis } from '../boxTypes';
import { BoxList } from './BoxListType';
import { ListXbiisQuery } from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";


export function getAllBoxes()
{
   console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListXbiisQuery>>({
     query: queries.listXbiis,
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
     console.log(error);
     const message = buildErrorAlert(`Failed to GET List of Boxes: ${JSON.stringify(error)}`);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* watchBoxListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(boxListActions.getAllBoxes.type, handleGetBoxList);
}