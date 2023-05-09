import { AccessLevel } from "../types/AmplifyTypes";


/**
 * Role Type for content Item permissions tracking
 */
export type RoleType = AccessLevel;

/*
export interface RoleType {
    name: string,
    //TODO: consider a Smalgyax Name as well as an English one
    read: boolean,
    write: boolean,
}
*/

const buildRole = (name: string) => { return name.toUpperCase() as RoleType; }

export const printRole = (role?: RoleType | null) =>
{ 
   if ( !role ) { return undefined; }
   //return role.name;
   return role.toString();
}

/**
 *  Hardcoded Roles
 */
export const Role = {
    Read:  buildRole('Read'),
    Write: buildRole('Write'),
} as const;

export const DefaultRole = Role.Write;