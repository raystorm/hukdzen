import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';
import { SnackbarProvider } from "notistack";

import { Amplify, Hub } from 'aws-amplify';
import awsConfig from './aws-exports';

import { authEventsProcessor } from "./app/AuthEventsProcessor";
import { getEnv, Environments } from "./components/shared/location";
import AppRoutes from './components/shared/AppRoutes';
import { theme }  from './components/shared/theme';
import './App.css';

import ResponsiveAppBar from './components/shared/ResponsiveAppBar';
import AlertBarNotifier from "./AlertBar/AlertBarNotifier";
import {AlertMessage} from "./AlertBar/AlertMessage";
import {FederatedUserDialog} from "./components/widgets/FederatedUserDialog";

/*
 * Amplify Redirect In/Out Updating, inspired by:
 * https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-frontend
 * Instructions for Setting Up OAuth in the Front end.
 *
 * moved host checking logic to separate file for cleanliness/re-usability
 */

//build Arrays of In/Out URIs in Order:  Prod Domain, Localhost, Dev, Prod Internal Domain

const [
    publishedRedirectSignIn,
    localRedirectSignIn,
    devRedirectSignIn,
    productionRedirectSignIn,
] = awsConfig.oauth.redirectSignIn.split(",");

const [
    publishedRedirectSignOut,
    localRedirectSignOut,
    devRedirectSignOut,
    productionRedirectSignOut,
] = awsConfig.oauth.redirectSignOut.split(",");

const redirectSignIn = () => {
    switch (getEnv())
    {
        case Environments.local:
            return localRedirectSignIn;
        case Environments.dev:
            return devRedirectSignIn;
        case Environments.prod:
            return productionRedirectSignIn;
        case Environments.published:
        default: //default to published for safety
            return publishedRedirectSignIn;
    }
}

const redirectSignOut = () => {
    switch (getEnv())
    {
        case Environments.local:
            return localRedirectSignOut;
        case Environments.dev:
            return devRedirectSignOut;
        case Environments.prod:
            return productionRedirectSignOut;
        case Environments.published:
        default: //default to published for safety
            return publishedRedirectSignOut;
    }
}

const updatedOAuth = {
    oauth: {
        redirectSignIn: redirectSignIn(),
        redirectSignOut: redirectSignOut(),
    }
}

const updatedAwsConfig = {
    ...awsConfig,
    oauth: {
      //...awsConfig.oauth,
      domain: awsConfig.oauth.domain,
      scope: awsConfig.oauth.scope,
      //...updatedOAuth,
      redirectSignIn: updatedOAuth.oauth.redirectSignIn,
      redirectSignOut: updatedOAuth.oauth.redirectSignOut,
      responseType: awsConfig.oauth.responseType,
    }
}

Amplify.configure(updatedAwsConfig);
console.log(`Setting Updated Oauth: ${JSON.stringify(updatedAwsConfig.oauth)}`);

Hub.listen('auth', authEventsProcessor);

function App() 
{
  //useAuthorizer();

   //NOTE: should the providers move to index?
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{
        "h2":
        {
          textDecorationLine: "underline",
          textDecorationColor: theme.palette.secondary.main
        },
        "hr":
        {
          color: theme.palette.secondary.main,
          backgroundColor: theme.palette.secondary.main,
          height: '2px'
        }
      }}
      />
      <LocalizationProvider
            dateAdapter={AdapterDateFns} adapterLocale={enUS}>
        <SnackbarProvider maxSnack={3}
           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
           Components={{
               default: AlertMessage, info: AlertMessage, success: AlertMessage,
               warning: AlertMessage, error: AlertMessage,
           }}
        >
           <FederatedUserDialog />
           <div className="App">
             <Router>
               <header>
                 <ResponsiveAppBar />
               </header>
                <AlertBarNotifier />
               <section>
                 {/* moved routes to separate file for ease of maintenance  */}
                 <AppRoutes />
               </section>
               <footer>
                 <div style={{clear: 'both'}}>
                   <hr style={{margin: '10px'}}/>
                    <ul>
                      <li style={{display: 'inline-block'}}>
                        <a href='/Privacy-Policy.html'>Privacy Policy</a>
                      </li>
                    </ul>
                   <hr style={{margin: '10px'}}/>
                   <p>Copyright (c) 2023 Smalgyax-Files.org</p>
                 </div>
               </footer>
             </Router>
           </div>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
