import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
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
import {Gyet} from "../User/userType";
import * as mutations from "../graphql/mutations";


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
    id:           box.id,
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
    const response = yield call(getBoxById, action.payload?.data?.getXbiis.id);
    yield put(boxActions.setSpecifiedBox(response.data.getXbiis));
  }
  catch (error) { console.log(error); }
}

export function* handleGetBoxById(action: any): any
{
  try
  {
    console.log(`handleGetBoxById ${JSON.stringify(action)}`);
    const response = yield call(getBoxById, action.payload);
    yield put(boxActions.setSpecifiedBox(response.data.getXbiis));
  }
  catch (error) { console.log(error); }
}

export function* handleCreateBox(action: any): any
{
  try
  {
    console.log(`handleCreateBox ${JSON.stringify(action)}`);
    const response = yield call(createBox, action.payload);
    yield put(boxActions.setSpecifiedBox(response));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateBox(action: any): any
{
  try 
  {
    console.log(`handleUpdateBox ${JSON.stringify(action)}`);
    const response = yield call(updateBox, action.payload);
    yield put(boxActions.setSpecifiedBox(response));
  }
  catch (error) { console.log(error); }
}


export function* watchBoxSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(boxActions.createBox.type,           handleCreateBox);
   yield takeLatest(boxActions.getSpecifiedBox.type,     handleGetBox);
   yield takeLatest(boxActions.getSpecifiedBoxById.type, handleGetBoxById);
   yield takeLatest(boxActions.updateSpecifiedBox.type,  handleUpdateBox);
}