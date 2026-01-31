const { handler } = require('../handler');
const exampleEvent = require('./ExampleEvent.json');

const mockDdbSend = jest.fn();
const mockSearch = jest.fn();

jest.mock('@opensearch-project/opensearch', () => ({
   Client: jest.fn().mockImplementation(() => ({
      search: mockSearch,
   })),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
   DynamoDBDocumentClient: {
      from: jest.fn(() => ({
         send: (...args) => mockDdbSend(...args),
      })),
   },
   QueryCommand: jest.fn((params) => params),
   GetCommand: jest.fn((params) => params),
}));

jest.mock('@aws-sdk/client-dynamodb', () => ({
   DynamoDBClient: jest.fn(),
}));

jest.mock('@opensearch-project/opensearch/aws', () => ({
   AwsSigv4Signer: jest.fn(() => ({})),
}));

const { QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

describe('searchRunner handler', () =>
{
   beforeEach(() =>
   {
      process.env.AWS_REGION = 'us-east-1';
      process.env.USER_TABLE_NAME = 'User-test';
      process.env.BOX_USER_TABLE_NAME = 'BoxUser-test';
      process.env.OPENSEARCH_ENDPOINT = 'https://test.aoss.amazonaws.com';

      jest.clearAllMocks();
   });

   describe('validation', () =>
   {
      test('requires authenticated user', async () =>
      {
         const event = { ...exampleEvent, identity: null };
         await expect(handler(event)).rejects.toThrow('User not authenticated');
      });

      test('requires non-empty search query', async () =>
      {
         const eventWithEmptyQuery = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, query: '' },
         };
         await expect(handler(eventWithEmptyQuery)).rejects.toThrow('Search query is required');

         const eventWithWhitespaceQuery = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, query: '   ' },
         };
         await expect(handler(eventWithWhitespaceQuery)).rejects.toThrow('Search query is required');
      });
   });

   describe('permission filtering', () =>
   {
      test('admin user searches without box filtering', async () =>
      {
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-1', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: {
               hits: {
                  hits: [
                     { _id: 'doc-1', _source: { eng_title: 'Test Doc' }, _score: 1.5 },
                  ],
                  total: { value: 1 },
               },
            },
         });

         const result = await handler(exampleEvent);

         expect(mockDdbSend).toHaveBeenCalledTimes(1);
         expect(mockDdbSend).toHaveBeenCalledWith(
            expect.objectContaining({
               TableName: 'User-test',
               Key: { id: 'user-123' },
            })
         );
         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               index: 'documents',
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({ multi_match: expect.any(Object) }),
                        ]),
                     }),
                  }),
               }),
            })
         );
         expect(result.items).toHaveLength(1);
         expect(result.items[0].type).toBe('DOCUMENT');
         expect(result.total).toBe(1);
      });

      test('non-admin user searches with box filtering', async () =>
      {
         mockDdbSend
            .mockResolvedValueOnce({ Item: { id: 'user-1', isAdmin: false } })
            .mockResolvedValueOnce({
               Items: [
                  { boxXbiisId: 'box-1' },
                  { boxXbiisId: 'box-2' },
               ],
            });
         mockSearch.mockResolvedValueOnce({
            body: {
               hits: {
                  hits: [{ _id: 'doc-1', _source: {}, _score: 1.0 }],
                  total: { value: 1 },
               },
            },
         });

         await handler(exampleEvent);

         expect(mockDdbSend).toHaveBeenCalledTimes(2);
         expect(mockDdbSend).toHaveBeenNthCalledWith(2,
            expect.objectContaining({
               TableName: 'BoxUser-test',
               IndexName: 'byUser',
               KeyConditionExpression: 'userUserId = :userId',
            })
         );
         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              terms: {
                                 documentDetailsBoxId: expect.arrayContaining(['box-1', 'box-2', 'f47ac10b-58cc-4372-a567-0e02b2c3d479']),
                              },
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('admin user can search any provided boxIds', async () =>
      {
         const eventWithBoxIds = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, boxIds: ['box-3', 'box-4'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithBoxIds);

         expect(mockDdbSend).toHaveBeenCalledTimes(1);
         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              terms: { documentDetailsBoxId: ['box-3', 'box-4'] },
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('non-admin user can only search boxes they have access to', async () =>
      {
         const eventWithBoxIds = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, boxIds: ['box-1', 'box-3', 'box-5'] },
         };
         mockDdbSend
            .mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: false } })
            .mockResolvedValueOnce({
               Items: [
                  { boxXbiisId: 'box-1' },
                  { boxXbiisId: 'box-2' },
               ],
            });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithBoxIds);

         expect(mockDdbSend).toHaveBeenCalledTimes(2);
         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              terms: { documentDetailsBoxId: ['box-1'] },
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('non-admin user with no access to provided boxes throws error', async () =>
      {
         const eventWithBoxIds = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, boxIds: ['box-3', 'box-4'] },
         };
         mockDdbSend
            .mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: false } })
            .mockResolvedValueOnce({
               Items: [
                  { boxXbiisId: 'box-1' },
                  { boxXbiisId: 'box-2' },
               ],
            });

         await expect(handler(eventWithBoxIds)).rejects.toThrow('No access to specified boxes');
      });
   });

   describe('field selection', () =>
   {
      test('searches keywords by default when no field specified', async () =>
      {
         const eventWithoutField = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, field: undefined, boxIds: ['box-1'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithoutField);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              multi_match: expect.objectContaining({ fields: ['keywords'] }),
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('searches all fields when field is all', async () =>
      {
         const eventWithAllFields = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, field: 'all', boxIds: ['box-1'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithAllFields);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              multi_match: expect.objectContaining({
                                 fields: ['keywords',
                                          'eng_title', 'bc_title', 'ak_title',
                                          'eng_description', 'bc_description', 'ak_description'],
                              }),
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });

      test('searches specific field when provided', async () =>
      {
         const eventWithSpecificField = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, field: 'eng_title', boxIds: ['box-1'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithSpecificField);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  query: expect.objectContaining({
                     bool: expect.objectContaining({
                        must: expect.arrayContaining([
                           expect.objectContaining({
                              multi_match: expect.objectContaining({
                                 fields: ['eng_title'],
                              }),
                           }),
                        ]),
                     }),
                  }),
               }),
            })
         );
      });
   });

   describe('pagination', () =>
   {
      test('uses limit and from parameters with nextToken', async () =>
      {
         const eventWithPagination = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, limit: 5, from: 10, boxIds: ['box-1'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: {
               hits: {
                  hits: [{ _id: 'doc-1', _source: {}, _score: 1.0 }],
                  total: { value: 20 },
               },
            },
         });

         const result = await handler(eventWithPagination);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({ from: 10, size: 5 }),
            })
         );
         expect(result.from).toBe(10);
         expect(result.limit).toBe(5);
         expect(result.nextToken).toBe('15');
      });

      test('returns null nextToken when no more results', async () =>
      {
         const eventWithPagination = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments, limit: 10, from: 15, boxIds: ['box-1'] },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: {
               hits: {
                  hits: [{ _id: 'doc-1', _source: {}, _score: 1.0 }],
                  total: { value: 20 },
               },
            },
         });

         const result = await handler(eventWithPagination);

         expect(result.nextToken).toBeNull();
      });
   });

   describe('sorting', () =>
   {
      test('uses relevance ranking by default when no sort specified', async () =>
      {
         const eventWithoutSort = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments,
                         sortField: undefined, sortDirection: undefined,
                         boxIds: ['box-1']
            },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: {
               hits: {
                  hits: [
                     { _id: 'doc-1', _source: { eng_title: 'Most Relevant' }, _score: 2.5 },
                     { _id: 'doc-2', _source: { eng_title: 'Less Relevant' }, _score: 1.2 },
                     { _id: 'doc-3', _source: { eng_title: 'Least Relevant' }, _score: 0.8 },
                  ],
                  total: { value: 3 },
               },
            },
         });

         const result = await handler(eventWithoutSort);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.not.objectContaining({ sort: expect.anything() }),
            })
         );

         //validates score ordering
         expect(result.items[0].score).toBe(2.5);
         expect(result.items[1].score).toBe(1.2);
         expect(result.items[2].score).toBe(0.8);
      });

      test('sorts by specified field and direction', async () =>
      {
         const eventWithSort = {
            ...exampleEvent,
            arguments: { ...exampleEvent.arguments,
                         sortField: 'updated', sortDirection: 'DESC',
                         boxIds: ['box-1']
            },
         };
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', isAdmin: true } });
         mockSearch.mockResolvedValueOnce({
            body: { hits: { hits: [], total: { value: 0 } } },
         });

         await handler(eventWithSort);

         expect(mockSearch).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  sort: [{ updated: { order: 'desc' } }],
               }),
            })
         );
      });
   });

   describe('error handling', () =>
   {
      test('handles OpenSearch errors', async () =>
      {
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-1', isAdmin: true } });
         mockSearch.mockRejectedValueOnce(new Error('OpenSearch connection failed'));

         await expect(handler(exampleEvent)).rejects.toThrow('OpenSearch connection failed');
      });

      test('handles DynamoDB errors', async () =>
      {
         mockDdbSend.mockRejectedValueOnce(new Error('DynamoDB error'));

         await expect(handler(exampleEvent)).rejects.toThrow('DynamoDB error');
      });
   });
});
