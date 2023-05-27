import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {
  CreateBoxUserInput, CreateBoxUserMutation,
  GetBoxUserQuery,
  UpdateBoxUserInput, UpdateBoxUserMutation,
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {boxUserActions} from "./BoxUserSlice";
import {BoxUser} from "./BoxUserType";


export function getBoxUserById(id: string)
{
  console.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetBoxUserQuery>>({
    query: queries.getBoxUser,
    variables: {id: id}
  });
}

export function createBoxUser(bu: BoxUser)
{
  const createMe : CreateBoxUserInput = {
    id:               bu.id,
    boxUserUserId:    bu.boxUserUserId,
    boxUserBoxRoleId: bu.boxUserBoxRoleId,
  }

  return API.graphql<GraphQLQuery<CreateBoxUserMutation>>({
    query: mutations.createBoxUser,
    variables: { input: createMe }
  });
}


export function updateBoxUser(bu: BoxUser)
{
  const updateMe : UpdateBoxUserInput = {
    id:          bu.id,
    boxUserUserId:    bu.boxUserUserId,
    boxUserBoxRoleId: bu.boxUserBoxRoleId,
  }

  return API.graphql<GraphQLQuery<UpdateBoxUserMutation>>({
    query: mutations.updateBoxUser,
    variables: { input: updateMe }
  });
}

export function* handleGetBoxUser(action: any): any
{
  try 
  {
    console.log(`handleGetBoxUser ${JSON.stringify(action)}`);
    let id;
    if ( action.payload.id ) { id = action.payload.id }
    else if ( action.payload?.data?.getBoxUser )
    { id = action.payload?.data?.getBoxUser.id; }
    const response = yield call(getBoxUserById, id);
    yield put(boxUserActions.setBoxUser(response.data.getBoxUser));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET BoxUser: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxUserById(action: any): any
{
  try
  {
    console.log(`handleGetBoxUserById ${JSON.stringify(action)}`);
    const response = yield call(getBoxUserById, action.payload);
    yield put(boxUserActions.setBoxUser(response.data.getBoxUser));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET BoxUser: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBoxUser(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleCreateBoxUser ${JSON.stringify(action)}`);
    const response = yield call(createBoxUser, action.payload);
    yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Creating BoxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBoxUser(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleUpdateBoxUser ${JSON.stringify(action)}`);
    const response = yield call(updateBoxUser, action.payload);
    yield put(boxUserActions.setBoxUser(response));
    message = buildSuccessAlert('BoxUser Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Updating BoxUser: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchBoxSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(boxUserActions.createBoxUser.type,  handleCreateBoxUser);
   yield takeLatest(boxUserActions.getBoxUser.type,     handleGetBoxUser);
   yield takeLatest(boxUserActions.getBoxUserById.type, handleGetBoxUserById);
   yield takeLatest(boxUserActions.updateBoxUser.type,  handleUpdateBoxUser);
}