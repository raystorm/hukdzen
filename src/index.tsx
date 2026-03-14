import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { Authenticator } from "@aws-amplify/ui-react";

import ReduxStore, { start } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={ReduxStore}>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </Provider>
  </React.StrictMode>
);

//Start Middleware to actually pick-up events
start();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { titleFilter } from "./Content/ContentType";
export { printTitles } from "./Content/ContentType";
export { printableTitlesType } from "./Content/ContentType";
export { printableTitles } from "./Content/ContentType";