import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from 'react-redux';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import './App.css';

import AppRoutes from './components/shared/AppRoutes';

import { ReduxState } from './app/reducers';
import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/AppBar';
import { Gyet } from './User/userType';

function App() 
{
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
