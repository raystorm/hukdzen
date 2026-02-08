import { call, delay, put, takeLatest, takeLeading, } from 'redux-saga/effects'
import { PayloadAction } from "@reduxjs/toolkit";
import { v4 as randomUUID } from "uuid";
import { generateClient } from "@aws-amplify/api";
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

import { alertBarActions } from "../AlertBar/AlertBarSlice";
import type { Alert } from "../AlertBar/AlertBarTypes";
import {
         buildInfoAlert, buildSuccessAlert, buildWarningAlert, buildErrorAlert,
         emptyAlert
       } from "../AlertBar/AlertBarTypes";

import type { User, CreateUserInput, UpdateUserInput } from './userType';
import { emptyUser, COGNITO_ADMIN_GROUP } from './userType';
import { userActions } from './userSlice';
import { currentUserActions } from './currentUserSlice';

import { BoxUser, buildBoxUser } from "../BoxUser/BoxUserType";
import { DefaultBox, emptyXbiis, Xbiis } from "../Box/boxTypes";
import { removeBoxUserbyId } from "../BoxUser/boxUserSaga";
import { getAllOwnedBoxesForUserId } from "../Box/BoxList/BoxListSaga";
import { printGyet } from "../Gyet/GyetType";
import { getOwnedDocuments } from "../docs/docList/documentListSaga";
import { getAllBoxUsersForUserId } from "../BoxUser/BoxUserList/BoxUserListSaga";
import { boxUserActions } from "../BoxUser/BoxUserSlice";
import { logger } from "../utils/logger";
import { getUserBoxFor } from "../Box/boxSaga";
import { printName } from "../types";
import { boxActions } from "../Box/boxSlice";
import { AccessLevel, BoxPurpose } from '../Box/boxTypes';
import { printErrorMessage } from "../error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value: string | null | undefined): boolean =>
{ return 'string' === typeof value && EMAIL_REGEX.test(value); };

export const MISSING_NAME_ERROR = 'Error: Name Not Supplied';

const client = generateClient();

export interface hasUsername {
   username: string;
   signInDetails: { loginId: string; }
}

export const getUserById = (id: string) =>
{ return client.graphql({ query: queries.getUser, variables: {id: id} }); }

export const createUser = (user: User) =>
{
   const createMe : CreateUserInput = {
     id:      user.id,
     email:   user.email,
     name:    user.name ?? MISSING_NAME_ERROR,
     waa:     user.waa,
     isAdmin: user.isAdmin,
     clan:    user.clan || null, //proper null handling for no clan
   };

  logger.log('creating user as: ', createMe);

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
    clan:    user.clan || null,
    emailPreferences: user.emailPreferences ? {
      allOptOut: user.emailPreferences.allOptOut,
      boxRequestOptOut: user.emailPreferences.boxRequestOptOut,
      collaboratorOptOut: user.emailPreferences.collaboratorOptOut,
      systemOptOut: user.emailPreferences.systemOptOut,
      optOutReason: user.emailPreferences.optOutReason,
      optOutAt: user.emailPreferences.optOutAt,
      softBounceCount: user.emailPreferences.softBounceCount,
    } : undefined,
  }

  return client.graphql({
    query: mutations.updateUser,
    variables: { input: updateTo }
  });
}

export const removeUserById = (id: string) =>
{
  logger.log('Loading user:', id, 'from DynamoDB via Appsync (GraphQL)');
  return client.graphql({
    query: mutations.deleteUser,
    variables: { input: { id: id } }
  });
}

export function getCurrentAmplifyUser() { return getCurrentUser(); }

export function getAmplifyUserAttributes() { return fetchUserAttributes(); }

