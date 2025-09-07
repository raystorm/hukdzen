import {call, put, takeEvery, takeLeading} from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';

import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";

import { authorList } from './authorListType';
import { authorListActions } from './authorListSlice';
import * as queries from "../../graphql/queries";

const client = generateClient();

export function getAllAuthors() {
  //console.log('Loading all Authors from DynamoDB via Appsync (GraphQL)');
  return client.graphql({ query: queries.listAuthors, });
}


export function* handleGetAuthorList(action: PayloadAction<authorList, string>): any
{
  try 
  {
    //console.log(`Load AuthorList`);
    const response = yield call(getAllAuthors);
    console.log(`Authors to Load ${JSON.stringify(response)}`);
    //@ts-ignore
    yield put(authorListActions.setAllAuthors(response?.data?.listAuthors));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET ALL Authors: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* watchAuthorListSaga()
{
   // findAll, findMostRecent, findOwned
   yield takeEvery(authorListActions.getAllAuthors.type, handleGetAuthorList);
}