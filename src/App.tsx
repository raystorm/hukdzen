import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import logo from './resources/logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import NavBar from './components/shared/NavBar';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import Item from './components/pages/Item';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/AppBar';
import { Height } from '@mui/icons-material';




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
    <div className="App">
      <ResponsiveAppBar />
      {/* <NavBar /> */}
      <header />
     <section>
     <Router>
        <Routes>
          <Route path ="/" element={<LandingPage />}></Route>
          <Route path ="/dashboard" element={<Dashboard />}></Route>
          <Route path ="/item/:itemId" element={<Item />}></Route>
        </Routes>
     </Router>
     </section>
     <footer>
      <div>
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
    </ThemeProvider>
  );
}

export default App;
