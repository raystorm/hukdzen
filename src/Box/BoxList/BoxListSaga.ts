import {call, put, takeLatest, } from 'redux-saga/effects'
import {PayloadAction} from "@reduxjs/toolkit";
import { generateClient } from '@aws-amplify/api';

import {ModelXbiisFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

import { isDev } from "../../components/shared/location";
import {boxListActions} from './BoxListSlice';
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {getAllBoxUsersForUserId} from "../../BoxUser/BoxUserList/BoxUserListSaga";
import {User} from "../../User/userType";
import {Role} from "../../Role/roleTypes";
import {BoxList, emptyBoxList} from "./BoxListType";

const client = generateClient();

export function getAllBoxes()
{
   //if ( isDev() )
   //{ console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`); }
   return client.graphql({ query: queries.listXbiis, });
}

export function getAllOwnedBoxesForUserId(userId: string)
{
   const filter: ModelXbiisFilterInput = { xbiisOwnerId: { eq: userId } };

   return client.graphql({
      query: queries.listXbiis,
      variables: { filter: filter },
   });
}

export function* handleGetBoxList(): any
{
  try 
  {
    const response = yield call(getAllBoxes);
    //if ( isDev() ) { console.log(`Boxes to Load ${JSON.stringify(response)}`); }
    yield put(boxListActions.setAllBoxes(response.data.listXbiis));
  }
  catch (error)
  {
     const msg = `Failed to GET List of Boxes: ${JSON.stringify(error)}`;
     console.error(msg);
     //if ( isDev() ) { console.trace(); } //stack trace for debug
     const message = buildErrorAlert(msg);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetWritableBoxList(action: PayloadAction<User>)
{
   try
   {
      const user = action.payload;
      //if ( isDev() )
      //{ console.log(`handleGetWritableBoxList for ${JSON.stringify(user)}`); }
      let boxes: BoxList;
      if ( !user.isAdmin )
      {
         //if ( isDev() )
         //{ console.log(`filtering writable Boxes for user: ${user.id}`); }
         const buResponse = yield call(getAllBoxUsersForUserId, user.id);
         boxes = { ...emptyBoxList, items: [] };
         //if ( isDev() )
         //{ console.log(`BoxUsers Found: ${JSON.stringify(buResponse)}`); }
         for (let bu of buResponse.data.listBoxUsers.items)
         { if (bu.role === Role.Write) { boxes.items.push(bu.box); } }
      }
      else
      {
         //console.error('getting ALL boxes.');
         const response = yield call(getAllBoxes);
         boxes = response.data.listXbiis;
      }
      //if ( isDev() )
      //{ console.log(`Writable Boxes to Load ${JSON.stringify(boxes)}`); }
      yield put(boxListActions.setAllBoxes(boxes));
   }
   catch (error)
   {
      const msg = `Failed to GET List of Boxes: ${JSON.stringify(error)}`;
      console.error(msg, error);
      //if ( isDev() ) { console.trace(); } //stack trace for debug
      const message = buildErrorAlert(msg);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* watchBoxListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(boxListActions.getAllBoxes.type,         handleGetBoxList);
   yield takeLatest(boxListActions.getAllWritableBoxes.type, handleGetWritableBoxList);
}