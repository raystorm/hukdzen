import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios from "axios";

import { gyigyet } from './UserList/userListType';
import { Gyet } from './userType';
import userSlice, { userActions } from './userSlice';
import { getGyiGyetResponse, getAllUsers } from './UserList/userListSaga';

type GyetResponse = { user: Gyet; }

const userListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/userList.json';

export function getUserById(id: string) 
{
  console.log("REST CALL to get User: " + id);
  return axios.get<getGyiGyetResponse>(userListUrl)
              .then(list => list.data.users.find(gyet => gyet.id === id));
}

export function createUser(user: Gyet) 
{
  /* TODO: PUT rest call for update * /
  console.log("REST CALL to get user: " + id);
  return axios.get<getUserListResponse>(docListUrl)
              .then(list => list.data.users.find(u => u.id === id));
  */

  return user;
}

export function updateUser(user: Gyet)
{
  /* TODO: PUT rest call for update * /
  console.log("REST CALL to get user: " + id);
  return axios.get<getUserListResponse>(docListUrl)
              .then(list => list.data.users.find(u => u.id === id));
  */

  /*
  const elder: Gyet; //TODO: get previous version.
  
  */
  return user;
}

//TODO: find correct type for action
export function* handleGetCurrentUser(): any
{
  try 
  {
    console.log(`handleGetCurrentUser`);
    //console.log(`handleGetCurrentUser ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    const response = yield call(getAllUsers);
    const { data } = response;
    yield put(userActions.setSpecifiedUser(data.users[0])); //assume first user for now
  }
  catch (error) { console.log(error); }
}
export function* handleGetUserById(action: any): any
{
  try 
  {
    console.log(`handleGetUserById ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    const response = yield call(getUserById, action.payload);
    //const { data } = response;
    yield put(userActions.setSpecifiedUser(response));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateUser(action: any): any
{
  try 
  {
    console.log(`handleUpdateUser ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    //const response = yield call(getDocumentById, action.payload);
    //const { data } = response;
    yield put(userActions.setSpecifiedUser(action.payload));
  }
  catch (error) { console.log(error); }
}


export function* watchUserSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(userActions.getCurrentUser.type,
                    handleGetCurrentUser);
   yield takeEvery(userActions.getSpecifiedUser.type,
                   handleGetUserById);
   yield takeEvery(userActions.setSpecifiedUser.type,
                   handleUpdateUser);
   yield takeLatest(userActions.setSpecifiedUser.type,
                    handleUpdateUser);
}