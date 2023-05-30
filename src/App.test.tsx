import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ReduxStore from './app/store';
import App from './App';
import { contains } from './__utils__/testUtilities';
import {Authenticator} from "@aws-amplify/ui-react";
import {API, Auth} from "aws-amplify";
import {emptyGyet} from "./User/userType";


jest.mock('aws-amplify');

test('renders Copyright statement', () => {
   const response = {
      signInUserSession: {
         idToken: { payload: { "cognito:groups" : ['foo'] } }
      }
   }

   //@ts-ignore
   Auth.currentAuthenticatedUser.mockReturnValue(Promise.resolve(response));
   //@ts-ignore
   API.graphql.mockReturnValue(Promise.resolve(emptyGyet));

   render(
    <Provider store={ReduxStore}>
       <Authenticator.Provider>
          <App />
       </Authenticator.Provider>
    </Provider>
  );

  expect(screen.getByText(contains('Copyright'))).toBeInTheDocument();
});
