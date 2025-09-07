import { call, put, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { generateClient } from '@aws-amplify/api';

import { isDev } from '../../components/shared/location';

  import { userList } from './userListType';
import { userListActions } from './userListSlice';
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";

const client = generateClient();

export function getAllUsers() {
  if ( isDev() )
  { console.log('Loading all users from DynamoDB via Appsync (GraphQL)'); }
  return client.graphql({ query: queries.listUsers });
}


export function* handleGetAllUsers(action: PayloadAction<userList, string>): any
{
  try 
  {
    let response = null;
    if ( isDev() ) { console.log(`handleGetAllUsers`); }
    response = yield call(getAllUsers);
    if ( isDev() )
    { console.log(`Users to Load ${JSON.stringify(response)}`); }
    //@ts-ignore
    yield put(userListActions.setAllUsers(response?.data?.listUsers));
  }
  catch (error)
  {
    console.error(error);
    const message = buildErrorAlert(`Failed to GET ALL Users: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* watchUserListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLeading(userListActions.getAllUsers.type, handleGetAllUsers);
}