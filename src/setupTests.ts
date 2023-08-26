// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import 'jsdom-worker';
import {API, Storage} from "aws-amplify";

/** Establish API mocking before all tests. */
beforeAll(() => {
  URL.revokeObjectURL = jest.fn();
  //Window.prototype.scroll = jest.fn();
  window.HTMLElement.prototype.scroll = jest.fn();
  window.HTMLDivElement.prototype.scroll = jest.fn();

  jest.mock('aws-amplify');
  API.graphql    = jest.fn();
  Storage.get    = jest.fn();
  Storage.copy   = jest.fn();
  Storage.remove = jest.fn();
});

beforeEach(() => {
});

/**
 *  Reset any request handlers that we may add during the tests,
 *  so they don't affect other tests.
 */
afterEach(() => {
});

/** Clean up after the tests are finished. */
afterAll(() => {
});
// */