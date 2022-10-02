import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import NavBar from './components/shared/NavBar';
import LandingPage from './components/pages/LandingPage';
import MainPage from './components/pages/MainPage';
import { makeStyles, withStyles } from "tss-react/mui";
import { display, margin, padding, positions } from '@mui/system';
import { positional } from 'yargs';

//TODO: move to navbar

type Props = {
    className?: string;
};

const useStyles = makeStyles()(
    (theme) => ({
        "seperator":
        {
          width: '100%',
          backgroundColor: '#ff8c00',
          color: '#FFFFFF',
          fontWeight: 'bold',
          position: 'fixed',
          top: '0px',
          //padding: '20px', //TODO: use spacing construct
          marginTop: '10px', //TODO: spacing
          marginBottom: '10px' //TODO: spacing
        }
    })
);

function App() {

  const { classes, cx } = useStyles();

  return (
    <div className="App">
      <header className="App-header">
      <NavBar />
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
  );
}

export default App;
