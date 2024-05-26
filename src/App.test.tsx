import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import {when} from "jest-when";

import {Authenticator} from "@aws-amplify/ui-react";
import {generateClient} from "@aws-amplify/api";
import {fetchAuthSession, getCurrentUser} from "aws-amplify/auth";
import {getUrl, downloadData, copy, remove, uploadData} from "aws-amplify/storage";

import ReduxStore from './app/store';
import App from './App';
import {contains} from './__utils__/testUtilities';
import {emptyUser} from "./User/userType";

//jest.mock('aws-amplify');
jest.mock('@aws-amplify/api');
jest.mock('aws-amplify/auth');
jest.mock('aws-amplify/storage');
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

      when(getCurrentUser).calledWith().mockResolvedValue(response);
      when(fetchAuthSession).calledWith().mockResolvedValue(response);
      when(client.graphql).calledWith(expect.anything())
                          .mockResolvedValue({ data: emptyUser });

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
      expect(jest.isMockFunction(generateClient)).toBeFalsy();
      expect(jest.isMockFunction(client)).toBeFalsy();

      console.log(`client: ${client}`);
      //console.log(JSON.stringify(client));

      expect(client).toHaveProperty('graphql');
      expect(jest.isMockFunction(client.graphql)).toBeTruthy()
      expect(client.graphql).not.toHaveBeenCalled();
      expect(getCurrentUser).not.toHaveBeenCalled();
   });
});