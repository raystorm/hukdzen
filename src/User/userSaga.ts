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

Amplify.configure(config);


export function getUserById(id: string)
{
  console.log(`Loading user: ${id} from DynamoDB via Appsync (GraphQL)`);
  return API.graphql<GraphQLQuery<GetGyetQuery>>({
    query: queries.getGyet,
    variables: {id: id}
  });
}

export function createUser(user: Gyet)
{
   return API.graphql<GraphQLQuery<CreateGyetMutation>>({
    query: mutations.createGyet,
    variables: { input: user }
   });
}

export function updateUser(user: Gyet)
{
  const updateTo: UpdateGyetInput = {
    id:      user.id,
    name:    user.name,
    email:   user.email,
    waa:     user.waa,
    isAdmin: user.isAdmin,
  }

  const updated = API.graphql<GraphQLQuery<UpdateGyetMutation>>({
    query: mutations.updateGyet,
    variables: { input: updateTo }
  });
  return updated;
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
    yield put(userActions.setSpecifiedUser(response));
  }
  catch (error) { console.log(error); }
}

export function* handleGetUser(action: any): any
{
  try 
  {
    console.log(`handleGetUser ${JSON.stringify(action)}`);
    const response = yield call(getUserById, action.payload?.data?.getGyet.id);
    yield put(userActions.setSpecifiedUser(response?.data?.getGyet));
  }
  catch (error) { console.log(error); }
}

export function* handleGetUserById(action: any): any
{
  try 
  {
    console.log(`handleGetUserById ${JSON.stringify(action)}`);
    const response = yield call(getUserById, action.payload);
    yield put(userActions.setSpecifiedUser(response?.data?.getGyet));
  }
  catch (error) { console.log(error); }
}

export function* handleCreateUser(action: any): any
{
  try
  {
    console.log(`handleCreateUser ${JSON.stringify(action)}`);
    const response = yield call(createUser, action.payload);
    yield put(userActions.setSpecifiedUser(response));
  }
  catch (error) { console.log(error); }
}

export function* handleUpdateUser(action: any): any
{
  try 
  {
    console.log(`handleUpdateUser ${JSON.stringify(action)}`);
    const response = yield call(updateUser, action.payload);
    yield put(userActions.setSpecifiedUser(response));
  }
  catch (error) { console.log(error); }
}


export function* watchUserSaga() 
{
   //TODO: findAll, findMostRecent, findOwned
   yield takeLatest(currentUserActions.getCurrentUser.type, handleGetCurrentUser);
   yield takeLatest(userActions.getSpecifiedUser.type,      handleGetUser);
   yield takeLatest(userActions.getSpecifiedUserById.type,  handleGetUserById);
   yield takeLatest(userActions.createUser.type,            handleCreateUser);
   yield takeLatest(userActions.updateSpecifiedUser.type,   handleUpdateUser);
}