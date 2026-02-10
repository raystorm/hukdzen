import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const configureIndexInit = (backend: any, collectionEndpoint: string,
                                   collectionArn: string, indexName: string) =>
{
   const init = backend.indexInit as any;

   init.addEnvironment('COLLECTION_ENDPOINT', collectionEndpoint);
   init.addEnvironment('INDEX_NAME', indexName);

   init.resources.lambda.addToRolePolicy(
      new PolicyStatement({
         effect: Effect.ALLOW,
         actions: ['aoss:APIAccessAll'],
         resources: [collectionArn],
      })
   );

   const stack = backend.createStack('opensearch-init');

   new AwsCustomResource(stack, 'InitOpenSearchIndex', {
      onCreate: {
         service:    'Lambda',
         action:     'invoke',
         parameters: {
            FunctionName:   init.resources.lambda.functionName,
            InvocationType: 'RequestResponse',
         },
         physicalResourceId: PhysicalResourceId.of('InitOpenSearchIndex'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([
         new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['lambda:InvokeFunction'],
            resources: [init.resources.lambda.functionArn],
         }),
      ]),
   });
};
