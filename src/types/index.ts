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

/**
 *  Filter function for array.filter() to remove null and undefined values
 *  @param value Value to be checked for null or undefined
 */
export const nullFilter = <T>(value: (T | null | undefined)): value is T =>
{ return null != value && undefined !== value; }

/**
 *  Filter function for array.filter() to remove empty values
 *  **Note:** Empty is any falsy value, including `0`, `false`, and ''.
 *  @param value Value to be checked for empty
 */
export const emptyFilter = <T>(value: (T | null | undefined)): value is T =>
{ return !!value; }

export const idFilter = (value: hasId | null | undefined): value is hasId =>
{ return !!value && '' !== value.id.trim(); };

export const nameFilter = (value: printableNameType): value is printableName =>
{ return !!value && '' !== value.name.trim(); };

export const waaFilter = (value: printableNameType): value is printableName =>
{ return !!value && !!value.waa && '' !== value.waa.trim(); }

export const nameOrWaaFilter = (value: printableNameType): value is printableName =>
{
   return !!value && ( '' !== value.name.trim()
                    || ( !!value.waa && '' !==  value.waa.trim() ) );
}

/**
 *  Backend Field filter function for array.filter() to check for non-empty string fields
 *  Helper method for the explicit filters above
 *  @param value - item to be checked for empty field(s)
 *  @param fields - field(s) to be checked for empty
 *  @returns true if at least one of the specified fields is a non-empty string
 * / // implementation not used, left here for future consolidation, if filter needs grow
const fieldFilter = <T>(value: T | null | undefined,
                        fields: keyof T | (keyof T)[]): value is T =>
{
   if (!value) { return false; }

   const fieldList = Array.isArray(fields) ? fields : [fields];

   return fieldList.some(field => {
      const val = value[field];
      return typeof val === 'string' && val.trim() !== '';
   });
}
*/

//------------------------------------------------------------------
// Type Utilities
//------------------------------------------------------------------

/** Makes specific fields of a type required and non-nullable. */
export type FixRequired<T, K extends keyof T> =
   Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

