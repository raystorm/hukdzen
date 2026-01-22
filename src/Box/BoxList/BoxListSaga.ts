import { call, put, takeLatest, } from 'redux-saga/effects'
import type { PayloadAction } from "@reduxjs/toolkit";
import { generateClient } from '@aws-amplify/api';

import { ModelXbiisFilterInput } from "../../types/AmplifyTypes";
import * as queries from "../../graphql/queries";

import { logger } from '../../utils/logger';
import { boxListActions } from './BoxListSlice';
import { buildErrorAlert, buildFriendlyErrorAlert } from "../../AlertBar/AlertBarTypes";
import { alertBarActions } from "../../AlertBar/AlertBarSlice";
import { getAllBoxUsersForUserIdAndBoxList } from "../../BoxUser/BoxUserList/BoxUserListSaga";
import type { User} from "../../User/userType";
import type { BoxList } from "./BoxListType";
import { emptyBoxList } from "./BoxListType";
import { DefaultBox } from "../boxTypes";
import { isReadable, isWritable } from "../boxRules";

const client = generateClient();

export function getAllBoxes()
{
   //logger.log(`Loading All boxes from DynamoDB via Appsync (GraphQL)`);
   return client.graphql({ query: queries.listXbiis });
}

export function getAllOwnedBoxesForUserId(userId: string)
{
   const filter: ModelXbiisFilterInput = { xbiisOwnerId: { eq: userId } };

   return client.graphql({
      query: queries.listXbiis,
      variables: { filter: filter },
   });
}

export function* getAllBoxesForAdmin()
{
   try
   {
      logger.log('Admin: Loading all boxes');
      const response = yield call(getAllBoxes);
      //logger.log('Admin: Response:', response);
      yield put(boxListActions.setAllBoxes(response.data.listXbiis));
   }
   catch (error)
   {
      logger.error('Admin: Error loading boxes:', error);
      const message = buildFriendlyErrorAlert('Failed to GET List of ALL Boxes', error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

//helper enum, so we know the access Type where looking for
enum AccessType { READ, WRITE };

function* getBoxList(action: PayloadAction<User>, access: AccessType): any
{
   const user = action.payload;
   //logger.log('getBoxList called for user:', user.id, 'isAdmin:', user.isAdmin);
   if ( user.isAdmin ) { return yield getAllBoxesForAdmin(); }

   //set filters list so we know which one to use
   const loggingLabels = {
      [AccessType.READ]: 'readable',
      [AccessType.WRITE]: 'writable',
   };
   const loggingLabel = loggingLabels[access];

   try
   {
      logger.log(`Getting ${loggingLabel} boxList for:`, user);
      let boxes: BoxList;

      const ownedBoxesResponse = yield call(getAllOwnedBoxesForUserId, user.id);
      const ownedBoxes = ownedBoxesResponse?.data?.listXbiis;

      const buResponse = yield call(getAllBoxUsersForUserIdAndBoxList, user.id,
                                    ownedBoxes);
      boxes = { ...emptyBoxList, items: [] };

      boxes.items.push(DefaultBox); //Always include default

      //set filters list so we know which one to use
      const accessFilters = {
         [AccessType.READ]: isReadable,
         [AccessType.WRITE]: isWritable,
      };

      const filter = accessFilters[access]; //set the one to use

      const items = buResponse?.data?.listBoxUsers?.items;
      if (items)
      {
         for (let bu of items)
         {
            if ( filter(bu) && DefaultBox.id !== bu.box.id )
            { boxes.items.push(bu.box); }
         }
      }

      yield put(boxListActions.setAllBoxes(boxes));
   }
   catch (error)
   {
      logger.error(error);
      // logger.trace(); //stack trace for debug
      const message = buildFriendlyErrorAlert(`Failed to GET List of ${loggingLabel} Boxes`,
                                              error);
      yield put(alertBarActions.DisplayAlertBox(message));
   }
}

export function* handleGetReadableBoxList(action: PayloadAction<User>): any
{ yield getBoxList(action, AccessType.READ); }

export function* handleGetWritableBoxList(action: PayloadAction<User>)
{ yield getBoxList(action, AccessType.WRITE); }

export function* watchBoxListSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(boxListActions.getAllReadableBoxes.type, handleGetReadableBoxList);
   yield takeLatest(boxListActions.getAllWritableBoxes.type, handleGetWritableBoxList);
}
