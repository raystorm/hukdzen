import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit';
import { API, Amplify } from "aws-amplify";
import { GraphQLQuery } from "@aws-amplify/api";

import { gyigyet } from './userListType';
import { Gyet } from '../userType';
import UserListSlice, { userListActions } from './userListSlice';
import {GetGyetQuery, ListGyetsQuery} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import config from "../../aws-exports";

Amplify.configure(config);


export function getAllUsers() {
  console.log('Loading all users from DynamoDB via Appsync (GraphQL)');
  return API.graphql<GraphQLQuery<ListGyetsQuery>>({
            query: queries.listGyets
         });
}

export function getAllUsersForBoxId(boxId: string)
{
  return API.graphql<GraphQLQuery<ListGyetsQuery>>({
    query: queries.listGyets,
    variables: { filter: { gyetBoxRolesId: { eq: boxId } } }
  });
}


export function* handleGetUserList(action: PayloadAction<gyigyet, string>): any
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
    yield put(userListActions.setAllUsers(response?.data?.listGyets));
  }
  catch (error) { console.log(error); }
}

export function* watchUserListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(userListActions.getAllUsers.type,         handleGetUserList);
   yield takeLeading(userListActions.getAllUsersForBoxId.type, handleGetUserList);
}