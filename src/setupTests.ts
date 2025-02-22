// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-worker';
import { when } from 'jest-when';


/** Establish API mocking before all tests. */
beforeAll(() => {
  URL.revokeObjectURL = jest.fn();
  //Window.prototype.scroll = jest.fn();
  window.HTMLElement.prototype.scroll = jest.fn();
  window.HTMLDivElement.prototype.scroll = jest.fn();

  /**
   * This is a workaround to the problem of the jsdom library not supporting
   * URL.createObjectURL. See https://github.com/jsdom/jsdom/issues/1721.
   */
  if (typeof window.URL.createObjectURL === 'undefined') {
    window.URL.createObjectURL = jest.fn();
  }

});

beforeEach(() => {
});

/**
 *  Reset any request handlers that we may add during the tests,
 *  so they don't affect other tests.
 * /
afterEach(() => {
});

/** Clean up after the tests are finished. * /
afterAll(() => {
});
// */