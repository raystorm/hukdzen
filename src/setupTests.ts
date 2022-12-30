// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
//import 'jsdom-global/register';
import 'jsdom-worker';
//import 'xhr';
//import 'xhr2'
import xhrMock, { proxy } from 'xhr-mock';
import { server } from './mocks/server';

/** Establish API mocking before all tests. */
beforeAll(() => {
  //server.listen()
});

beforeEach(() => {
  //xhrMock.setup();
  //xhrMock.use(proxy);
});

/**
 *  Reset any request handlers that we may add during the tests,
 *  so they don't affect other tests.
 */
afterEach(() => {
  //server.resetHandlers(); 
  //xhrMock.reset();
});

/** Clean up after the tests are finished. */
afterAll(() => { 
  //server.close() 
  xhrMock.teardown();
});
// */