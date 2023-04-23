import { RoleType as rType } from "../types/AmplifyTypes";


/**
 * Role Type for content Item perimssions tracking
 */
export type RoleType = rType;

/*
export interface RoleType {
    name: string,
    //TODO: consider a Smalgyax Name as well as an English one
    read: boolean,
    write: boolean,
}
*/

const buildRole = (name:string, read: boolean, write: boolean) =>
{ 
    return {
        name: name,
        toString: () => { printRole(this) as string; }
    } as RoleType;
}

export const printRole = (role?: RoleType | null) =>
{ 
   if ( !role ) { return undefined; }
   return role.name;
}

/**
 *  Hardcoded Roles
 */
export const Role = {
    ReadOnly:    buildRole('ReadOnly', true, false),
    Write:       buildRole('Write',    true, true),
} as const;

export const DefaultRole = Role.Write;