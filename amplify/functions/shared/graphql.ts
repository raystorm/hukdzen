import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Sha256 } from '@aws-crypto/sha256-js';

//import { logger } from './logger';

const GRAPHQL_ENDPOINT = process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT!;
const REGION = process.env.AWS_REGION!;

export type GraphQLResult<T> = {
   data?: T;
   errors?: any[];
};


/**
 * Minimal, server‑side GraphQL client for Lambda → AppSync calls.
 *
 * What this is:
 * - A thin wrapper around AppSync’s GraphQL HTTP endpoint.
 * - Uses SigV4 signing with the Lambda’s IAM execution role.
 * - Sends a POST { query, variables } body and returns the JSON response.
 * - Explicit, stateless, and safe to reuse across multiple Lambdas.
 *
 * What it does:
 * - Builds a canonical HTTP request for AppSync.
 * - Signs it using AWS SDK v3’s SignatureV4 utilities.
 * - Performs the fetch and surfaces GraphQL errors as normal JS errors.
 *
 * Required libraries:
 * - @aws-sdk/signature-v4          (SigV4 signing)
 * - @aws-sdk/protocol-http         (HttpRequest shape)
 * - @aws-sdk/credential-provider-node (Lambda IAM credential resolution)
 * - @aws-crypto/sha256-js          (SHA256 hashing for SigV4)
 *
 * This module intentionally avoids Amplify’s client abstractions.
 * It encodes the only invariant we rely on: Lambdas call AppSync using IAM.
 */
export async function graphql<T>(query: string, variables?: any): Promise<GraphQLResult<T>>
{
   //logger.info('GraphQL endpoint:', GRAPHQL_ENDPOINT);
   //logger.info('Region:', REGION);

   const url = new URL(GRAPHQL_ENDPOINT);
   const body = JSON.stringify({ query, variables });

   const request = new HttpRequest({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         host: url.hostname,
      },
      body,
   });

   const signer = new SignatureV4({
      service: 'appsync',
      region: REGION,
      credentials: defaultProvider(),
      sha256: Sha256,
   });

   const signedRequest = await signer.sign(request);

   const response = await fetch(url.toString(), {
      method: signedRequest.method,
      headers: signedRequest.headers,
      body: signedRequest.body,
   });

   if (!response.ok)
   {
      const error = await response.text();
      throw new Error(`GraphQL request failed: ${error}`);
   }

   return await response.json() as GraphQLResult<T>;
}
