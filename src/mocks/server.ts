import { setupServer } from 'msw/node';
import { userHandlers } from '../User/__mocks__/userHandler';
import { boxHandlers } from '../Box/__mocks__/boxHandler';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...userHandlers, ...boxHandlers);