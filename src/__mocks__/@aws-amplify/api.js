'use strict';
import { vi } from 'vitest';
import storage from 'aws-amplify/storage';

//console.log('Mocking @aws-amplify GraphQL Client');

// const, so generateClient always returns the same instance
const client = { graphql: vi.fn() };

export const generateClient = () => client;
