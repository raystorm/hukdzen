import { call, put, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { API } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";

import { authorList } from './authorListType';
import { authorListActions } from './authorListSlice';
import {ListAuthorsQuery} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

export function getAllAuthors() {
  //console.log('Loading all Authors from DynamoDB via Appsync (GraphQL)');
  return API.graphql<GraphQLQuery<ListAuthorsQuery>>({
            query: queries.listAuthors,
         });
}


export function* handleGetAuthorList(action: PayloadAction<authorList, string>): any
{
  try 
  {
    //console.log(`Load AuthorList`);
    const response = yield call(getAllAuthors);
    //console.log(`Authors to Load ${JSON.stringify(response)}`);
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
   yield takeLeading(authorListActions.getAllAuthors.type, handleGetAuthorList);
}