import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import logo from './resources/logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import NavBar from './components/shared/NavBar';
import LandingPage from './components/pages/LandingPage';
import MainPage from './components/pages/MainPage';
import { ThemeProvider } from '@mui/material';
import { theme }  from './components/shared/theme';
import ResponsiveAppBar from './components/shared/AppBar';

function App() {
  return (
    <ThemeProvider theme={theme}>      
    <div className="App">
      <ResponsiveAppBar />
      {/* <NavBar /> */}
      <header className="App-header">
      <Router>
        <Routes>
          <Route path ="/" element={<LandingPage />}></Route>
          <Route path ="/dashboard" element={<MainPage />}></Route>
        </Routes>
      <div>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
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
     </Router>
      </header>
    </div>
    </ThemeProvider>
  );
}

export default App;
