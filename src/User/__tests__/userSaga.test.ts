import {waitFor} from "@testing-library/react";
import {when} from "jest-when";
import {call, put} from "redux-saga/effects";

import {generateClient} from "@aws-amplify/api";
import {getCurrentUser, GetCurrentUserOutput} from "aws-amplify/auth";

import {
   setCreatedUser, setGetUser, setupUserMocking
} from "../../__utils__/__fixtures__/UserAPI.helper";

import {setupStore, start} from "../../app/store";
import {getUserById, handleSignIn} from "../userSaga";

import {CreateUserInput} from "../../types/AmplifyTypes";
import {emptyUser, User} from "../userType";

import {currentUserActions} from "../currentUserSlice";
import {userActions} from "../userSlice";


jest.mock('aws-amplify/auth');
jest.mock('@aws-amplify/api');
const client = generateClient();

let started = false;

const loadTestStore = (state: any) => {
   const store = setupStore(state);
   store.dispatch = jest.fn(store.dispatch);
   if (!started)
   {
      start(); //start running the sagas/store
      started = true;
   }
   return store;
}

describe('UserSaga', () =>
{
   test('SignIn action runs initialSignIn correctly for normal user',
        async () =>
   {
      const store = loadTestStore({});
      const GUID = 'TEST-GUID_HERE'
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

      const userData = {
         data: { getUser: null, username: GUID, }
      };

      const user: CreateUserInput = {
         id: authData.username,
         name: authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: false,
      };

      setCreatedUser({ ...user, ...emptyUser });
      setupUserMocking();

      when(getCurrentUser).mockResolvedValue(authData);
      when(client.graphql).calledWith(expect.anything())
                          .mockResolvedValueOnce(userData);

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => {
         //user check, create user
         expect(client.graphql).toBeCalledTimes(3);
      });

      const input = { variables: { input: user } };
      expect(client.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   test('SignIn action runs initialSignIn correctly for normal admin',
        async () =>
   {
      const store = loadTestStore({});
      const GUID = 'TEST-GUID'
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

      const userData = {
         data: { getUser: null, username: GUID, }
      };

      const user: CreateUserInput = {
         id:    authData.username,
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: true,
      };

      setCreatedUser({ ...user, ...emptyUser });
      setupUserMocking();

      when(getCurrentUser).calledWith().mockResolvedValueOnce(authData);
      when(client.graphql).calledWith(expect.anything())
                          .mockResolvedValueOnce(userData);

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => {
         //user check, create user, create default Box Access
         expect(client.graphql).toBeCalledTimes(2);
      });
      const input = { variables: { input: user } };
      expect(client.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   /**
    *  Switched from working via Dispatching actions,
    *  to directly calling the Saga handler,
    *  because put() doesn't properly set state in testing.
    */
   test.skip('SignIn action runs correctly for returning users',
             async () =>
   {
      const store = loadTestStore({});
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
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes["custom:waa"],
         isAdmin: false,
      };

      const userData = {
         data: {
            getUser: user,
            username: GUID,
         }
      };

      setGetUser(user)
      setupUserMocking();

      when(getCurrentUser).mockResolvedValue(authData);

      store.dispatch(currentUserActions.signIn(authData));
      console.log(`User: ${JSON.stringify(store.getState().user)}`);
      await waitFor(() => {
         //sign in, set user, set current user
         //expect(store.dispatch).toHaveBeenCalledTimes(3);
         //check user ids set, assume user obj create correctly.
         expect(store.getState().user.id).toEqual(authData.username);
      }, {timeout: 2000});
      console.log(`User: ${JSON.stringify(store.getState().user)}`);
      expect(store.getState().currentUser.id).toEqual(authData.username);
   }, 10000);

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

      const userData = {
         data: { getUser: user, username: GUID, }
      };

      //setup mocking functions w/data
      setGetUser(user)
      setupUserMocking();
      when(getCurrentUser).mockResolvedValue(authData);

      const gen = handleSignIn(authData);

      //getCurrentAmplifyUser
      await expect(gen.next().value).resolves.toEqual(authData);

      expect(gen.next(authData).value).toEqual(call(getUserById, authData.userId));

      // amazonq-ignore-next-line
      expect(gen.next(userData).value).toEqual(put(userActions.setUser(user)));
      expect(gen.next(userData).value)
        .toEqual(put(currentUserActions.setCurrentUser(user)));

      expect(gen.next().done).toBeTruthy();
   });

   test('SignIn action stops processing on error',
        async () =>
   {
      const GUID = 'TEST-GUID'
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

      //setup mocking functions w/data
      when(getCurrentUser).mockResolvedValue(authData);
      when(client.graphql).calledWith(expect.anything())
                          .mockRejectedValueOnce('FORCED TEST FAILURE');

      //call the handler directly, more reliable to verify when processing stops
      const gen = handleSignIn(authData);

      //getCurrentAmplifyUser
      await expect(gen.next().value).resolves.toEqual(authData);

      //hits the error
      expect(gen.next(authData).value).toEqual(call(getUserById, authData.userId));

      //stops processing
      expect(gen.next().done).toBeTruthy();
   });

})