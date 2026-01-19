import { buildInvalidGraphQLError } from '../error';
import { logger } from './logger';

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
   let value: T | null = null;

   let cause: unknown;

   try { value = selector(response); }
   catch (e) { cause = e; } //save error, will be handled in !value below

   if (!value)
   {
      const err = buildInvalidGraphQLError(`${label} missing from GraphQL response.`, cause);
      logger.error(err);
      throw err;
   }

   return value;
};