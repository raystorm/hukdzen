import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";

import {
  CreateBoxRoleInput,
  CreateBoxRoleMutation,
  GetBoxUserQuery,
  UpdateBoxRoleInput,
  UpdateBoxRoleMutation,
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";
import {BoxRole} from "./BoxRoleType";
import { boxRoleActions } from './BoxRoleSlice';


export function getBoxRoleById(id: string)
{
  console.log(`Loading box: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetBoxUserQuery>>({
    query: queries.getBoxUser,
    variables: {id: id}
  });
}

export function createBoxRole(br: BoxRole)
{
  const createMe : CreateBoxRoleInput = {
    id:               br.id,
    boxRoleBoxId:     br.boxRoleBoxId,
    role:             br.role,
  }

  return API.graphql<GraphQLQuery<CreateBoxRoleMutation>>({
    query: mutations.createBoxRole,
    variables: { input: createMe }
  });
}


export function updateBoxRole(br: BoxRole)
{
  const updateMe : UpdateBoxRoleInput = {
    id:               br.id,
    boxRoleBoxId:     br.boxRoleBoxId,
    role:             br.role,
  }

  return API.graphql<GraphQLQuery<UpdateBoxRoleMutation>>({
    query: mutations.updateBoxRole,
    variables: { input: updateMe }
  });
}

export function* handleGetBoxRole(action: any): any
{
  try 
  {
    console.log(`handleGetBoxRole ${JSON.stringify(action)}`);
    let id;
    if ( action.payload.id ) { id = action.payload.id }
    else if ( action.payload?.data?.getBoxRole )
    { id = action.payload?.data?.getBoxRole.id; }
    const response = yield call(getBoxRoleById, id);
    yield put(boxRoleActions.setBoxRole(response.data.getBoxRole));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET BoxRole: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetBoxRoleById(action: any): any
{
  try
  {
    console.log(`handleGetBoxRoleById ${JSON.stringify(action)}`);
    const response = yield call(getBoxRoleById, action.payload);
    yield put(boxRoleActions.setBoxRole(response.data.getBoxRole));
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET BoxRole: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateBoxRole(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleCreateBoxRole ${JSON.stringify(action)}`);
    const response = yield call(createBoxRole, action.payload);
    yield put(boxRoleActions.setBoxRole(response));
    message = buildSuccessAlert('BoxUser Created');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Creating BoxRole: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleUpdateBoxRole(action: any): any
{
  let message: AlertBarProps;
  try
  {
    console.log(`handleUpdateBoxRole ${JSON.stringify(action)}`);
    const response = yield call(updateBoxRole, action.payload);
    yield put(boxRoleActions.setBoxRole(response));
    message = buildSuccessAlert('BoxUser Updated');
  }
  catch (error)
  {
    console.log(error);
    message = buildErrorAlert(`ERROR Updating BoxRole: ${JSON.stringify(error)}`);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}


export function* watchBoxSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(boxRoleActions.createBoxRole.type,  handleCreateBoxRole);
   yield takeLatest(boxRoleActions.getBoxRole.type,     handleGetBoxRole);
   yield takeLatest(boxRoleActions.getBoxRoleById.type, handleGetBoxRoleById);
   yield takeLatest(boxRoleActions.updateBoxRole.type,  handleUpdateBoxRole);
}