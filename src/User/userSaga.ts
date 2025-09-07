import {call, put, takeLatest, takeLeading,} from 'redux-saga/effects'
import {PayloadAction} from "@reduxjs/toolkit";
import {v4 as randomUUID} from "uuid";
import {generateClient} from "@aws-amplify/api";
import { getCurrentUser } from 'aws-amplify/auth';

import {emptyUser, User} from './userType';
import { userActions } from './userSlice';
import { currentUserActions } from './currentUserSlice';
import { CreateUserInput, UpdateUserInput, } from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { isDev } from "../components/shared/location";

import {AlertBarProps} from "../AlertBar/AlertBarNotifier";
import {alertBarActions} from "../AlertBar/AlertBarSlice";
import {buildErrorAlert, buildInfoAlert, buildSuccessAlert, buildWarningAlert} from "../AlertBar/AlertBarTypes";

import {BoxUser, buildBoxUser} from "../BoxUser/BoxUserType";
import {DefaultBox} from "../Box/boxTypes";
import {removeBoxUserbyId} from "../BoxUser/boxUserSaga";
import {getAllOwnedBoxesForUserId} from "../Box/BoxList/BoxListSaga";
import {printGyet} from "../Gyet/GyetType";
import {getOwnedDocuments} from "../docs/docList/documentListSaga";
import {getAllBoxUsersForUserId} from "../BoxUser/BoxUserList/BoxUserListSaga";
import {boxUserActions} from "../BoxUser/BoxUserSlice";

export const MISSING_NAME_ERROR = 'Error: Name Not Supplied';

const client = generateClient();

export const getUserById = (id: string) =>
{
  return client.graphql({ query: queries.getUser, variables: {id: id} });
}

export const createUser = (user: User) =>
{
   const createMe : CreateUserInput = {
     id:      user.id,
     email:   user.email,
     name:    user.name ?? MISSING_NAME_ERROR,
     waa:     user.waa,
     isAdmin: user.isAdmin,
     clan:    user.clan,
   };

  if ( isDev() )
  { console.log(`creating user as: ${JSON.stringify(createMe)}`); }

   return client.graphql({
     query: mutations.createUser,
     variables: { input: createMe }
   });
}

export const updateUser = (user: User) =>
{
  const updateTo: UpdateUserInput = {
    id:      user.id,
    name:    user.name,
    email:   user.email,
    waa:     user.waa,
    isAdmin: user.isAdmin,
    clan:    user.clan,
  }

  return client.graphql({
    query: mutations.updateUser,
    variables: { input: updateTo }
  });
}

export const removeUserById = (id: string) =>
{
  if ( isDev() )
  { console.log(`Loading user: ${id} from DynamoDB via Appsync (GraphQL)`); }
  return client.graphql({
    query: mutations.deleteUser,
    variables: { input: { id: id } }
  });
}

export function getCurrentAmplifyUser() { return getCurrentUser(); }

