/*
 *  Opensearch helper code
 */
const { Client }  = require('@opensearch-project/opensearch');
const { AwsSigv4Signer }  = require('@opensearch-project/opensearch/aws');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');   // V3 SDK.
const { logger } = require("./logger");

const osClient = new Client(
   {
      ...AwsSigv4Signer({
                           region: process.env.REGION,
                           service: 'es',  // 'aoss' for OpenSearch Serverless
                           /*
                            * Must return a Promise that resolve to an AWS.Credentials object.
                            * Acquires credentials when the client starts and when they are expired.
                            * The Client refreshes the Credentials only when they are expired.
                            * With AWS SDK V2, Credentials.refreshPromise is used
                            * when available to refresh the credentials.
                            */

                           // Example with AWS SDK V3:
                           getCredentials: () => {
                              // Any other method to acquire a new Credentials object can be used.
                              const credentialsProvider = defaultProvider();
                              return credentialsProvider();
                           },
                        }),
      // OpenSearch domain URL
      node: process.env.OS_DOMAIN_URL,
      //node: 'https://search-amplify-opense-2uoq6n3ikcgf-cfkjrbj4duhd2k5suet66b74ri.us-west-2.es.amazonaws.com',
      // node: "https://xxx.region.aoss.amazonaws.com" for OpenSearch Serverless
   }
);

/**
 *  Validates that OpenSearch is running, and we can connect to it.
 *  @returns {Promise<ApiResponse<Record<string, any>, Context>>} health response
 */
const openSearchHealthCheck = async () =>
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

/**
 *  Index Update Wrapper
 *  @param indexItem fulll JSON object to be indexed
 *  @returns {Promise<ApiResponse<Record<string, any>, Context>>} response or error
 */
const indexUpdater = async (indexItem) =>
{
   try
   {
      const response = await osClient.update(indexItem);
      logger.log('index update attempted.');
      //status between 200 && 300
      if ( 199 < response.statusCode && 300 > response.statusCode )
      {
         logger.log("Index updated successfully");
         return response;
      }
      else
      {
         logger.log('Error updating index:', response);
         return Promise.reject(response);
      }
   }
   catch (err)
   {
      if ( 'document_missing_exception' ===
           err?.meta?.body?.error?.root_cause[0]?.type )
      {
         try { return await osClient.create(indexItem); }
         catch (err) //{ } //ignore, fallback to original error
         {
            const message = 'index fallback create failed'
            const error = new Error(message, err);
            logger.log(message, err);
            //logger.log(message,':', err)
            //logger.log(err);
            return Promise.reject(error)
         }
      }
      const message = 'index update failed'
      const error = new Error(message, err);
      //logger.log(message,':', err)
      return Promise.reject(error)
   }
   finally { logger.log('Finished updating index.'); }
}

module.exports = { openSearchHealthCheck, indexUpdater };