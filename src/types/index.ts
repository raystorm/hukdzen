/**
 * File for Shared Types, and base Type Utilities
 */

//Should this be in interface in `schema.graphql` ?
export interface printableName {
   name: string,
   waa?: string | null
};

export type printableNameType = printableName | null;

/**
 *   Prints `Name (Waa)` for a passed in Object.
 *   (Waa) is omitted if the field is empty
 *   @param name Object to be printed
 */
export const printName = (name?: printableNameType): string => {
   if ( !name ) { return ''; }
   //console.log(`printing name for: ${JSON.stringify(name)}`);
   return `${name.name??''}${name.waa?` (${name.waa})` : ''}`;
};

/**
 *   Prints `Waa (Name)` for a passed in Object.
 *   Waa is omitted if the field is empty
 *   @param waa Object to be printed
 */
export const printWaa = (waa?: printableNameType): string => {
   //console.log(`creating name string for: ${JSON.stringify(waa)}`);
   if ( !waa ) { return ''; }
   return `${waa.waa? waa.waa : ''} (${waa.name})`;
}


//------------------------------------------------------------------


export interface hasId {
   __typename: string,
   id: string,
}

/**
 *  Compares Objects based on type and ID.
 *  @param og    original
 *  @param other second object to compare against
 */
export const compareObjects = (og: hasId, other: hasId): boolean => {
   return og.__typename === other.__typename && og.id === other.id;
}

//TODO: think about a shared sortObjects function


//------------------------------------------------------------------

export interface printableTitles {
   eng_title: string,
   bc_title:  string,
   ak_title:  string,
}

export type printableTitlesType = printableTitles | null;

/**
 *  Prints titles in `Eng / BC / AC `order and format for a passed in Object.
 *  Empty titles are omitted from the string.
 *  @param titles Object to be printed
 */
export const printTitles = (titles?: printableTitlesType): string =>
{
   if ( !titles ) { return ''; }
   //return `${titles.eng_title} / ${titles.bc_title} / ${titles.ak_title}`;

   //build an array of titles, filter out empty ones
   const printMe = [ titles.eng_title, titles.bc_title, titles.ak_title ]
                   .filter(v => v != null && v !== "")
   return printMe.length > 0 ? printMe.join(' / ') : '';
}