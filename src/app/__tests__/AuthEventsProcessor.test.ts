import { handleSignInEvent, handleSignOut, authEventsProcessor } from "../AuthEventsProcessor";
import {API} from "aws-amplify";
import {CreateGyetInput} from "../../types/AmplifyTypes";

import ReduxStore from "../store";
import {waitFor} from "@testing-library/react";

jest.mock('aws-amplify');
jest.mock('../store');

describe('AuthEventsProcessor', () => {

   test('AuthEventsProcessor processes `signIn` events', () =>{
      const badEvent = { payload: { event: 'signIn',
                                                             data: { username: 'test' } } };

      // @ts-ignore
      API.graphql.mockReturnValue(Promise.resolve({}));

      const processed = authEventsProcessor(badEvent)

      expect(processed).toBe(badEvent);
   });

   test('AuthEventsProcessor processes `signOut` events', () =>{
      const badEvent = { payload: { event: 'signOut' } };
      const processed = authEventsProcessor(badEvent)

      expect(processed).toBe(badEvent);
   });

   test('AuthEventsProcessor ignores unknown auth events', () =>{
      const badEvent = { payload: { event: 'TEST' } };
      //handleSignInEvent = jest.fn();
      //handleSignOut = jest.fn();
      const processed = authEventsProcessor(badEvent);

      //expect(handleSignInEvent).not.toBeCalled();
      //expect(handleSignOut).not.toBeCalled();

      expect(processed).toBe(badEvent);
   });

   test('handleSignInEvent runs initialSignIn correctly for normal user',
        async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         signInUserSession: { idToken: { payload: {'cognito:groups': ['foo']}}},
         attributes:
         {
            email: 'test@example.com',
            name:  'TEST',
            "custom:waa": 'WIE WA!',
         }
      };

      const userData = {
         data: {
           getGyet: null,
           username: GUID,
         }
      };

      // @ts-ignore
      API.graphql.mockReturnValueOnce(Promise.resolve(userData))
                 .mockReturnValueOnce(Promise.resolve('TEST SUCCESS'));
                 //.mockReturnValue(Promise.resolve(userData));

      handleSignInEvent(authData);

      await waitFor(() =>{
         expect(ReduxStore.dispatch).not.toHaveBeenCalled();
      });
      await waitFor(() => {
         expect(API.graphql).toBeCalledTimes(2);
      });

      const user: CreateGyetInput = {
         id: authData.username,
         name: authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: false,
      };

      const input = { variables: { input: user } };
      expect(API.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   test('handleSignInEvent runs initialSignIn correctly for normal admin',
      async () =>
   {
      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         signInUserSession: { idToken: { payload: {'cognito:groups': ['WebAppAdmin']}}},
         attributes:
            {
               email: 'test@example.com',
               name:  'TEST',
               "custom:waa": 'WIE WA!',
            }
      };

      const userData = {
         data: {
            getGyet: null,
            username: GUID,
         }
      };

      // @ts-ignore
      API.graphql.mockReturnValueOnce(Promise.resolve(userData))
         .mockReturnValueOnce(Promise.resolve('TEST SUCCESS'));
      //.mockReturnValue(Promise.resolve(userData));

      handleSignInEvent(authData);

      await waitFor(() =>{
         expect(ReduxStore.dispatch).not.toHaveBeenCalled();
      });
      await waitFor(() => {
         expect(API.graphql).toBeCalledTimes(2);
      });

      const user: CreateGyetInput = {
         id:    authData.username,
         name:  authData.attributes.name,
         email: authData.attributes.email,
         waa:   authData.attributes['custom:waa'],
         isAdmin: true,
      };

      const input = { variables: { input: user } };
      expect(API.graphql).toHaveBeenCalledWith(expect.objectContaining(input));
   });

   test('handleSignInEvent runs signInProcessor correctly',
        async () =>
   {
      jest.mock('../store');

      const GUID = 'TEST-GUID'
      const authData = {
         username: GUID,
         //May need to change this line for accuracy
         signInUserSession: { idToken: { payload: {'cognito:groups': ['foo']}}},
         attributes:
            {
               email: 'test@example.com',
               name:  'TEST',
               "custom:waa": 'WIE WA!',
            }
      };

      const userData = {
         data: {
            getGyet: {},
            username: GUID,
         }
      };

      // @ts-ignore
      API.graphql.mockReturnValueOnce(Promise.resolve(userData))
         .mockReturnValueOnce(Promise.resolve('TEST SUCCESS'));

      handleSignInEvent(authData);
      await waitFor(() => {
         expect(API.graphql).toBeCalledTimes(1);
      });
      await waitFor(() => {
         expect(ReduxStore.dispatch).toHaveBeenCalledTimes(2);
      });
   });

   test('handleSignInEvent skips processing on error',
      async () =>
      {
         jest.mock('../store');

         const GUID = 'TEST-GUID'
         const authData = {
            username: GUID,
            signInUserSession: { idToken: { payload: {'cognito:groups': ['foo']}}},
            attributes:
               {
                  email: 'test@example.com',
                  name:  'TEST',
                  "custom:waa": 'WIE WA!',
               }
         };

         API.graphql // @ts-ignore
            .mockReturnValueOnce(Promise.reject('FORCED TEST FAILURE'));

         handleSignInEvent(authData);
         expect(ReduxStore.dispatch).not.toHaveBeenCalled();
         await waitFor(() => {
            expect(API.graphql).toBeCalledTimes(1);
         });
      });

})