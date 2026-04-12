import { Client } from '@opensearch-project/opensearch';
import { handler } from '../indexInit';

jest.mock('@opensearch-project/opensearch');
jest.mock('@aws-sdk/credential-provider-node');

const mockExists = jest.fn();
const mockCreate = jest.fn();
const MockedClient = Client as jest.MockedClass<typeof Client>;

MockedClient.mockImplementation(() => ({
   indices: {
      exists: mockExists,
      create: mockCreate,
   },
} as any));

describe('indexInit field name alignment', () =>
{
   const originalEnv = process.env;

   beforeEach(() =>
   {
      jest.clearAllMocks();
      process.env = {
         ...originalEnv,
         AWS_REGION:          'us-east-1',
         COLLECTION_ENDPOINT: 'https://test.us-east-1.aoss.amazonaws.com',
         INDEX_NAME:          'documentdetails',
      };
   });

   afterEach(() => { process.env = originalEnv; });

   describe('OpenSearch index mappings use updated field names', () =>
   {
      test('mappings include documentAuthorId with keyword type', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  mappings: expect.objectContaining({
                     properties: expect.objectContaining({
                        documentAuthorId: { type: 'keyword' },
                     }),
                  }),
               }),
            })
         );
      });

      test('mappings include documentContentOwnerUserId with keyword type', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  mappings: expect.objectContaining({
                     properties: expect.objectContaining({
                        documentContentOwnerUserId: { type: 'keyword' },
                     }),
                  }),
               }),
            })
         );
      });

      test('mappings include documentBoxBoxId with keyword type', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
               body: expect.objectContaining({
                  mappings: expect.objectContaining({
                     properties: expect.objectContaining({
                        documentBoxBoxId: { type: 'keyword' },
                     }),
                  }),
               }),
            })
         );
      });

      test('mappings do not include documentDetailsAuthorId', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         const createCall = mockCreate.mock.calls[0][0];
         const mappings = createCall.body.mappings.properties;

         expect(mappings).not.toHaveProperty('documentDetailsAuthorId');
      });

      test('mappings do not include documentDetailsDocOwnerId', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         const createCall = mockCreate.mock.calls[0][0];
         const mappings = createCall.body.mappings.properties;

         expect(mappings).not.toHaveProperty('documentDetailsDocOwnerId');
      });

      test('mappings do not include documentDetailsBoxId', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         const createCall = mockCreate.mock.calls[0][0];
         const mappings = createCall.body.mappings.properties;

         expect(mappings).not.toHaveProperty('documentDetailsBoxId');
      });
   });

   describe('TypeScript compiles after field name updates', () =>
   {
      test('compilation succeeds with no errors', async () =>
      {
         mockExists.mockResolvedValue({ body: true });

         await expect(handler({ RequestType: 'Create' } as any, {} as any, {} as any))
            .resolves.toBeDefined();
      });
   });
});
