import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import ReduxStore from './app/store';
import App from './App';
import { contains } from './utilities/testUtilities';

test('renders learn react link', () => {
  render(
    <Provider store={ReduxStore}>
      <App />
    </Provider>
  );

  expect(screen.getByText(contains('Copyright'))).toBeInTheDocument();
});
