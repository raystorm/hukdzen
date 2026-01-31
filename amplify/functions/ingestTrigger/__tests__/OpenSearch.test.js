/*
 * Test File to Validate handling of AWS OpenSearch
 */
const { Client }  = require('@opensearch-project/opensearch');
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
      osClient.index.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).resolves.toBe(response);
   });

   test('indexUpdater rejects when statusCode is 4xx',
        async () =>
   {
      const response = { statusCode: 400 };
      const osClient = Client.mock.instances[0];
      osClient.index.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toBe(response);
   });

   test('indexUpdater rejects when statusCode is 5xx',
        async () =>
   {
      const response = { statusCode: 500 };
      const osClient = Client.mock.instances[0];
      osClient.index.mockResolvedValue(response);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toBe(response);
   });

   test('indexUpdater rejects with error when index fails',
        async () =>
   {
      const osClient = Client.mock.instances[0];
      const error = new Error('Forced Index Error.');
      osClient.index.mockImplementation(() => { throw error; });

      const message = 'index operation failed'
      const expected = new Error(message, error);

      //const actual = await indexUpdater(mockIndexItem);
      await expect(indexUpdater(mockIndexItem)).rejects.toEqual(expected);
   });
})