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
export const printName = (name?: printableNameType) => {
   if ( !name ) { return ''; }
   return `${name.name}${name.waa?` (${name.waa})` : ''}`;
};

/**
 *   Prints `Waa (Name)` for a passed in Object.
 *   Waa is omitted if the field is empty
 *   @param waa Object to be printed
 */
export const printWaa = (waa?: printableNameType) => {
   console.log(`creating name string for: ${JSON.stringify(waa)}`);
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