import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ReduxStore from './app/store';
import App from './App';
import { contains } from './__utils__/testUtilities';
import {Authenticator} from "@aws-amplify/ui-react";
import {Auth} from "aws-amplify";


jest.mock('aws-amplify');

test('renders Copyright statement', () => {
   const response = {
      signInUserSession: {
         idToken: { payload: { "cognito:groups" : [] } }
      }
   }

   //@ts-ignore
   Auth.currentAuthenticatedUser.mockReturnValue(Promise.resolve(response));

   render(
    <Provider store={ReduxStore}>
       <Authenticator.Provider>
          <App />
       </Authenticator.Provider>
    </Provider>
  );

  expect(screen.getByText(contains('Copyright'))).toBeInTheDocument();
});