export function* handleGetCurrentUser(): any
{
  try
  {
    logger.log(`handleGetCurrentUser`);
    // get ID from amplify
    const amplifyUser = yield call(getCurrentAmplifyUser);
    // use amplify ID to get user from DB
    const response = yield call(getUserById, amplifyUser.getUsername());
  }
  catch (error)
  {
    logger.error(error);
    const message = buildErrorAlert(`Failed to GET Current User: "${printErrorMessage(error)}"`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleGetUserById(action: PayloadAction<string>): any
{
  try 
  {
    logger.log('handleGetUserById', action);
    const response = yield call(getUserById, action.payload);
    yield put(userActions.setUser(response.data.getUser));
  }
  catch (error)
  {
    logger.error(error);
    const message = buildErrorAlert(`Failed to GET User: "${printErrorMessage(error)}"`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

export function* handleCreateUser(action: PayloadAction<User>): any
{
  let message: Alert;
  try
  {
    logger.log('handleCreateUser', action);
    const createMe = action.payload;
    const response = yield call(createUser, createMe);
    logger.log('User Created Response:', response);
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
    //message = buildSuccessAlert('User Created');
    logger.debug('created');
  }
  catch (error)
  {
    logger.error(error);
    message = buildErrorAlert(`Unable to create user: "${printErrorMessage(error)}"`);
    yield put(alertBarActions.DisplayAlertBox(message));
  }
}

/**
 *  Helper method to check for and create user boxes, if the user doesn't have one.
 *  @param user
 */
export function* createUserBox(user: User): any
{
  let message: Alert = emptyAlert;
  try
  {
     logger.log('createUserBox', user);

     //check for existing user box
     const userBoxResponse = yield call(getUserBoxFor, user.id);
     //logger.debug('user box found:', userBoxResponse);

     const hasUserBox = !!userBoxResponse?.data?.listXbiis?.items?.length;
     //logger.debug('was user box found? ', hasUserBox);

     if ( hasUserBox ) //box exists, so bail
     {
        //message = buildInfoAlert('UserBox Already Exists'); //displayed in finally
        return; //silent quit, always runs. don't bother users.
     }

     const userBox: Xbiis = {
        ...emptyXbiis,
        //TODO: constant name string
        name:         `Personal: ${printName(user)}`,
        owner:        user,
        xbiisOwnerId: user.id,
        purpose:      BoxPurpose.USER,
        defaultRole:  AccessLevel.NONE,
      }
     yield put(boxActions.createBox(userBox));
     //logger.debug('user box created');

     //get box, so we have the ID
     let userBoxResp = yield call(getUserBoxFor, user.id);
     //logger.debug('created user box found: ', userBoxResp);

     if ( !userBoxResp )
     {
        yield delay(500); //wait for box creation.
        userBoxResp = yield call(getUserBoxFor, user.id);
     }
     const userBoxWithID = userBoxResp?.data?.listXbiis?.items[0];
     if ( !userBoxWithID )
     {  // noinspection ExceptionCaughtLocallyJS
        throw new Error( "Personal box created successfully, "
                       + "but we're unable to find it.");
     }

     //ensure user has permissions on their personal box
     const bu: BoxUser = {
        ...buildBoxUser(user, userBoxWithID, AccessLevel.WRITE),
        id: randomUUID(),
      };
     yield put(boxUserActions.createBoxUser(bu));

     /* Users box created */
     //message = buildSuccessAlert('UserBox Created'); //silent like user create
  }
  catch (error)
  {
    logger.error(error);
    const errMsg = printErrorMessage(error);
    message = buildErrorAlert(`Failure while to Creating the user's Personal Box: ${errMsg}`);
  }
  finally
  {
    if ( emptyAlert !== message )
    { yield put(alertBarActions.DisplayAlertBox(message)); }
  }
}

export function* handleUpdateUser(action: PayloadAction<User>): any
{
  let message:Alert;
  try 
  {
    //logger.log('handleUpdateUser', action);
    const response = yield call(updateUser, action.payload);
    message = buildSuccessAlert('User Updated');
  }
  catch(error)
  {
    message = buildErrorAlert(`Error updating user: "${printErrorMessage(error)}"`);
    logger.error(error);
  }
  yield put(alertBarActions.DisplayAlertBox(message));
}

export function* handleRemoveUser(action: PayloadAction<User>): any
{
  logger.log('handleRemoveUser:', action.payload);
  const user = action.payload;
  let msg: Alert = buildWarningAlert('Unexpected issue removing user.');
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
    const errMsg = printErrorMessage(error);
    msg = buildErrorAlert(`Unable to remove user: ${printGyet(user)}: "${errMsg}"`);
    logger.error(error);
  }
  finally { yield put(alertBarActions.DisplayAlertBox(msg)); }
}

export function* handleSignIn(action: PayloadAction<hasUsername>, count = 0): any
{
   const MAX_RETRIES = 10;

  /* Load User Data, then call initial or, regular based on found */
  logger.log('handling dispatched sign in event for', action);

  //yield put(alertBarActions.DisplayAlertBox(buildInfoAlert('Welcome!')));

  let data:   any;
  let userId: string | null;
  let email:  string | null;
  let attributes: any;
  try
  {
     data = yield call(getCurrentAmplifyUser);
     attributes = yield call(getAmplifyUserAttributes);
     logger.log(data);
     logger.log('User attributes:', attributes);
     userId = data.userId;
     email  = attributes?.email;
     
     if (!email)
     { throw new Error('Email attribute not found - user must have verified email'); }
  }
  catch (error)
  {
    logger.error('Unexpected Error getting current user.', error);
    userId = null;
    email  = null;
    attributes = null;
  }

  /*
   *  Get user ID if not found from Amplify
   *    1. Check the Payload Object passed in
   *    2. If that fails, wait half a second and try again.
   *       There is a race condition, sometimes login data isn't available yet.
   */
  if (!userId)
  {
     //use argument if amplify fails
     userId = action.payload.username;
     email  = action.payload.signInDetails?.loginId;
     
     if (!email) { logger.error('No email found in payload'); }

     if (!userId )
     {
        if ( count > MAX_RETRIES ) //failed to many times, quit
        {
           const errMsg = 'Unable to Sign In.  Redirecting to Home Page.';
           yield put(alertBarActions.DisplayAlertBox(buildErrorAlert(errMsg)));
           // Redirect to home page
           window.location.href = '/';
           return;
        }
        logger.warn('No userId found, retrying...');
        yield delay(500);
        return yield* handleSignIn(action, count+1);
     }
  }

  let response: { data: { getUser: null; }; };
  try { response = yield call(getUserById, userId); }
  catch(error)
  {
    logger.error(error);
    return;
  }
  if ( !response?.data ) { return; }

  let user: User;

  if ( null === response.data.getUser ) // initial Sign In
  {
    /*  Process First time Sign In for new user
     *  Steps:
     *    1. Create New User,
     *    2. Save New User,
     *    3. Stuff into App State
     */
    logger.log('handling dispatched initial sign in for:', data);

    /* disabled until clan is part of the sign-up form as a DropDown.
    let clan: typeof Clan | null = null;
    if ( data.payload.data.attributes["custom:clan"] )
    { clan = getClanFromName(data.payload.data.attributes["custom:clan"]) }
    */

    //if user is in the admin group from cognito, set admin flag
    let admin = data?.signInUserSession?.idToken?.payload['cognito:groups']
                     .includes(COGNITO_ADMIN_GROUP) ?? false;

    user = {
      ...emptyUser,
      id:      userId,
      email:   email!,
      name:    attributes?.name || MISSING_NAME_ERROR,
      waa:     attributes?.["custom:waa"],
      isAdmin: admin,
      clan:    null,
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
    if ( MISSING_NAME_ERROR === user.name ) //assume if name not supplied
    { //dispatch an action to get the missing data
      logger.log('Requesting more info before creating:', user);
      // amazonq-ignore-next-line
      yield put(userActions.promptForUserInfo(user));
      //return; //bail, the form should call create again.
    }
    else //TODO: look into transactions
    { //user Not found in Dynamo, create them, and default perms/resources
      logger.log('creating:', user);
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
    user = response.data.getUser;
    logger.log('handling dispatched sign in for (data):', data);
    logger.log('handling dispatched sign in for (user):', user);

    yield put(userActions.setUser(user));
    yield put(currentUserActions.setCurrentUser(user));
  }

  //now that we have a user object, found or created.
  // Only create user box if user has a valid name
  if ( MISSING_NAME_ERROR !== user.name )
  { yield call(createUserBox, user); }
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