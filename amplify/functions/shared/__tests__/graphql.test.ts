// Mock logger to avoid console noise
jest.mock('../logger', () => ({
   logger: {
      info: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
   }
}));

// Mock dependencies
jest.mock('@aws-sdk/signature-v4');
jest.mock('@aws-sdk/credential-provider-node', () => ({
   defaultProvider: jest.fn(() => jest.fn(() => Promise.resolve({
      accessKeyId: 'test-key',
      secretAccessKey: 'test-secret',
      sessionToken: 'test-token'
   })))
}));

global.fetch = jest.fn();

// Set env vars before importing graphql module
const mockEndpoint = 'https://test.appsync-api.us-east-1.amazonaws.com/graphql';
const mockRegion = 'us-east-1';
process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT = mockEndpoint;
process.env.AWS_REGION = mockRegion;

import { graphql } from '../graphql';
import { SignatureV4 } from '@aws-sdk/signature-v4';

describe('graphql', () =>
{
   beforeEach(() =>
   {
      jest.clearAllMocks();

      (SignatureV4.prototype.sign as jest.Mock) = jest.fn().mockResolvedValue({
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 ...',
            'host': 'test.appsync-api.us-east-1.amazonaws.com'
         },
         body: JSON.stringify({ query: 'test', variables: {} })
      });
   });

   it('should make signed GraphQL request', async () =>
   {
      const mockResponse = { data: { getUser: { id: '123', name: 'Test' } } };
      (global.fetch as jest.Mock).mockResolvedValue({
         ok: true,
         json: async () => mockResponse
      });

      const query = 'query GetUser($id: ID!) { getUser(id: $id) { id name } }';
      const variables = { id: '123' };

      const result = await graphql(query, variables);

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
         mockEndpoint,
         expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
               'Content-Type': 'application/json'
            })
         })
      );
   });

   it('should handle GraphQL errors', async () =>
   {
      (global.fetch as jest.Mock).mockResolvedValue({
         ok: false,
         text: async () => 'GraphQL Error: Unauthorized'
      });

      const query = 'query { getUser { id } }';

      await expect(graphql(query)).rejects.toThrow('GraphQL request failed: GraphQL Error: Unauthorized');
   });

   it('should handle requests without variables', async () =>
   {
      const mockResponse = { data: { listUsers: { items: [] } } };
      (global.fetch as jest.Mock).mockResolvedValue({
         ok: true,
         json: async () => mockResponse
      });

      const query = 'query { listUsers { items { id } } }';

      const result = await graphql(query);

      expect(result).toEqual(mockResponse);
   });

   it('should sign request with SigV4', async () =>
   {
      (global.fetch as jest.Mock).mockResolvedValue({
         ok: true,
         json: async () => ({ data: {} })
      });

      const query = 'query { test }';
      await graphql(query);

      expect(SignatureV4.prototype.sign).toHaveBeenCalled();
   });
});
