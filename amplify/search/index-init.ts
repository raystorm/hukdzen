import { Stack, CustomResource, Duration } from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { Runtime, Code, Function as LambdaFunction } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { readFileSync } from 'fs';
import { join } from 'path';

interface IndexInitProps
{
   collectionEndpoint: string;
   collectionArn: string;
   indexName: string;
}

export function createIndexInitializer(scope: Construct, props: IndexInitProps): CustomResource
{
   const handlerCode = readFileSync(join(__dirname, 'index-init-handler.js'), 'utf-8');

   const initFunction = new LambdaFunction(scope, 'IndexInitFunction',
   {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      timeout: Duration.minutes(2),
      code: Code.fromInline(handlerCode),
      environment: {
         COLLECTION_ENDPOINT: props.collectionEndpoint,
         INDEX_NAME: props.indexName,
      },
   });

   initFunction.addToRolePolicy(
      new PolicyStatement({
         effect: Effect.ALLOW,
         actions: ['aoss:APIAccessAll'],
         resources: [props.collectionArn],
      })
   );

   const provider = new Provider(scope, 'IndexInitProvider',
                                 { onEventHandler: initFunction, });

   return new CustomResource(scope, 'IndexInitResource',
   {
      serviceToken: provider.serviceToken,
      properties: {
         CollectionEndpoint: props.collectionEndpoint,
         IndexName: props.indexName,
      },
   });
}
