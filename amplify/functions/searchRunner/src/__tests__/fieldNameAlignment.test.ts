import { describe, test, expect, beforeEach, vi } from 'vitest';
import { handler } from '../searchRunner.js';
import exampleEvent from './ExampleEvent.json';

const mockDdbSend = vi.fn();
const mockSearch = vi.fn();

vi.mock('@opensearch-project/opensearch', () => ({
   Client: vi.fn().mockImplementation(() => ({
      search: mockSearch,
   })),
}));

vi.mock('@aws-sdk/lib-dynamodb', () => ({
   DynamoDBDocumentClient: {
      from: vi.fn(() => ({
         send: (...args: any[]) => mockDdbSend(...args),
      })),
   },
   QueryCommand: vi.fn((params) => params),
   GetCommand: vi.fn((params) => params),
}));

vi.mock('@aws-sdk/client-dynamodb', () => ({
   DynamoDBClient: vi.fn(),
}));

vi.mock('@opensearch-project/opensearch/aws', () => ({
   AwsSigv4Signer: vi.fn(() => ({})),
}));

describe('searchRunner field name alignment', () =>
{
   beforeEach(() =>
   {
      process.env.AWS_REGION = 'us-east-1';
      process.env.USER_TABLE_NAME = 'User-test';
      process.env.BOX_USER_TABLE_NAME = 'BoxUser-test';
      process.env.OPENSEARCH_ENDPOINT = 'https://test.aoss.amazonaws.com';

      vi.clearAllMocks();
   });

   describe('Box filter uses updated field name', () =>
   {
      test('query uses documentBoxBoxId field name', async () =>
      {
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         const eventWithBoxIds = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, boxIds: ['box-1', 'box-2'] },
         };

         await handler(eventWithBoxIds);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              terms: { documentBoxBoxId: ['box-1', 'box-2'] },
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('query does not reference documentDetailsBoxId', async () =>
      {
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         const eventWithBoxIds = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, boxIds: ['box-1'] },
         };

         await handler(eventWithBoxIds);

         const searchCall = mockSearch.mock.calls[0][0];
         const queryString = JSON.stringify(searchCall);

         expect(queryString).not.toContain('documentDetailsBoxId');
      });
   });

   describe('TypeScript compiles after field name update', () =>
   {
      test('compilation succeeds with no errors', async () =>
      {
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await expect(handler(exampleEvent)).resolves.toBeDefined();
      });
   });
});
