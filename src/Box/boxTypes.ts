import { Role } from '../Role/roleTypes';
import { emptyUser } from '../User/userType';
import { Xbiis as box } from "../types/AmplifyTypes";
import {printName} from "../types";

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
   owner:        emptyUser,
   xbiisOwnerId: emptyUser.id,
   defaultRole:  Role.Write,
   createdAt:    '',
   updatedAt:    '',
};

export const initialXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '75ca183f-a199-4d3d-9ac3-e10432965276',
   name:         'Public', //belongs to everyone
   waa:          'Nlip \'gynnm', //belongs to everyone
   owner:        emptyUser,
   xbiisOwnerId: emptyUser.id,
   defaultRole:  Role.Write,
   createdAt:    new Date().toISOString(),
   updatedAt:    new Date().toISOString(),
};

export const printXbiis = (box: Xbiis) => { return printName(box); }
export const printBox = (box: Xbiis) => { return printName(box); }

export const DefaultBox = initialXbiis;