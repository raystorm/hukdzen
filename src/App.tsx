import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';
import { SnackbarProvider } from "notistack";

import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils'
import amplifyConfig from './amplifyconfiguration.json';

import { authEventsProcessor } from "./app/AuthEventsProcessor";
import { getEnv, Environments, isDev } from "./utils/location";
import AppRoutes from './components/shared/AppRoutes';
import { theme }  from './components/shared/theme';
import './App.css';

import ResponsiveAppBar from './components/shared/ResponsiveAppBar';
import Footer from './components/shared/Footer';
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
] = amplifyConfig.oauth.redirectSignIn.split(",");

const [
    publishedRedirectSignOut,
    localRedirectSignOut,
    devRedirectSignOut,
    productionRedirectSignOut,
] = amplifyConfig.oauth.redirectSignOut.split(",");

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
    ...amplifyConfig,
    oauth: {
      //...awsConfig.oauth,
      domain: amplifyConfig.oauth.domain,
      scope: amplifyConfig.oauth.scope,
      //...updatedOAuth,
      redirectSignIn: updatedOAuth.oauth.redirectSignIn,
      redirectSignOut: updatedOAuth.oauth.redirectSignOut,
      responseType: amplifyConfig.oauth.responseType,
    }
}

Amplify.configure(updatedAwsConfig);
if ( isDev() )
{
   //console.log('NODE_ENV:', process.env.NODE_ENV);
   console.log(`Setting Updated Oauth: ${JSON.stringify(updatedAwsConfig.oauth)}`);
}

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
        "h4": { color: theme.palette.primary.light, },
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
               <Footer />
             </Router>
           </div>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
