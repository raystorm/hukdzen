import { vi } from 'vitest';
import * as matchers from 'redux-saga-test-plan/matchers';
import {expectSaga} from "redux-saga-test-plan";
import {throwError} from "redux-saga-test-plan/providers";

import {generateClient} from '@aws-amplify/api';

import {setupStore, start} from "../../app/store";
import {getCurrentAmplifyUser, getUserById, handleSignIn} from "../userSaga";

import {CreateUserInput} from "../../types/AmplifyTypes";
import {emptyUser, User} from "../userType";

import {currentUserActions} from "../currentUserSlice";
import {userActions} from "../userSlice";

const client = generateClient();

let started = false;

const loadTestStore = (state: any) => {
   const store = setupStore(state);
   store.dispatch = vi.fn(store.dispatch);
   if (!started)
   {
      start(); //start running the sagas/store
      started = true;
   }
   return store;
}

describe('UserSaga', () =>
{
   beforeEach(() => {
      vi.clearAllMocks();
   });

   test('SignIn action runs initialSignIn correctly for normal user',
        async () =>
   {
      const store = loadTestStore({});
      const GUID = 'TEST-GUID_HERE';
      const authData = {
         username: GUID,
         userId: GUID,
         tokens: { idToken: { payload: {'cognito:groups': ['foo']} } },
         attributes:
         {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const userData = { data: { getUser: null, username: GUID, } };

      const user = {
         __typename: 'User',
         id:      authData.username,
         name:    authData.attributes.name,
         email:   authData.attributes.email,
         waa:     authData.attributes['custom:waa'],
         isAdmin: false,
         //createdAt: expect.anything(), //TODO: narrow to Date/Time range
         //updatedAt: expect.anything(),
      };

      const payload = { payload: authData };

      return expectSaga(handleSignIn, payload )
         .provide([
            [matchers.call.fn(getCurrentAmplifyUser), authData],
            [matchers.call.fn(getUserById), userData]
         ])
         .call(getUserById, authData.userId)
         .put.like({ action: { type: userActions.setUser.type, payload: user }})
         .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
         .put.like({ action: { type: userActions.createUser.type, payload: user }})
         .run()
   });

   test('SignIn action runs initialSignIn correctly for admin',
        async () =>
   {
      const store = loadTestStore({});
      const GUID = 'TEST-GUID';
      const authData = {
         username: GUID,
         userId: GUID,
         signInUserSession: {
            idToken: { payload: {'cognito:groups': ['WebAppAdmin']} }
         },
         attributes: {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const userData = { data: { getUser: null, username: GUID, } };

      const user: CreateUserInput = {
         id:    authData.username,
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: true,
      };

      const payload = { payload: authData };

      return expectSaga(handleSignIn, payload )
               .provide([
                           [matchers.call.fn(getCurrentAmplifyUser), authData],
                           [matchers.call.fn(getUserById), userData]
                        ])
               .call(getUserById, authData.userId)
               .put.like({ action: { type: userActions.setUser.type, payload: user }})
               .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
               .put.like({ action: { type: userActions.createUser.type, payload: user }})
               .run()
   });

   /**
    *  Test the SignIn Action Directly,
    *  because side-effects like put(), don't seem to work properly in testing.
    */
   test('SignIn Action handles returning users correctly',
        async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         userId: GUID,
         //May need to change this line for accuracy
         tokens: { idToken: { payload: {'cognito:groups': ['foo']} } },
         attributes:
         {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const user: User = {
         ...emptyUser,
         id: GUID,
         name: authData.attributes.name,
         email: authData.attributes.email,
         waa: authData.attributes["custom:waa"],
         isAdmin: false,
      };

      const userData = { data: { getUser: user, username: GUID, } };

      const payload = { payload: authData };

      return expectSaga(handleSignIn, payload )
               .provide([
                           [matchers.call.fn(getCurrentAmplifyUser), authData],
                           [matchers.call.fn(getUserById), userData]
                        ])
               .call(getUserById, authData.userId)
               .put.like({ action: { type: userActions.setUser.type, payload: user }})
               .put.like({ action: { type: currentUserActions.setCurrentUser.type, payload: user }})
               .run()
   });

   test('SignIn action stops processing on error',
        async () =>
   {
      const GUID = 'TEST-GUID';
      const authData= {
         username: GUID,
         userId: GUID,
         signInUserSession: { idToken: { payload: {'cognito:groups': ['foo']} } },
         attributes:
         {
           email: 'test@example.com',
           name:  'TEST',
           "custom:waa": 'WIE WA!',
         }
      };

      const user: User = {
         ...emptyUser,
         id: authData.username,
         name: authData.attributes.name,
         email: authData.attributes.email,
         waa: authData.attributes["custom:waa"],
      };

      const payload = { payload: authData };

      return expectSaga(handleSignIn, payload )
         .provide([
                     [matchers.call.fn(getCurrentAmplifyUser), authData],
                     [ matchers.call.fn(getUserById),
                       throwError(new Error('FORCED TEST FAILURE')) ]
                  ])
         .call(getUserById, authData.userId)
         .not.put.like({ action: { type: userActions.setUser.type }})
         .not.put.like({ action: { type: currentUserActions.setCurrentUser.type }})
         .run()
   });

})