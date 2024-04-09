/*
 * Test File to Validate handling of AWS OpenSearch
 */
const { Client }  = require('@opensearch-project/opensearch');
const { AwsSigv4Signer }  = require('@opensearch-project/opensearch/aws');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');   // V3 SDK.

const { indexUpdater, openSearchHealthCheck } = require('../OpenSearch');

jest.mock('@opensearch-project/opensearch');
jest.mock('@opensearch-project/opensearch/aws');

const guid = 'TEST-INDEX-UPDATE-GUID';

const mockIndexItem = {
   index: 'TestIndex',
   id: guid,
   body:
   {
      doc:
      {
         __typename: 'Test Document',
         id: guid,
         eng_title: 'Test Title',
         eng_description: 'Test Description',
         version: 0,
         keywords: ['Test Title', 'Test Description', 'my keywords'],
      }
   },
   refresh: true
};

describe('OpenSearch', () => {

   test('healthCheck should return health status', async () =>
   {
      const osClient = Client.mock.instances[0];
      osClient.cluster = { health: jest.fn() };
      const status = 'Test Status';
      osClient.cluster.health.mockResolvedValue(status);

      const actual = await openSearchHealthCheck();
      expect(actual).toEqual(status);
   });

   test('healthCheck should bubble up errors', async () =>
   {
      const osClient = Client.mock.instances[0];
      osClient.cluster = { health: jest.fn() };
      const status = 'Test Failure';
      osClient.cluster.health
              .mockImplementation(() => { throw new Error(status) });

      await expect(openSearchHealthCheck()).rejects.toThrow(status);
   });

   test('indexUpdater resolves when statusCode is 200',
        async () =>
   {
      const response = { statusCode: 200 };
      const osClient = Client.mock.instances[0];
      osClient.update.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).resolves.toBe(response);
   });

   test('indexUpdater rejects when statusCode is 4xx',
        async () =>
   {
      const response = { statusCode: 400 };
      const osClient = Client.mock.instances[0];
      osClient.update.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toBe(response);
   });

   test('indexUpdater rejects when statusCode is 5xx',
        async () =>
   {
      const response = { statusCode: 500 };
      const osClient = Client.mock.instances[0];
      osClient.update.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toBe(response);
   });

   test('indexUpdater rejects with error when update fails',
        async () =>
        {
           const osClient = Client.mock.instances[0];
           const error = new Error('Forced Update Error.');
           osClient.update.mockImplementation(() => {
              throw error;
           });

           const message = 'index update failed'
           const expected = new Error(message, error);

           //const actual = await indexUpdater(mockIndexItem);
           await expect(indexUpdater(mockIndexItem)).rejects.toEqual(expected);
        });

   test('indexUpdater creates the document (index item) if needed',
        async () =>
   {
      const osClient = Client.mock.instances[0];
      osClient.update.mockImplementation(() => {
         const err = new Error();
         err.meta = { body: { error: { root_cause: [{ type: 'document_missing_exception'}]}}};
         throw err;
      });

      const created = { statusCode: 201 }
      osClient.create.mockResolvedValue(created);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).resolves.toBe(created);
   });

   test('indexUpdater rejects with creation error on fallback creation error',
        async () =>
   {
      const osClient = Client.mock.instances[0];
      osClient.update.mockImplementation(() => {
         const err = new Error();
         err.meta = { body: { error: { root_cause: [{ type: 'document_missing_exception'}]}}};
         throw err;
      });

      const createError = new Error('Forced Create Error.');
      osClient.create.mockImplementation(() =>
                                         { throw createError; });

      //friendly wrapped error
      const message = 'index fallback create failed'
      const expected = new Error(message, createError);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toEqual(expected);
   });
})