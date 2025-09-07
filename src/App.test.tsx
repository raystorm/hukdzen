import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from "vitest-when";

import { Authenticator }  from '@aws-amplify/ui-react';
import { generateClient } from '@aws-amplify/api';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

import ReduxStore from './app/store';
import App from './App';
import {contains} from './__utils__/testUtilities';
import {emptyUser} from "./User/userType";


vi.mock('aws-amplify/auth');
vi.mock('aws-amplify/storage');
const client = generateClient();

describe('App', () => {

   test('renders Copyright statement', () => {

      const token = {
         idToken: { payload: { "cognito:groups" : ['foo'] } }
      };

      const response = {
         username: 'test',
         userId:   'test',
         tokens: {
            idToken: { payload: { "cognito:groups" : ['foo'] } },
            accessToken: { payload: { "cognito:groups" : ['foo'] } }
         },
      }

      when(getCurrentUser).calledWith().thenResolve(response);
      when(fetchAuthSession).calledWith().thenResolve(response);
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve({ data: emptyUser });

      render(
       <Provider store={ReduxStore}>
          <Authenticator.Provider>
             <App />
          </Authenticator.Provider>
       </Provider>
     );

     expect(screen.getByText(contains('Copyright'))).toBeInTheDocument();
   });

   test('mocks Amplify correctly', () =>
   {
      //console.log(`generateClient: ${JSON.stringify(generateClient)}`);
      console.log(`generateClient: ${generateClient}`);
      expect(vi.isMockFunction(generateClient)).toBeFalsy();
      expect(vi.isMockFunction(client)).toBeFalsy();

      console.log(`client: ${client}`);
      //console.log(JSON.stringify(client));

      expect(client).toHaveProperty('graphql');
      expect(vi.isMockFunction(client.graphql)).toBeTruthy()
      expect(client.graphql).not.toHaveBeenCalled();
      expect(getCurrentUser).not.toHaveBeenCalled();
   });
});