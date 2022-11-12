import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from "axios";
import { gyigyet } from './userListType';
import { Gyet } from '../userType';
import UserListSlice, { userListActions } from './userListSlice';

export type getGyiGyetResponse = { users: Gyet[]; }

//TODO: make a userListJSON file.
const userListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/userList.json';


export function getAllUsers()
{
   console.log("load all users via REST.");
   return axios.get<getGyiGyetResponse>(userListUrl);   
}

export function getAllUsersForBoxId(boxId: string)
{
  return getAllUsers(); //TODO implement lookup
}


export function* handleGetUserList(action: PayloadAction<gyigyet, string>): any
{
  try 
  {
    let response = null;
    //TODO: correctly type this
    let getter: any; //() => Promise<AxiosResponse<getDocListResponse, any>>; 
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
    const { data } = response;
    console.log(`Users to Load ${JSON.stringify(data)}`);
    yield put(userListActions.setAllUsers(data));
  }
  catch (error) { console.log(error); }
}

export function* watchUserListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(userListActions.getAllUsers.type, handleGetUserList);
   yield takeLeading(userListActions.getAllUsersForBoxId.type, handleGetUserList);
}