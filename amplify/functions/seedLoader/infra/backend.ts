import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const configureSeedLoader = (backend: any) =>
{
   const userTable   = backend.data.resources.tables['User'];
   const boxTable    = backend.data.resources.tables['Box'];
   const authorTable = backend.data.resources.tables['Author'];

   const loader = backend.seedLoader as any;

   loader.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   loader.addEnvironment('BOX_TABLE_NAME', boxTable.tableName);
   loader.addEnvironment('AUTHOR_TABLE_NAME', authorTable.tableName);

   userTable.grantWriteData(loader.resources.lambda);
   boxTable.grantWriteData(loader.resources.lambda);
   authorTable.grantWriteData(loader.resources.lambda);

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
      policy: AwsCustomResourcePolicy.fromStatements([
         new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['lambda:InvokeFunction'],
            resources: [loader.resources.lambda.functionArn],
         }),
      ]),
   });
};
