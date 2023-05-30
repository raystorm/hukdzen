import { call, put, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects'
import { Amplify, API, Auth } from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {useAuthenticator} from "@aws-amplify/ui-react";
import {CognitoUser} from "amazon-cognito-identity-js";

import { gyigyet } from './UserList/userListType';
import { Gyet } from './userType';
import userSlice, { userActions } from './userSlice';
import { currentUserActions } from './currentUserSlice';
import {
  CreateGyetInput,
  CreateGyetMutation,
  GetGyetQuery,
  UpdateGyetInput,
  UpdateGyetMutation
} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import config from "../aws-exports";
import {AlertBarProps} from "../AlertBar/AlertBar";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildSuccessAlert} from "../AlertBar/AlertBarTypes";

Amplify.configure(config);


export const getUserById = (id: string) =>
{
  console.log(`Loading user: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetGyetQuery>>({
    query: queries.getGyet,
    variables: {id: id}
  });
}

export const createUser = (user: Gyet) =>
{
   const createMe : CreateGyetInput = {
     id:      user.id,
     email:   user.email,
     name:    user.name,
     waa:     user.waa,
     isAdmin: user.isAdmin,
     //clan:  user.clan,
   };

   return API.graphql<GraphQLQuery<CreateGyetMutation>>({
     query: mutations.createGyet,
     variables: { input: createMe }
   });
}

export const updateUser = (user: Gyet) =>
{
  const updateTo: UpdateGyetInput = {
    id:      user.id,
    name:    user.name,
    email:   user.email,
    waa:     user.waa,
    isAdmin: user.isAdmin,
  }

  return API.graphql<GraphQLQuery<UpdateGyetMutation>>({
    query: mutations.updateGyet,
    variables: { input: updateTo }
  });
}

export async function getCurrentAmplifyUser() : Promise<CognitoUser>
{ return await Auth.currentAuthenticatedUser(); }

//TODO: find correct type for action
export function* handleGetCurrentUser(): any
{
  try
  {
    console.log(`handleGetCurrentUser`);

    // get ID from amplify
    const amplifyUser = yield getCurrentAmplifyUser();

    const response = yield call(getUserById, amplifyUser.getUsername);
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET Current User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetUser(action: any): any
{
  try 
  {
    console.log(`handleGetUser ${JSON.stringify(action)}`);
    const response = yield call(getUserById, action.payload?.data?.getGyet.id);
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetUserById(action: any): any
{
  try 
  {
    console.log(`handleGetUserById ${JSON.stringify(action)}`);
    const response = yield call(getUserById, action.payload);
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to GET User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateUser(action: any): any
{
  try
  {
    console.log(`handleCreateUser ${JSON.stringify(action)}`);
    const response = yield call(createUser, action.payload);
    /* Users are created as part of First Time Sign In.
    const success: buildSuccessAlert('User Created');
    yield put(alertBarActions.DisplayAlertBox(success));
    */
  }
  catch (error)
  {
    console.log(error);
    const message = buildErrorAlert(`Failed to Create User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleUpdateUser(action: any): any
{
  let message:AlertBarProps;
  let updateResponse;
  try 
  {
    //console.log(`handleUpdateUser ${JSON.stringify(action)}`);
    const response = yield call(updateUser, action.payload);
    message = buildSuccessAlert('User Updated');
  }
  catch(error)
  {
    message = buildErrorAlert(`Error Updating User: ${JSON.stringify(error)}`);
    console.log(error);
  }
  put(alertBarActions.DisplayAlertBox(message));
  //return updateResponse.data.updateGyet;
}


export function* watchUserSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(currentUserActions.getCurrentUser.type, handleGetCurrentUser);
   yield takeLatest(userActions.getUser.type,     handleGetUser);
   yield takeLatest(userActions.getUserById.type, handleGetUserById);
   yield takeLatest(userActions.createUser.type,  handleCreateUser);
   yield takeLatest(userActions.updateUser.type,  handleUpdateUser);
}