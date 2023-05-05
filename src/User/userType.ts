import {Gyet as _user, ModelBoxRoleConnection} from "../types/AmplifyTypes";

import { BoxRole } from './BoxRoleType';
import { ClanType } from './ClanType';


/**
 * Local User Type
 */
export type Gyet = _user;

/*
export interface Gyet {
    id:        string,
    name:      string,
    email:     string,
    clan?:     ClanType,
    waa?:      string, //smalgyax name
    isAdmin?:   boolean,
    boxRoles?: BoxRole[],
}
*/

export const printUser = (user: Gyet) => 
{ return `${user.name}${user.waa?` (${user.waa})` : ''}`; }

export const compareUser = (og: Gyet, bob: Gyet) => {
    return og.id === bob.id
}

export const emptyGyet: Gyet = {
    __typename: 'Gyet',
    id:       '',
    name:     '',
    email:    '',
    isAdmin:  false,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const initGyet: Gyet = {
    __typename: 'Gyet',
    id:       'SOME_GUID',
    name:     '',
    email:    '',
    isAdmin:  true,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};