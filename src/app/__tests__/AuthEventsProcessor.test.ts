import {waitFor} from "@testing-library/react";
import {when} from "jest-when";

import {generateClient} from "@aws-amplify/api";
import { handleSignInEvent, authEventsProcessor } from "../AuthEventsProcessor";

import ReduxStore from "../store";
import {currentUserActions} from "../../User/currentUserSlice";

jest.mock('@aws-amplify/api');
jest.mock('../store');

const client = generateClient();

describe('AuthEventsProcessor', () =>
{
   test('AuthEventsProcessor processes `signIn` events',
        () =>
   {
      const badEvent = {
         payload: {
            event: 'signIn',
            data: { username: 'test' }
         }
      };

      // @ts-ignore
      client.graphql.mockReturnValue(Promise.resolve({}));

      const processed = authEventsProcessor(badEvent)

      expect(processed).toBe(badEvent);
   });

   test('AuthEventsProcessor processes `signOut` events',
        () =>
   {
      const badEvent = { payload: { event: 'signOut' } };
      const processed = authEventsProcessor(badEvent)

      expect(processed).toBe(badEvent);
   });

   test('AuthEventsProcessor ignores unknown auth events',
        () =>
   {
      const badEvent = { payload: { event: 'TEST' } };
      const processed = authEventsProcessor(badEvent);

      expect(processed).toBe(badEvent);
   });

   test('handleSignInEvent dispatches the sign in action properly',
        async () =>
   {
      const GUID = 'TEST-GUID'
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

      when(client.graphql)
        .calledWith(expect.anything())
        .mockResolvedValueOnce(userData)
        // @ts-ignore
        .mockResolvedValueOnce('TEST SUCCESS');

      handleSignInEvent(authData);

      await waitFor(() => {
         expect(ReduxStore.dispatch)
           .toHaveBeenCalledWith(currentUserActions.signIn(authData));
      });
   });
})