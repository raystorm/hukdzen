'use strict';

//console.log('Mocking @aws-amplify GraphQL Client');

// const, so generateClient always returns the same instance
const client = { graphql: jest.fn() };

module.exports = { generateClient: () => client }
