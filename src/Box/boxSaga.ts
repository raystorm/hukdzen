import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import axios from "axios";

import { Xbiis } from './boxTypes';
import boxSlice, { boxActions } from './boxSlice';
import { 
  getBoxListResponse as getBoxListResponse, 
  getAllBoxes 
} from './BoxList/boxListSaga';

type XbiisResponse = { box: Xbiis; }

const userListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/boxList.json';

export function getBoxById(id: string) 
{
  console.log("REST CALL to get Box: " + id);
  return axios.get<getBoxListResponse>(userListUrl)
              .then(list => list.data.boxes.find(gyet => gyet.id === id));
}

export function createBox(user: Xbiis) 
{
  /* TODO: PUT rest call for update * /
  console.log("REST CALL to get user: " + id);
  return axios.get<getUserListResponse>(docListUrl)
              .then(list => list.data.users.find(u => u.id === id));
  */

  return user;
}

export function updateBox(user: Xbiis)
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

export function* handleGetBox(action: any): any
{
  try 
  {
    console.log(`handleGetBox ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    //const response = yield call(getUserById, action.payload);
    //const { data } = response;
    yield put(boxActions.setSpecifiedBox(action.payload));
  }
  catch (error) { console.log(error); }
}

export function* handleGetBoxById(action: any): any
{
  try 
  {
    console.log(`handleGetBoxById ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    const response = yield call(getBoxById, action.payload);
    //const { data } = response;
    yield put(boxActions.setSpecifiedBox(response));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateBox(action: any): any
{
  try 
  {
    console.log(`handleUpdateBox ${JSON.stringify(action)}`);
    //const response = yield call<DocumentDetails>(getDocumentById, action.payload);
    //const response = yield call(getDocumentById, action.payload);
    //const { data } = response;
    yield put(boxActions.setSpecifiedBox(action.payload));
  }
  catch (error) { console.log(error); }
}


export function* watchUserSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   //yield takeEvery(currentUserActions.setCurrentBox.type,
   //                handleGetUserById);
   yield takeLatest(boxActions.getSpecifiedBox.type,
                    handleGetBox);
   yield takeLatest(boxActions.getSpecifiedBoxById.type,
                    handleGetBoxById);
   //yield takeLatest(userActions.setSpecifiedBox.type,
   //                 handleUpdateUser);
}