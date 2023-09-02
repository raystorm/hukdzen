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
   xbiisOwnerId: '62736e84-c949-4e34-872e-c28ed83e6195',
   defaultRole:  Role.Write,
   createdAt:    '2023-06-23T01:13:51.459Z',
   updatedAt:    '2023-07-23T19:37:01.255Z',
};

export const printXbiis = (box: Xbiis) => { return printName(box); }
export const printBox = (box: Xbiis) => { return printName(box); }

export const DefaultBox = initialXbiis;