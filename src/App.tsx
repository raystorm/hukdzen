import React, {useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';

import { Hub } from 'aws-amplify';

import { amplifyEventsProcessor } from "./app/AmplifyEventsProcessor";

import './App.css';

import AppRoutes from './components/shared/AppRoutes';

import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/ResponsiveAppBar';


Hub.listen('auth', amplifyEventsProcessor);

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
