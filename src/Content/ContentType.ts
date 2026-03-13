import { Content, Summary } from '../graphql/API';
import { Document } from "../docs/DocumentTypes";
import { Collection } from "../collections/CollectionTypes";

export type { Content, Summary };

export type ContentType = Content | Document | Collection;

export const emptySummary: Summary = {
   __typename: 'Summary',
}

/**
 *  Helper to build Summary objects
 *  @param title
 *  @param description
 */
export const buildSummary = (title?: string | null,
                             description?: string | null): Summary | null =>
{
   if ( !title && !description ) { return null; }
   return {
      __typename: 'Summary',
      title:      title,
      description: description,
   };
}

/*
 * TODO: Missing functions
 *   printSummary / PrintTitles
 *   printContent
 *   compareContent
 */