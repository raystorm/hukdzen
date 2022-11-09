import { RoleType, Role } from '../Role/roleTypes';


/**
 * Box Type (container for grouping content items/permissions)
 */
export interface Xbiis {
    id:           string,
    name?:        string,
    ownerId?:     string,
    defaultRole?: RoleType,
}

export const emptyXbiis: Xbiis = {
    id:          '',
    name:        '',
    ownerId:     '',
    defaultRole: Role.Write,
};

export const initialXbiis: Xbiis = {
    id:          'a95212b3-dff4-4286-9602-aab1c6ef9c5a',
    name:        'Nlip \'gynnm', //belongs to everyone
    ownerId:     '', //TODO: set to My ownerId
    defaultRole: Role.Write,
};

export const DefaultBox = initialXbiis;