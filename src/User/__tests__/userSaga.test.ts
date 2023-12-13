import {API, Auth} from "aws-amplify";
import {waitFor} from "@testing-library/react";

import ReduxStore from "../../app/store";
import {loadTestStore} from "../../__utils__/testUtilities";
import {CreateUserInput} from "../../types/AmplifyTypes";
import {currentUserActions} from "../currentUserSlice";
import {userActions} from "../userSlice";
import {emptyUser, User} from "../userType";
import {
   setCreatedUser,
   setGetUser,
   setupAmplifyUserMocking,
   setupUserMocking
} from "../../__utils__/__fixtures__/UserAPI.helper";

jest.mock('aws-amplify');
jest.mock('../../app/store');

describe('UserSaga', () =>
{
   let store;
   beforeEach(() => {
      //create an Empty store object for tests
      store = loadTestStore({});
   });

   test('SignIn action runs initialSignIn correctly for normal user',
        async () =>
   {
      const GUID = 'TEST-GUID_HERE'
      const authData = {
         username: GUID,
         signInUserSession: {
            idToken: { payload: {'cognito:groups': ['foo']} }
         },
         attributes:
         {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const userData = {
         data: {
            getUser: null,
            username: GUID,
         }
      };

      const user: CreateUserInput = {
         id: authData.username,
         name: authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: false,
      };

      //setGetUser(userData);
      setCreatedUser({ ...user, ...emptyUser });
      //setupAmplifyUserMocking();
      setupUserMocking();

      //@ts-ignored
      Auth.currentAuthenticatedUser.mockResolvedValueOnce(authData);
      //@ts-ignored
      API.graphql.mockResolvedValueOnce(userData);

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => {
         //user check, create user
         expect(API.graphql).toBeCalledTimes(3);
      });

      const input = { variables: { input: user } };
      expect(API.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   test('SignIn action runs initialSignIn correctly for normal admin',
        async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
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
         data: {
            getUser: null,
            username: GUID,
         }
      };

      const user: CreateUserInput = {
         id:    authData.username,
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: true,
      };

      //setGetUser(userData);
      setCreatedUser({ ...user, ...emptyUser });
      //setupAmplifyUserMocking();
      setupUserMocking();

      // @ts-ignore
      Auth.currentAuthenticatedUser.mockResolvedValueOnce(authData);
      // @ts-ignore
      API.graphql.mockResolvedValueOnce(userData);
                 //.mockResolvedValueOnce('TEST SUCCESS');
      //.mockResolvedValue(userData);

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => {
         //user check, create user, create default Box Access
         expect(API.graphql).toBeCalledTimes(2);
      });
      const input = { variables: { input: user } };
      expect(API.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   test('SignIn action runs signInProcessor correctly',
      async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         //May need to change this line for accuracy
         signInUserSession: {
            idToken: { payload: {'cognito:groups': ['foo']} }
         },
         attributes:
         {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const userData = {
         data: {
            getUser: {
               id:    GUID,
               name:  'TEST',
               waa:   'WIE WA!',
               email: 'test@example.com',
            },
            username: GUID,
         }
      };

      // @ts-ignore
      Auth.currentAuthenticatedUser.mockResolvedValueOnce(userData);
      // @ts-ignore
      API.graphql.mockResolvedValue(userData);

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => { expect(API.graphql).toBeCalledTimes(1); });
      await waitFor(() => {
         //sign in, set user, set current user
         //expect(store.dispatch).toHaveBeenCalledTimes(3);
         //check user ids set, assume user obj create correctly.
         expect(store.getState().user.id).toBe(authData.username);
      });
      expect(store.getState().currentUser.id).toBe(authData.username);
   });

   test('SignIn action skips processing on error',async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         signInUserSession: {
            idToken: { payload: {'cognito:groups': ['foo']} }
         },
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

      const userData = {
         data: {
            getUser: null,
            username: GUID,
         }
      };

      // @ts-ignore
      Auth.currentAuthenticatedUser.mockResolvedValueOnce(userData);
      // @ts-ignore
      API.graphql.mockRejectedValueOnce('FORCED TEST FAILURE');

      store.dispatch(currentUserActions.signIn(authData));
      await waitFor(() => { expect(API.graphql).toBeCalledTimes(1); });
      expect(ReduxStore.dispatch).not.toHaveBeenCalledWith(userActions.setUser(user));
   });

})