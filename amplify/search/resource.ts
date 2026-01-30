import { Stack } from 'aws-cdk-lib';
import * as opensearchserverless from 'aws-cdk-lib/aws-opensearchserverless';

interface SearchResourceProps
{
   env: 'dev' | 'prod';
   stack: Stack;
}

export function createSearchCollection(props: SearchResourceProps)
{
   const { env, stack } = props;

   const collection = new opensearchserverless.CfnCollection(stack, 'SearchCollection',
   {
      name: `hukdzen-${env}`,
      type: 'SEARCH',
      description: `Hukdzen ${env} search collection`,
   });

   const encryptionPolicy = new opensearchserverless.CfnSecurityPolicy(
      stack, 'EncryptionPolicy',
      {
         name: `hukdzen-${env}-encryption`,
         type: 'encryption',
         policy: JSON.stringify({
            Rules: [
               {
                  ResourceType: 'collection',
                  Resource: [`collection/hukdzen-${env}`],
               },
            ],
            AWSOwnedKey: true,
         }),
      }
   );

   const networkPolicy = new opensearchserverless.CfnSecurityPolicy(
      stack, 'NetworkPolicy',
      {
         name: `hukdzen-${env}-network`,
         type: 'network',
         policy: JSON.stringify([
            {
               Rules: [
                  {
                     ResourceType: 'collection',
                     Resource: [`collection/hukdzen-${env}`],
                  },
               ],
               AllowFromPublic: false,
               SourceVPCEs: [],
            },
         ]),
      }
   );

   collection.addDependency(encryptionPolicy);
   collection.addDependency(networkPolicy);

   return {
      collectionEndpoint: collection.attrCollectionEndpoint,
      collectionArn: collection.attrArn,
      collectionName: `hukdzen-${env}`,
   };
}
