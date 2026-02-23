import { buildInvalidGraphQLError } from '../error';
import { logger } from './logger';
import { nullFilter } from "../types";

/**
 *  Extract a value from a GraphQL response, or throw an error if it's not there.
 *
 *  This is a helper for sagas that makes it easy to extract values from a
 *  GraphQL response, and throw a well-formed error if the value is missing.
 *
 *  @param response - The raw response from the GraphQL call
 *  @param selector - A function that takes the response and returns the desired value
 *  @param label - A descriptive label for the value being extracted
 *  @returns The value, if it exists
 *  @throws An error if the value doesn't exist
 */
export const validateResponse = <T>(response: any, selector: (r: any) => T,
                                    label: string): T =>
{
   let value: T | null  | undefined = undefined;

   let cause: unknown;

   try { value = selector(response); }
   catch (e) { cause = e; } //save error, will be handled in !value below

   if (value === undefined)
   {
      const err = buildInvalidGraphQLError(`${label} missing from GraphQL response.`, cause);
      logger.error(err);
      throw err;
   }

   return value;
};

/**
 *  Extracts the element type from an Amplify-style returned List type:
 *
 *    - Assumes: L['items'] is (T | null)[] | null
 *    - NonNullable<L['items']> removes the outer null → (T | null)[]
 *    - [number] extracts the array's element type → (T | null)
 *
 *  validateResponseList filters out nulls at runtime,
 *  so ListItem<L> represents the non-null item type carried by the list. (T)[]
 *  Type exists, to document, hide, and ease-of-use away,
 *  the arcane type incantations needed for extraction.
 */
type ListItem<L extends { items: (any | null)[] | null }> = NonNullable<L['items']>[number];


export const validateResponseList = <L extends { items: (any | null)[] | null }>
             (response: any, selector: (r: any) => L, label: string) =>
{
   const value = validateResponse(response, selector, label);

   if ( !value )
   {
      const err = buildInvalidGraphQLError(`${label} missing from GraphQL response.`);
      logger.error(err);
      throw err;
   }

   if (!Array.isArray(value.items))
   {
      const err = buildInvalidGraphQLError(`${label} items is invalid in server response.`);
      logger.error(err);
      throw err;
   }

   return {
      ...value,
      items: value.items.filter(nullFilter) as ListItem<L>[],
   };
};
