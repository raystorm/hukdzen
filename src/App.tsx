import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import { useAuthenticator } from '@aws-amplify/ui-react'

import './App.css';

import AppRoutes from './components/shared/AppRoutes';

import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/ResponsiveAppBar';
import {useAppSelector} from "./app/hooks";
import {Gyet} from "./User/userType";
import {API} from "aws-amplify";
import {GraphQLQuery} from "@aws-amplify/api";
import {GetGyetQuery, GetXbiisQuery} from "./types/AmplifyTypes";
import * as queries from "./graphql/queries";

function App() 
{
  const { route, user } = useAuthenticator(context => [context.route, context.user]);

  const gyet = useAppSelector(state => state.user)

   /*
  if ( route == 'authenticated' && user.username && gyet.id != user.username )
  {
     / *
      *   1. Lookup DB version
      *   2. If found merge
      *      a. update email
      *      b. updatedAt with current time
      *   3. else create from Scratch
      *   4. update DB
      * /

     let dbUser = null;

     const fetchUser = async (id: string) => {
         const tempUser = await API.graphql<GraphQLQuery<GetGyetQuery>>({
           query: queries.getGyet,
           variables: {id: id}
        });
        dbUser = tempUser;
     };

     const dbUser = fetchUser(user.username);

     const updaterUser: Gyet = {
        ...dbUser,
        email: user.attributes!.email,
        updatedAt: new Date().toISOString(),
     }
  }
  // */


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
      <ResponsiveAppBar />
      <header />
     <section>
      {/* moved routes to seperate file for ease of maintenance  */}
      <AppRoutes />
     </section>
     <footer>
      <div style={{clear: 'both'}}>
        <hr style={{margin: '10px'}}/>
        <p>TODO: Copyright (c) ... here</p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a className="App-link" href="https://reactjs.org/" target="_blank"
             rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a className="App-link" href="https://redux.js.org/" target="_blank"
             rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a className="App-link" href="https://redux-toolkit.js.org/" 
             target="_blank" rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a className="App-link" href="https://react-redux.js.org/" 
             target="_blank" rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </div>
     </footer>
     </Router>
    </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
