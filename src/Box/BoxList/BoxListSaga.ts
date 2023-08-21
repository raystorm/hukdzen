import {call, put, takeLatest, } from 'redux-saga/effects'
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {boxListActions} from './BoxListSlice';
import {ListXbiisQuery, ModelXbiisFilterInput} from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";
import {buildErrorAlert} from "../../AlertBar/AlertBarTypes";
import {alertBarActions} from "../../AlertBar/AlertBarSlice";
import {getAllBoxUsersForUserId} from "../../BoxUser/BoxUserList/BoxUserListSaga";
import {User} from "../../User/userType";
import {Role} from "../../Role/roleTypes";
import {BoxList, emptyBoxList} from "./BoxListType";
import {PayloadAction} from "@reduxjs/toolkit";

export function getAllBoxes()
{
   //console.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return API.graphql<GraphQLQuery<ListXbiisQuery>>({
     query: queries.listXbiis,
   });
}

export function getAllOwnedBoxesForUserId(userId: string)
{
   //console.log(`Loading All boxes owned by: ${userId}`);

   const filter: ModelXbiisFilterInput = { xbiisOwnerId: { eq: userId } };

   return API.graphql<GraphQLQuery<ListXbiisQuery>>({
      query: queries.listXbiis,
      variables: { filter: filter },
   });
}

export function* handleGetBoxList(): any
{
  try 
  {
    const response = yield call(getAllBoxes);
    //console.log(`Boxes to Load ${JSON.stringify(response)}`);
    yield put(boxListActions.setAllBoxes(response.data.listXbiis));
  }
  catch (error)
  {
     const msg = `Failed to GET List of Boxes: ${JSON.stringify(error)}`;
     console.log(msg);
     // console.trace(); //stack trace for debug
     const message = buildErrorAlert(msg);
     yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetWritableBoxList(action: PayloadAction<User>): any
{
   try
   {
      const user = action.payload;
      //console.log(`handleGetWritableBoxList for ${JSON.stringify(user)}`);
      let boxes: BoxList;
      if ( !user.isAdmin )
      {
         //console.log(`filtering writable Boxes for user: ${user.id}`);
         const buResponse = yield call(getAllBoxUsersForUserId, user.id);
         boxes = { ...emptyBoxList, items: [] };
         //console.log(`BoxUsers Found: ${JSON.stringify(buResponse)}`);
         // @ts-ignore
         //console.log(`calls: ${JSON.stringify(API.graphql.mock.calls)}`);
         for (let bu of buResponse.data.listBoxUsers.items)
         { if (bu.role === Role.Write) { boxes.items.push(bu.box); } }
      }
      else
      {
         //console.log('getting ALL boxes.');
         const response = yield call(getAllBoxes);
         boxes = response.data.listXbiis;
      }
      //console.log(`Writable Boxes to Load ${JSON.stringify(boxes)}`);
      yield put(boxListActions.setAllBoxes(boxes));
   }
   catch (error)
   {
      const msg = `Failed to GET List of Boxes: ${JSON.stringify(error)}`;
      console.log(msg);
      console.log(error);
      // console.trace(); //stack trace for debug
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