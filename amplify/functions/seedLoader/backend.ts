import { seedLoader } from './resource';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';

export const configureSeedLoader = (backend: any) =>
{
   const userTable  = backend.data.resources.tables['User'];
   const xbiisTable = backend.data.resources.tables['Xbiis'];

   const loader = seedLoader as any;

   loader.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   loader.addEnvironment('XBIIS_TABLE_NAME', xbiisTable.tableName);

   userTable.grantWriteData(loader.resources.lambda);
   xbiisTable.grantWriteData(loader.resources.lambda);

   const stack = backend.createStack('data-seeding');

   new AwsCustomResource(stack, 'SeedDefaultData', {
      onCreate: {
         service:    'Lambda',
         action:     'invoke',
         parameters: {
            FunctionName:   loader.resources.lambda.functionName,
            InvocationType: 'RequestResponse',
         },
         physicalResourceId: PhysicalResourceId.of('SeedDefaultData'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
         resources: [loader.resources.lambda.functionArn],
      }),
   });
};
