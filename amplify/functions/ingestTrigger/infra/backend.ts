import { StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const configureIngestTrigger = (backend: any) =>
{
   const dataResources = backend.data.resources as any;
   const documentTable = dataResources.tables['DocumentDetails'];

   // Add DynamoDB stream trigger
   backend.ingestTrigger.resources.lambda.addEventSource(
      new DynamoEventSource(documentTable, {
         startingPosition: StartingPosition.LATEST,
         batchSize: 10,
         retryAttempts: 2,
      })
   );

   // Grant S3 read access for file content extraction
   backend.ingestTrigger.resources.lambda.addToRolePolicy(
      new PolicyStatement({
         effect: Effect.ALLOW,
         actions: ['s3:GetObject'],
         resources: [`${backend.storage.resources.bucket.bucketArn}/*`],
      })
   );

   // Grant DynamoDB stream read access
   backend.ingestTrigger.resources.lambda.addToRolePolicy(
      new PolicyStatement({
         effect: Effect.ALLOW,
         actions: [
            'dynamodb:DescribeStream',
            'dynamodb:GetRecords',
            'dynamodb:GetShardIterator',
            'dynamodb:ListStreams',
         ],
         resources: [documentTable.tableStreamArn],
      })
   );

   // Set S3 bucket name for file access
   backend.ingestTrigger.addEnvironment(
      'STORAGE_HALIAMWAALS3_BUCKETNAME',
      backend.storage.resources.bucket.bucketName
   );
};
