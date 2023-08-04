import { handleSignInEvent, handleSignOut, authEventsProcessor } from "../AuthEventsProcessor";
import {API} from "aws-amplify";

import ReduxStore from "../store";
import {waitFor} from "@testing-library/react";
import {currentUserActions} from "../../User/currentUserSlice";

jest.mock('aws-amplify');
jest.mock('../store');

describe('AuthEventsProcessor', () =>
{
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

   test('handleSignInEvent dispatches the sign in action properly',
        async () =>
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

      const userData = {
         data: {
           getUser: null,
           username: GUID,
         }
      };

      // @ts-ignore
      API.graphql.mockReturnValueOnce(Promise.resolve(userData))
                 .mockReturnValueOnce(Promise.resolve('TEST SUCCESS'));
                 //.mockReturnValue(Promise.resolve(userData));

      handleSignInEvent(authData);

      await waitFor(() => {
         expect(ReduxStore.dispatch)
           .toHaveBeenCalledWith(currentUserActions.signIn(authData));
      });
   });
})