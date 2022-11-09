import { RoleType, Role } from '../Role/roleTypes';
import { emptyGyet, Gyet } from '../User/userType';


/**
 * Box Type (container for grouping content items/permissions)
 */
export interface Xbiis {
   id:           string,
   name?:        string,
   owner?:       Gyet,
   defaultRole?: RoleType,
}

export const emptyXbiis: Xbiis = {
   id:          '',
   name:        '',
   owner:       emptyGyet,
   defaultRole: Role.Write,
};

export const initialXbiis: Xbiis = {
   id:          'a95212b3-dff4-4286-9602-aab1c6ef9c5a',
   name:        'Nlip \'gynnm', //belongs to everyone
   owner:       emptyGyet, //TODO: set to My ownerId
   defaultRole: Role.Write,
};

export const DefaultBox = initialXbiis;