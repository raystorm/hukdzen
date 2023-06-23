import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { v4 as randomUUID } from 'uuid';
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import { Xbiis } from './boxTypes';
import boxSlice, { boxActions } from './boxSlice';
import {
  CreateXbiisInput,
  CreateXbiisMutation,
  GetXbiisQuery, UpdateXbiisInput, UpdateXbiisMutation
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import {User} from "../User/userType";
import * as mutations from "../graphql/mutations";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {boxListActions} from "./BoxList/BoxListSlice";


export function getBoxById(id: string) 
{
  console.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetXbiisQuery>>({
    query: queries.getXbiis,
    variables: {id: id}
  });
}

export function createBox(box: Xbiis)
{
  const createMe : CreateXbiisInput = {
    id:           randomUUID(),
    name:         box.name,
    defaultRole:  box.defaultRole,
    xbiisOwnerId: box.xbiisOwnerId
  }

  return API.graphql<GraphQLQuery<CreateXbiisMutation>>({
    query: mutations.createXbiis,
    variables: { input: createMe }
  });
}


export function updateBox(box: Xbiis)
{
  const updateMe : UpdateXbiisInput = {
    id:          box.id,
    name:        box.name,
    defaultRole: box.defaultRole,
  }

  return API.graphql<GraphQLQuery<UpdateXbiisMutation>>({
    query: mutations.updateXbiis,
    variables: { input: updateMe }
  });
}

export function* handleGetBox(action: any): any
{
  try 
  {
    console.log(`handleGetBox ${JSON.stringify(action)}`);
    let id;
    if ( action.payload.id ) { id = action.payload.id }
    else if ( action.payload?.data?.getXbiis )
    { id = action.payload?.data?.getXbiis.id; }
    const response = yield call(getBoxById, id);
    yield put(boxActions.setBox(response.data.getXbiis));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET Box: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxById(action: any): any
{
  try
  {
    console.log(`handleGetBoxById ${JSON.stringify(action)}`);
    const response = yield call(getBoxById, action.payload);
    yield put(boxActions.setBox(response.data.getXbiis));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET Box: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBox(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleCreateBox ${JSON.stringify(action)}`);
    const response = yield call(createBox, action.payload);
    yield put(boxActions.setBox(response));
    yield put(boxListActions.addBox(response.data.createXbiis));
    message = buildSuccessAlert('Box Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Creating Box: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBox(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleUpdateBox ${JSON.stringify(action)}`);
    const response = yield call(updateBox, action.payload);
    yield put(boxActions.setBox(response));
    message = buildSuccessAlert('Box Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Updating Box: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchBoxSaga() 
{
   // findAll, findMostRecent, findOwned
   yield takeLatest(boxActions.createBox.type,  handleCreateBox);
   yield takeLatest(boxActions.getBox.type,     handleGetBox);
   yield takeLatest(boxActions.getBoxById.type, handleGetBoxById);
   yield takeLatest(boxActions.updateBox.type,  handleUpdateBox);
}