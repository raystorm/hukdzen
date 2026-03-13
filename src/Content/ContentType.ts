import { Content, Summary } from '../graphql/API';

export type { Content, Summary };

export const emptySummary: Summary = {
   __typename: 'Summary',
}

/**
 *  Helper to build Summary objects
 *  @param title
 *  @param description
 */
export const buildSummary = (title: string | null | undefined,
                             description: string | null | undefined): Summary =>
{
   return {
      __typename: 'Summary',
      title:      title,
      description: description,
   };
}