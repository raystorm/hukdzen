import { call, put, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { API } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

import { userList } from './userListType';
import { userListActions } from './userListSlice';
import {ListUsersQuery} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";

export function getAllUsers() {
  console.log('Loading all users from DynamoDB via Appsync (GraphQL)');
  return API.graphql<GraphQLQuery<ListUsersQuery>>({
            query: queries.listUsers
         });
}


export function* handleGetAllUsers(action: PayloadAction<userList, string>): any
{
  try 
  {
    let response = null;
    console.log(`handleGetAllUsers`);
    response = yield call(getAllUsers);
    console.log(`Users to Load ${JSON.stringify(response)}`);
    //@ts-ignore
    yield put(userListActions.setAllUsers(response?.data?.listUsers));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET ALL Users: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* watchUserListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLeading(userListActions.getAllUsers.type, handleGetAllUsers);
}