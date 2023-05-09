import { RoleType, Role } from '../Role/roleTypes';
import { emptyGyet, Gyet } from '../User/userType';
import { Xbiis as box } from "../types/AmplifyTypes";

/**
 * Box Type (container for grouping content items/permissions)
 */
export type Xbiis = box;
/*export interface Xbiis {
   id:           string,
   name:         string,
   owner:        Gyet,
   defaultRole?: RoleType,
} */

export const emptyXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '',
   name:         '',
   owner:        emptyGyet,
   xbiisOwnerId: emptyGyet.id,
   defaultRole:  Role.Write,
   createdAt:    '',
   updatedAt:    '',
};

export const initialXbiis: Xbiis = {
   __typename:  'Xbiis',
   id:          'a95212b3-dff4-4286-9602-aab1c6ef9c5a',
   name:        'Nlip \'gynnm', //belongs to everyone
   owner:       emptyGyet, //TODO: set to My ownerId
   xbiisOwnerId: emptyGyet.id,
   defaultRole: Role.Write,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

export const DefaultBox = initialXbiis;