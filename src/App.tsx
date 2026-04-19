import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';
import { SnackbarProvider } from "notistack";

import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils'
import type { ResourcesConfig } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

import { authEventsProcessor } from "./app/AuthEventsProcessor";
import { getEnv, Environments, isDev } from "./utils/location";
import { logger } from "./utils/logger";
import AppRoutes from './components/shared/AppRoutes';
import { theme }  from './components/shared/theme';
import './App.css';

import ResponsiveAppBar from './components/shared/ResponsiveAppBar';
import Footer from './components/shared/Footer';
import AlertBarNotifier from "./AlertBar/AlertBarNotifier";
import { AlertView } from "./AlertBar/AlertView";
import { FederatedUserDialog } from "./components/widgets/FederatedUserDialog";

/*
 * Amplify Redirect In/Out Updating, inspired by:
 * https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-frontend
 * Instructions for Setting Up OAuth in the Front end.
 *
 * moved host checking logic to separate file for cleanliness/re-usability
 */

//build Arrays of In/Out URIs in Order:  Prod Domain, Localhost, Dev, Prod Internal Domain

// Configure Amplify with environment-specific OAuth redirects
const getCurrentUrl = () => {
   switch (getEnv()) {
      case Environments.local:
         return 'http://localhost:3000/';
      case Environments.dev:
         return 'https://dev.smalgyax-files.org/';
      case Environments.prod:
      case Environments.published:
      default:
         return 'https://smalgyax-files.org/';
   }
};

const config: ResourcesConfig = {
   ...outputs,
   Auth: {
      Cognito: {
         ...outputs.auth,
         loginWith: {
            oauth: outputs.auth?.oauth ? {
               ...outputs.auth.oauth,
               redirectSignIn: [getCurrentUrl()],
               redirectSignOut: [getCurrentUrl()],
            } : undefined,
         },
      },
   },
   custom: outputs.custom,
};

Amplify.configure(config);
if ( isDev() )
{
   logger.log('Using Amplify Gen 2 configuration');
   logger.log('Region:', outputs.auth?.aws_region);
   logger.log('User Pool:', outputs.auth?.user_pool_id);
   logger.log('OAuth redirects:', getCurrentUrl());
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
               default: AlertView, info: AlertView, success: AlertView,
               warning: AlertView, error: AlertView,
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
