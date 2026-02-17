import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

export function configureBoxUserHydrator(backend: any)
{
   const dataResources = backend.data.resources as any;
   const lambda = backend.boxUserHydrator.resources.lambda;

   // 1. Create the data source using DataFactory
   const dataBackend = backend.data as any;
   dataBackend.addLambdaDataSource('BoxUserHydratorDS', lambda);

   // 2. Wire the resolver using CDK
   new CfnResolver(backend.stack, 'ListBoxUsersDetailedResolver',
   {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'listBoxUsersDetailed',
      dataSourceName: 'BoxUserHydratorDS',
      kind: 'UNIT',
   });
}