export function* handleGetCurrentUser(): any
{
  try
  {
    if ( isDev() ) { console.log(`handleGetCurrentUser`); }
    // get ID from amplify
    const amplifyUser = yield call(getCurrentAmplifyUser);
    // use amplify ID to get user from DB
    const response = yield call(getUserById, amplifyUser.getUsername());
  }
  catch (error)
  {
    console.error(error);
    const message = buildErrorAlert(`Failed to GET Current User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetUserById(action: PayloadAction<string>): any
{
  try 
  {
    if ( isDev() )
    { console.log(`handleGetUserById ${JSON.stringify(action)}`); }
    const response = yield call(getUserById, action.payload);
    yield put(userActions.setUser(response.data.getUser));
  }
  catch (error)
  {
    console.error(error);
    const message = buildErrorAlert(`Failed to GET User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateUser(action: PayloadAction<User>): any
{
  let message: AlertBarProps;
  try
  {
    if ( isDev() )
    { console.log(`handleCreateUser ${JSON.stringify(action)}`); }
    const createMe = action.payload;
    const response = yield call(createUser, createMe);
    if ( isDev() )
    { console.log(`User Created Response: ${JSON.stringify(response)}`); }
    const user = response.data.createUser;

    //setup box permissions for normal users
    if ( !createMe.isAdmin )
    {
      const bu: BoxUser = {
        ...buildBoxUser(createMe, DefaultBox, DefaultBox.defaultRole!),
        id: randomUUID(),
      };
      yield put(boxUserActions.createBoxUser(bu));
    }

    /* Users are created as part of First time Sign In. */
    message = buildSuccessAlert('User Created');
  }
  catch (error)
  {
    console.error(error);
    message = buildErrorAlert(`Failed to Create User: ${JSON.stringify(error)}`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleUpdateUser(action: PayloadAction<User>): any
{
  let message:AlertBarProps;
  try 
  {
    //console.log(`handleUpdateUser ${JSON.stringify(action)}`);
    const response = yield call(updateUser, action.payload);
    message = buildSuccessAlert('User Updated');
  }
  catch(error)
  {
    message = buildErrorAlert(`Error Updating User: ${JSON.stringify(error)}`);
    console.error(error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveUser(action: PayloadAction<User>): any
{
  if ( isDev() )
  { console.log(`handleRemoveUser: ${JSON.stringify(action.payload)}`); }
  const user = action.payload;
  let msg: AlertBarProps = buildWarningAlert('Unexpected issue removing user.');
  try
  {
    //check for boxes
    const boxResponse = yield call(getAllOwnedBoxesForUserId, user.id);
    if ( 0 !== boxResponse.data.listXbiis.items.length) {
      msg = buildErrorAlert(`Unable To Delete: ${printGyet(user)}, since they own boxes.`);
      return;
    }

    //check for docs
    const docResponse = yield call(getOwnedDocuments, user.id);
    if (0 !== docResponse.data.listDocumentDetails.items.length) {
      msg = buildErrorAlert(`Unable To Delete: ${printGyet(user)}, since they own Items.`);
      return;
    }

    /* remove all boxUsers */
    //yield call(removeAllBoxUsersForUserId, user.id);
    const boxUserResponse = yield call(getAllBoxUsersForUserId, user.id);
    for(let bu of boxUserResponse.data.listBoxUsers.items)
    { yield call(removeBoxUserbyId, bu.id); }

    yield call(removeUserById, user.id);

    //TODO: look at how to disable the specified user in cognito.

    msg = buildSuccessAlert(`Successfully removed user: ${printGyet(user)}`);
  }
  catch (error)
  {
    msg = buildErrorAlert(`Unable to remove user: ${printGyet(user)}: ${JSON.stringify(error)}`);
    console.error(error);
  }
  finally { yield put(alertBarActions.DisplayAlertBox(msg)); }
}

export function* handleSignIn(action: any): any
{
  /* Load User Data, then call initial or, regular based on found */
  if ( isDev() )
  { console.log(`handling dispatched sign in event for ${JSON.stringify(action)}`); }
  //console.trace();

  //yield put(alertBarActions.DisplayAlertBox(buildInfoAlert('Welcome!')));

  //const data   = action.payload;
  const data   = yield call(getCurrentAmplifyUser);
  if ( isDev() ) { console.log(data); }
  const userId = data.username;

  let response;
  try { response = yield call(getUserById, userId); }
  catch(error)
  {
    console.error(error);
    return;
  }
  if ( !response?.data ) { return; }

  if ( null === response.data.getUser ) // initial Sign In
  {
    /*  Process First time Sign In for new user
     *  Steps:
     *    1. Create New User,
     *    2. Save New User,
     *    3. Stuff into App State
     */
    if ( isDev() )
    {
      console.log(`handling dispatched initial sign in for: ${JSON.stringify(data)}`);
      //console.log('${JSON.stringify(data)}');
    }

    /* disabled until clan is part of the sign-up form as a DropDown.
    let clan: typeof Clan | null = null;
    if ( data.payload.data.attributes["custom:clan"] )
    { clan = getClanFromName(data.payload.data.attributes["custom:clan"]) }
    */

    let admin = false;
    if ( data?.signInUserSession?.idToken?.payload['cognito:groups'] )
    {
      admin = data.signInUserSession.idToken.payload['cognito:groups']
                  .includes('WebAppAdmin');
    }

    const user : User = {
      ...emptyUser,
      id:      data.username,
      email:   data.attributes.email,
      name:    data.attributes.name ?? MISSING_NAME_ERROR,
      waa:     data.attributes["custom:waa"],
      isAdmin: admin,
      //clan:  clan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    /*
     *  set user BEFORE create
     *      * avoids infinite loop w/ the more info dialog
     *      * ensures dialog has known info to display (email)
     */
    // amazonq-ignore-next-line
    yield put(userActions.setUser(user));
    // amazonq-ignore-next-line
    yield put(currentUserActions.setCurrentUser(user));

    //TODO: detect social sign In
    if ( !user.name || MISSING_NAME_ERROR === user.name ) //assume if name not supplied
    { //dispatch an action to get the missing data
      if ( isDev() )
      { console.log(`Requesting more info before creating: ${JSON.stringify(user)}`); }
      // amazonq-ignore-next-line
      yield put(userActions.promptForUserInfo(user));
      //return; //bail, the form should call create again.
    }
    else //TODO: look into transactions
    { //user Not found in Dynamo, create them, and default perms/resources
      if ( isDev() ) { console.log(`creating: ${JSON.stringify(user)}`); }
      yield put(userActions.createUser(user));

      //setup default box Access
      /*
      if ( !admin )
      {
         const defaultBoxUser = buildBoxUser(user);
         yield call(createBoxUser, defaultBoxUser);
      }
      */
    }
  }
  else //user found, populate state with user data
  {
    const userData = response.data.getUser;
    if ( isDev() )
    {
      console.log(`handling dispatched sign in for (data): ${JSON.stringify(data)}`);
      console.log(`handling dispatched sign in for (user): ${JSON.stringify(userData)}`);
    }

    yield put(userActions.setUser(userData));
    yield put(currentUserActions.setCurrentUser(userData));
  }
}

export function* watchUserSaga() 
{  // findAll, findMostRecent, findOwned
   yield takeLatest(currentUserActions.getCurrentUser.type, handleGetCurrentUser);

   yield takeLatest(userActions.getUserById.type, handleGetUserById);
   yield takeLatest(userActions.createUser.type,  handleCreateUser);
   yield takeLatest(userActions.updateUser.type,  handleUpdateUser);

   yield takeLatest(userActions.removeUser.type,  handleRemoveUser);

   yield takeLeading(currentUserActions.signIn,   handleSignIn);
}