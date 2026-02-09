import { Client } from '@opensearch-project/opensearch';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { logger } from '../../shared/logger';

const osClient = new Client({
   ...AwsSigv4Signer({
      region: process.env.REGION || 'us-east-1',
      service: 'es',
      getCredentials: () => defaultProvider()(),
   }),
   node: process.env.OS_DOMAIN_URL,
});

export const openSearchHealthCheck = async () =>
{
   try
   {
      const health = await osClient.cluster.health();
      logger.log('health:', health);
      return health;
   }
   catch (err)
   {
      logger.log('OpenSearch health (connection) check failed:', err);
      throw err;
   }
}

interface IndexItem
{
   index:   string;
   id:      string;
   body:    Record<string, any>;
   refresh: boolean;
}

export const indexUpdater = async (indexItem: IndexItem) =>
{
   try
   {
      let response;
      
      try
      {
         response = await osClient.index(indexItem);
         logger.log('index operation attempted.');
      }
      catch (err)
      {
         const message = 'OpenSearch index operation threw exception';
         logger.log(message, err);
         throw new Error(message, { cause: err });
      }
      
      if (199 < response.statusCode! && 300 > response.statusCode!)
      {
         logger.log("Index operation successful");
         return response;
      }
      
      logger.log('Error indexing document:', response);
      throw new Error('OpenSearch returned non-2xx status', { cause: response });
   }
   finally { logger.log('Finished indexing.'); }
}
