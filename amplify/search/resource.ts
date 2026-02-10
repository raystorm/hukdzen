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
               AllowFromPublic: true,
            },
         ]),
      }
   );

   // Data access policy - grants Lambda execution roles access to the collection
   // TODO: Tighten this policy to specific Lambda role ARNs instead of account root
   // Current: Account root (allows all IAM principals in account)
   // Should be: specific role ARNs for indexInit, ingestTrigger, searchRunner
   const dataAccessPolicy = new opensearchserverless.CfnAccessPolicy(
      stack, 'DataAccessPolicy',
      {
         name: `hukdzen-${env}-data-access`,
         type: 'data',
         policy: JSON.stringify([
            {
               Rules: [
                  {
                     ResourceType: 'collection',
                     Resource: [`collection/hukdzen-${env}`],
                     Permission: ['aoss:*'],
                  },
                  {
                     ResourceType: 'index',
                     Resource: [`index/hukdzen-${env}/*`],
                     Permission: ['aoss:*'],
                  },
               ],
               Principal: [`arn:aws:iam::${stack.account}:root`],
            },
         ]),
      }
   );

   collection.addDependency(encryptionPolicy);
   collection.addDependency(networkPolicy);
   collection.addDependency(dataAccessPolicy);

   const collectionEndpoint = collection.attrCollectionEndpoint;
   const collectionArn = collection.attrArn;

   // Index initialization now handled by indexInit Lambda via configureIndexInit in backend.ts

   return {
      collectionEndpoint,
      collectionArn,
      collectionName: `hukdzen-${env}`,
   };
}
