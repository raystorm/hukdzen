import { Content, Summary } from '../graphql/API';
import { Document } from "../docs/DocumentTypes";
import { Collection } from "../collections/CollectionTypes";
import { compareObjects } from "../types";

export type { Content, Summary };

export type ContentType = Content | Document | Collection;

export const emptySummary: Summary = { __typename: 'Summary', }

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
      __typename:  'Summary',
      title:       title,
      description: description,
   };
}

export interface printableTitles
{
   eng?: { title?: string | null } | null;
   bc?: { title?: string | null } | null;
   ak?: { title?: string | null } | null;
}

export type printableTitlesType = printableTitles | null;

/**
 *  Prints titles in `Eng / BC / AC `order and format for a passed in Object.
 *  Empty titles are omitted from the string.
 *  @param titles Object to be printed
 */
export const printTitles = (titles?: printableTitlesType): string =>
{
   if (!titles) { return ''; }

   //build an array of titles, filter out empty ones
   const printMe = [titles.eng?.title, titles.bc?.title, titles.ak?.title]
           .filter(v => null != v && undefined != v && "" !== v)
   return printMe.length > 0 ? printMe.join(' / ') : '';
}

export const printContent = (content: ContentType): string =>
{
   if ('Document' === content.__typename)
   { return printTitles({eng: content.eng, bc: content.bc, ak: content.ak}); }
   else if ('Collection' === content.__typename)
   {
      return printTitles({eng: content.eng_title ? {title: content.eng_title} : null,
                          bc: content.bc_title ? {title: content.bc_title} : null,
                          ak: content.ak_title ? {title: content.ak_title} : null});
   }
   else { return printTitles({eng: content.eng, bc: content.bc, ak: content.ak}); }
}

export const printSummary = (summary?: Summary | null): string =>
{ return summary?.title?.trim() ?? ''; }


export const titleFilter = (titles: printableTitlesType): titles is printableTitles =>
{
   return !!titles && ( (!!titles.eng?.title && '' !== titles.eng.title.trim())
                     || (!!titles.bc?.title  && '' !== titles.bc.title.trim())
                     || (!!titles.ak?.title  && '' !== titles.ak.title.trim()));
};

/**
 *  Compares Content objects based on type and ID.
 *  @param og
 *  @param other
 */
export const compareContent = (og: ContentType, other: ContentType): boolean =>
{ return compareObjects(og, other); }