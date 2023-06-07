import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { API, Amplify } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

import { userList } from './userListType';
import { User } from '../userType';
import UserListSlice, { userListActions } from './userListSlice';
import {GetUserQuery, ListUsersQuery} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import config from "../../aws-exports";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";

Amplify.configure(config);


export function getAllUsers() {
  console.log('Loading all users from DynamoDB via Appsync (GraphQL)');
  return API.graphql<GraphQLQuery<ListUsersQuery>>({
            query: queries.listUsers
         });
}

export function getAllUsersForBoxId(boxId: string)
{
  return API.graphql<GraphQLQuery<ListUsersQuery>>({
    query: queries.listUsers,
    variables: { filter: { gyetBoxRolesId: { eq: boxId } } }
  });
}


export function* handleGetUserList(action: PayloadAction<userList, string>): any
{
  try 
  {
    let response = null;
    //TODO: correctly type this
    let getter: any;
    switch(action.type)
    {
      case userListActions.getAllUsers.type:
        getter = getAllUsers;
        break;
      case userListActions.getAllUsersForBoxId.type:
        getter = getAllUsersForBoxId;
        break;
      default:
        getter = getAllUsers;
    }
    console.log(`Load UserList via ${getter.toString()}`);
    response = yield call(getter, action.payload);
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
   yield takeLeading(userListActions.getAllUsers.type,         handleGetUserList);
   yield takeLeading(userListActions.getAllUsersForBoxId.type, handleGetUserList);
}