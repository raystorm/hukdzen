// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import { vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import '@testing-library/jest-dom/extend-expect';
import { when } from 'vitest-when';
import 'jsdom-worker';

import { getCurrentUser } from 'aws-amplify/auth';

vi.mock('aws-amplify/auth',
        () => ({ getCurrentUser: vi.fn() }));

// Set the mock implementation
vi.mocked(getCurrentUser).mockResolvedValue(
   { username: 'TEST-GUID-HERE', userId: 'TEST-GUID-HERE-CU' }
);

const mockClient = vi.hoisted(() => ({ graphql: vi.fn() }));
vi.mock('@aws-amplify/api', () => ({
   generateClient: () => mockClient
}));

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

const filterErrors = (args: any[], original: any) =>
{
   const message = args[0];

   // Skip known unavoidable warnings
   if (typeof message === 'string')
   {
      //Filter act() warnings
      const warningStart = 'Warning: An update to';
      const warningEnd = 'was not wrapped in act(...)';
      if ( message.includes(warningStart) && message.includes(warningEnd) )
         // if ( message.includes(warningStart) && message.includes(warningEnd)
         //   && ( message.includes('FormControl')
         //     || message.includes('LocalizationProvider')
         //     || message.includes('Autocomplete')
         //     || message.includes('TouchRipple')
         //
         //   /*
         //   && ( message.includes('redux-saga') // Redux Saga state updates
         //     || message.includes('@mui') // MUI component internal updates
         //     || message.includes('router') // React Router navigation updates
         //     //|| message.includes('amplify') // Amplify async operations
         //   */
         // ) )
      { return; }
      //{ if ( message.includes('ForwardRef') ) { return; } }

      // Filter out MUI pointer event warnings
      if ( message.includes('Unknown event handler property')
        && ( message.includes('onPointerEnterCapture')
          || message.includes('onPointerLeaveCapture') ) )
      { return; }
   }

   // Show all other errors
   original(...args);
}

/** Establish API mocking before all tests. */
beforeAll(() => {
  // Filter out known unavoidable act() warnings
  console.error = (...args: any[]) => filterErrors(args, originalError);
  //console.warn = (...args: any[]) => filterErrors(args, originalWarn);

  // Disable MUI animations
  process.env.NODE_ENV = 'test';

  // Mock requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);

  URL.revokeObjectURL = vi.fn();
  //Window.prototype.scroll = jest.fn();
  window.HTMLElement.prototype.scroll = vi.fn();
  window.HTMLDivElement.prototype.scroll = vi.fn();

  /**
   * This is a workaround to the problem of the jsdom library not supporting
   * URL.createObjectURL. See https://github.com/jsdom/jsdom/issues/1721.
   */
  if (typeof window.URL.createObjectURL === 'undefined')
  { window.URL.createObjectURL = vi.fn(); }

  HTMLFormElement.prototype.requestSubmit = vi.fn();
  //globabl.HTMLFormElement.prototype.requestSubmit = vi.fn();

  //vi.useFakeTimers();
});

beforeEach(() => {

});

/**
 *  Reset any request handlers that we may add during the tests,
 *  so they don't affect other tests.
 * /
afterEach(() => {
});

/** Clean up after the tests are finished. */
afterAll(() => {
   // Restore original console methods
   console.error = originalError;
   console.warn = originalWarn;
});
// */