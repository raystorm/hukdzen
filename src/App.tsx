import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enUSLocale from 'date-fns/esm/locale/en-US/index.js';

import './App.css';

import ErrorPage from './components/pages/ErrorPage';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import ItemPage from './components/pages/ItemPage';
import UserListPage from './User/UserList/UserListPage';
import UserPage from './User/UserPage';
import BoxListPage from './Box/BoxList/BoxListPage';
import BoxMembersPage from './Box/BoxMembersPage'

import { ReduxState } from './app/reducers';
import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/AppBar';
import UploadPage from './components/pages/UploadPage';
import SearchResults from './components/pages/SearchResults';
import { Gyet } from './User/userType';

function App() {

  const currentUser = useSelector<ReduxState, Gyet>(state => state.currentUser);

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
         dateAdapter={AdapterDateFns} adapterLocale={enUSLocale}>
    <div className="App">
     <Router>
      <ResponsiveAppBar />
      <header />
     <section>
      {/* 
        * TODO: move routes to seperate file for ease of maintenance 
        *       create a collection,
        *         * path key?
        *         * store Display Name
        *         * react Element
        *         * Tooltip text?
        */}
        <Routes>
          <Route
             path ="/"
             element={<LandingPage />}
             errorElement={<ErrorPage />}
          />

          {/* Document routes */}
          <Route path="/dashboard"    element={<Dashboard />}></Route>
          <Route path="/item/:itemId" element={<ItemPage />}></Route>
          <Route path="/mangyen"      element={<UploadPage />}></Route>
          <Route path="/search"       element={<SearchResults />}></Route>

          {/* users */}
          <Route path="/waa"          element={<UserPage />}></Route>
          <Route path="/user/current" element={<UserPage />}></Route>
          
          {/* TODO: add a currentUser.isAdmin check */}
          {/*Admin user pages */}
          { currentUser.isAdmin && 
            <>
              <Route path='/admin/usersList'       element={<UserListPage />}   />
              <Route path='admin/user/:userId'     element={<UserPage />}       />
              <Route path='/admin/boxList'         element={<BoxListPage />}    />
              <Route path='/admin/box/:id/members' element={<BoxMembersPage />} />
            </>
          }

        </Routes>
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
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
            >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
            >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
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
