import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { ActionCreatorWithPayload, bindActionCreators, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from "axios";
import BoxListSlice, { boxListActions } from './BoxListSlice';
import { Xbiis } from '../boxTypes';
import { BoxList } from './BoxListType';

export type getBoxListResponse = { boxes: Xbiis[]; }

//TODO: make a userListJSON file.
const userListUrl = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/boxList.json';


export function getAllBoxes()
{
   console.log("load all users via REST.");
   return axios.get<getBoxListResponse>(userListUrl);   
}


export function* handleGetBoxList(action: PayloadAction<BoxList, string>): any
{
  try 
  {
    let response = null;
    //TODO: correctly type this
    let getter: any; //() => Promise<AxiosResponse<getDocListResponse, any>>; 
    switch(action.type)
    {
      case boxListActions.getAllBoxes.type:
        getter = getAllBoxes;
        break;
      default:
        getter = getAllBoxes;
    }
    console.log(`Load BoxList via ${getter.toString()}`);
    response = yield call(getter, action.payload);
    //@ts-ignore
    const { data } = response;
    console.log(`Boxes to Load ${JSON.stringify(data)}`);
    yield put(boxListActions.setAllBoxes(data));
  }
  catch (error) { console.log(error); }
}

export function* watchBoxListSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLeading(boxListActions.getAllBoxes.type, handleGetBoxList);
}