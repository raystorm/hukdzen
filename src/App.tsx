import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import './App.css';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import ItemPage from './components/pages/ItemPage';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/AppBar';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enUSLocale from 'date-fns/esm/locale/en-US/index.js';
import UserPage from './User/UserPage';

function App() {
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
     <Router>
        <Routes>
          <Route path ="/" element={<LandingPage />}></Route>
          {/* Document routes */}
          <Route path ="/dashboard" element={<Dashboard />}></Route>
          {/* TODO: Lookup Paramaterized URL for route */}
          <Route path ="/item/:itemId" element={<ItemPage />}></Route>

          {/*  */}
          <Route path ="/waa" element={<UserPage />}></Route>
          <Route path ="/user/current" element={<UserPage />}></Route>
          {/* TODO: pass specific ID (for admin user, only) */}
          <Route path ="/user/:userId" element={<UserPage />}></Route>
        </Routes>
     </Router>
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
    </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
