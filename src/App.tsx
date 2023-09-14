import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import { Amplify, Auth, Hub } from 'aws-amplify';
import awsConfig from './aws-exports';

import { authEventsProcessor } from "./app/AuthEventsProcessor";

import './App.css';

import AppRoutes from './components/shared/AppRoutes';

import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/ResponsiveAppBar';
import AlertBar from "./AlertBar/AlertBar";
import useAuthorizer from "./components/widgets/UseAuthorizer";

/*
 * Amplify Redirect In/Out Updating, inspired by:
 * https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-frontend
 * Instructions for Setting Up OAuth in the Front end.
 */

/**
 *  Checks for LocalHost
 */
const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const ignoreCase = { sensitivity: 'accent' };

/**
 *  Helper function to verify a host name, in a case-insensitive manner
 *  @param hostname host to check
 */
const isHost = (hostname: string): boolean =>
{ return 0 === window.location.hostname.localeCompare(hostname,undefined, ignoreCase); }

enum env {
    local     = "local",
    dev       = "dev",
    prod      = "prod",
    published = "published"
}

/**
 *  Return an enum of the Environment.
 */
const getEnv = (): env =>
{
    if ( isHost("Smalgyax-Files.org") ) { return env.published }
    if ( isHost("prod.d1nnyhcu0aulq5.amplifyapp.com") ) { return env.prod }
    if ( isHost("dev.d1nnyhcu0aulq5.amplifyapp.com") ) { return env.dev }
    if ( isLocalhost ) { return env.local }

    //redirect to Prod for safety (this should probably error)
    return env.published;
}

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
        case env.local:
            return localRedirectSignIn;
        case env.dev:
            return devRedirectSignIn;
        case env.prod:
            return productionRedirectSignIn;
        case env.published:
            return publishedRedirectSignIn;
    }
}

const redirectSignOut = () => {
    switch (getEnv())
    {
        case env.local:
            return localRedirectSignOut;
        case env.dev:
            return devRedirectSignOut;
        case env.prod:
            return productionRedirectSignOut;
        case env.published:
            return publishedRedirectSignOut;
    }
}

const updatedAwsConfig = {
    ...awsConfig,
    oauth: {
        ...awsConfig.oauth,
        redirectSignIn: redirectSignIn(),
        redirectSignOut: redirectSignOut(),
    }
}

Amplify.configure(updatedAwsConfig);

Hub.listen('auth', authEventsProcessor);

function App() 
{
  useAuthorizer();

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
    <div className="App">
     <Router>
      <header>
        <ResponsiveAppBar />
      </header>
      <AlertBar />
      <section>
        {/* moved routes to separate file for ease of maintenance  */}
        <AppRoutes />
      </section>
     <footer>
      <div style={{clear: 'both'}}>
        <hr style={{margin: '10px'}}/>
         <ul>
            <li style={{display: 'inline-block'}}><a href='/Privacy-Policy.html'>Privacy Policy</a></li>
         </ul>
        <hr style={{margin: '10px'}}/>
        <p>Copyright (c) 2023 Smalgyax-Files.org</p>
      </div>
     </footer>
     </Router>
    </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
