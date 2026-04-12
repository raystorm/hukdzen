jest.mock('../OpenSearch', () => ({
   openSearchHealthCheck: jest.fn(),
   indexUpdater: jest.fn(),
}));

import { buildSearchIndex, indexName } from '../ingestTrigger';
import type { DynamoDBRecord } from 'aws-lambda';

describe('ingestTrigger field name alignment', () =>
{
   const mockRecord: DynamoDBRecord = {
      eventID: 'test-event',
      eventName: 'INSERT',
      dynamodb: {
         Keys: { id: { S: 'doc-123' } },
         NewImage: {
            __typename: { S: 'Document' },
            id: { S: 'doc-123' },
            eng: {
               M: {
                  title: { S: 'Test Title' },
                  description: { S: 'Test Description' },
               },
            },
            bc: {
               M: {
                  title: { S: 'BC Title' },
                  description: { S: 'BC Description' },
               },
            },
            ak: {
               M: {
                  title: { S: 'AK Title' },
                  description: { S: 'AK Description' },
               },
            },
            fileKey: { S: 'test-file.txt' },
            fileHash: { S: 'abc123' },
            created: { S: '2025-01-01' },
            updated: { S: '2025-01-02' },
            type: { S: 'text/plain' },
            version: { N: '1' },
            createdAt: { S: '2025-01-01T00:00:00Z' },
            updatedAt: { S: '2025-01-02T00:00:00Z' },
            documentAuthorId: { S: 'author-123' },
            documentContentOwnerUserId: { S: 'owner-456' },
            documentBoxBoxId: { S: 'box-789' },
            keywords: { L: [{ S: 'keyword1' }, { S: 'keyword2' }] },
         },
      },
   };

   describe('SearchIndexBody interface uses updated field names', () =>
   {
      test('interface includes documentAuthorId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).toHaveProperty('documentAuthorId');
         expect(result.body.documentAuthorId).toBe('author-123');
      });

      test('interface includes documentContentOwnerUserId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).toHaveProperty('documentContentOwnerUserId');
         expect(result.body.documentContentOwnerUserId).toBe('owner-456');
      });

      test('interface includes documentBoxBoxId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).toHaveProperty('documentBoxBoxId');
         expect(result.body.documentBoxBoxId).toBe('box-789');
      });

      test('interface does not include documentDetailsAuthorId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).not.toHaveProperty('documentDetailsAuthorId');
      });

      test('interface does not include documentDetailsDocOwnerId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).not.toHaveProperty('documentDetailsDocOwnerId');
      });

      test('interface does not include documentDetailsBoxId', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body).not.toHaveProperty('documentDetailsBoxId');
      });
   });

   describe('buildSearchIndex function uses updated field names', () =>
   {
      test('function maps to documentAuthorId property', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body.documentAuthorId).toBe('author-123');
      });

      test('function maps to documentContentOwnerUserId property', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body.documentContentOwnerUserId).toBe('owner-456');
      });

      test('function maps to documentBoxBoxId property', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');

         expect(result.body.documentBoxBoxId).toBe('box-789');
      });

      test('function does not reference old field names', () =>
      {
         const result = buildSearchIndex(indexName, mockRecord, 'test content');
         const resultString = JSON.stringify(result);

         expect(resultString).not.toContain('documentDetailsAuthorId');
         expect(resultString).not.toContain('documentDetailsDocOwnerId');
         expect(resultString).not.toContain('documentDetailsBoxId');
      });
   });

   describe('TypeScript compiles after field name updates', () =>
   {
      test('compilation succeeds with no errors', () =>
      {
         expect(() => buildSearchIndex(indexName, mockRecord, 'test content')).not.toThrow();
      });
   });
});
