export const configureIngestTrigger = (backend: any, opensearchCollectionArn: string, region: string, env: string) => {
   // Grant S3 read access
   backend.ingestTrigger.resources.lambda.addToRolePolicy({
      Effect: 'Allow',
      Action: ['s3:GetObject'],
      Resource: `${backend.storage.resources.bucket.bucketArn}/*`,
   });

   // Grant OpenSearch Serverless access
   backend.ingestTrigger.resources.lambda.addToRolePolicy({
      Effect: 'Allow',
      Action: ['aoss:APIAccessAll', 'aoss:ReadDocument', 'aoss:WriteDocument'],
      Resource: opensearchCollectionArn,
   });

   // Set environment variables
   backend.ingestTrigger.addEnvironment('OPENSEARCH_ENDPOINT', opensearchCollectionArn);
   backend.ingestTrigger.addEnvironment('OPENSEARCH_REGION', region);
   backend.ingestTrigger.addEnvironment('ENV', env);
   backend.ingestTrigger.addEnvironment('STORAGE_HALIAMWAALS3_BUCKETNAME', backend.storage.resources.bucket.bucketName);

   // Add S3 trigger for document uploads
   backend.storage.resources.bucket.addEventNotification(
      'ObjectCreated',
      backend.ingestTrigger.resources.lambda,
      { prefix: 'public/' }
   );
};
