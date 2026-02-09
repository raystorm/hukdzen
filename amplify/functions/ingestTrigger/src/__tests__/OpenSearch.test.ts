import { Client } from '@opensearch-project/opensearch';
import { indexUpdater, openSearchHealthCheck } from '../OpenSearch';

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

describe('OpenSearch', () =>
{
   test('healthCheck should return health status', async () =>
   {
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      osClient.cluster = { health: jest.fn() };
      const status = 'Test Status';
      osClient.cluster.health.mockResolvedValue(status);

      const actual = await openSearchHealthCheck();
      expect(actual).toEqual(status);
   });

   test('healthCheck should bubble up errors', async () =>
   {
      const osClient = jest.mocked(Client).mock.instances[0] as any;
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
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      osClient.index.mockResolvedValue(response);

      await expect(indexUpdater(mockIndexItem)).resolves.toBe(response);
   });

   test('indexUpdater rejects when statusCode is 4xx',
        async () =>
   {
      const response = { statusCode: 400 };
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      osClient.index.mockResolvedValue(response);

      await expect(indexUpdater(mockIndexItem)).rejects.toThrow('OpenSearch returned non-2xx status');
   });

   test('indexUpdater rejects when statusCode is 5xx',
        async () =>
   {
      const response = { statusCode: 500 };
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      osClient.index.mockResolvedValue(response);

      await expect(indexUpdater(mockIndexItem)).rejects.toThrow('OpenSearch returned non-2xx status');
   });

   test('indexUpdater rejects with error when index fails',
        async () =>
   {
      const osClient = jest.mocked(Client).mock.instances[0] as any;
      const error = new Error('Forced Index Error.');
      osClient.index.mockImplementation(() => { throw error; });

      await expect(indexUpdater(mockIndexItem)).rejects.toThrow('OpenSearch index operation threw exception');
   });
});
