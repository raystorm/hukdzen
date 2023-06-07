import { User as _user } from "../types/AmplifyTypes";


/**
 * Local User Type
 */
export type User = _user;

export const emptyUser: User = {
    __typename: 'User',
    id:       '',
    name:     '',
    email:    '',
    isAdmin:  false,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const initUser: User = {
    __typename: 'User',
    id:       'SOME_GUID',
    name:     '',
    email:    '',
    isAdmin:  true,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};