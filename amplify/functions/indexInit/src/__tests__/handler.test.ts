import { Client } from '@opensearch-project/opensearch';
import { handler } from '../handler';

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


describe('indexInit handler', () =>
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

   describe('Delete requests', () =>
   {
      it('returns PhysicalResourceId without creating index', async () =>
      {
         const result = await handler({ RequestType: 'Delete' } as any, {} as any, {} as any);

         expect(result).toEqual({ PhysicalResourceId: 'opensearch-index' });
         expect(mockExists).not.toHaveBeenCalled();
         expect(mockCreate).not.toHaveBeenCalled();
      });
   });

   describe('Create requests', () =>
   {
      it('creates index when it does not exist', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockResolvedValue({});

         const result = await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         expect(mockExists).toHaveBeenCalledWith({ index: 'documentdetails' });
         expect(mockCreate).toHaveBeenCalledWith({
            index: 'documentdetails',
            body: {
               mappings: {
                  properties: expect.objectContaining({
                     __typename:                 { type: 'keyword' },
                     id:                         { type: 'keyword' },
                     eng_title:                  { type: 'text' },
                     keywords:                   { type: 'text' },
                  }),
               },
            },
         });
         expect(result).toEqual({ PhysicalResourceId: 'opensearch-index' });
      });

      it('skips creation when index already exists', async () =>
      {
         mockExists.mockResolvedValue({ body: true });

         const result = await handler({ RequestType: 'Create' } as any, {} as any, {} as any);

         expect(mockExists).toHaveBeenCalledWith({ index: 'documentdetails' });
         expect(mockCreate).not.toHaveBeenCalled();
         expect(result).toEqual({ PhysicalResourceId: 'opensearch-index' });
      });
   });

   describe('error handling', () =>
   {
      it('throws error when INDEX_NAME not set', async () =>
      {
         delete process.env.INDEX_NAME;

         await expect(handler({ RequestType: 'Create' } as any, {} as any, {} as any))
            .rejects.toThrow('INDEX_NAME environment variable not set');
         
         expect(mockExists).not.toHaveBeenCalled();
      });

      it('re-throws error from exists check', async () =>
      {
         mockExists.mockRejectedValue(new Error('OpenSearch error'));

         await expect(handler({ RequestType: 'Create' } as any, {} as any, {} as any))
            .rejects.toThrow('OpenSearch error');
      });

      it('re-throws error from index creation', async () =>
      {
         mockExists.mockResolvedValue({ body: false });
         mockCreate.mockRejectedValue(new Error('Creation failed'));

         await expect(handler({ RequestType: 'Create' } as any, {} as any, {} as any))
            .rejects.toThrow('Creation failed');
      });
   });
});
