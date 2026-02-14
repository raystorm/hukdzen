import { emptyUser, SystemUser } from '../User/userType';
import { AccessLevel, BoxPurpose, Xbiis } from "../types/AmplifyTypes";
import { printName } from "../types";

/**
 * Box Type (container for grouping content items/permissions)
 */
export type { Xbiis };
/*export interface Xbiis {
   id:           string,
   name:         string,
   owner:        Gyet,
   defaultRole?: AccessLevel,
} */

export { AccessLevel, BoxPurpose };

/**
 * Empty Helper object for working with Boxes.
 * **Notes:** extends to make purpose nullable. (forces setting before use)
 */
export const emptyXbiis: Xbiis & { purpose: BoxPurpose | null } = {
   __typename:   'Xbiis',
   id:           '',
   name:         '',
   owner:        emptyUser,
   xbiisOwnerId: emptyUser.id,
   purpose:      null,
   defaultRole:  AccessLevel.WRITE,
   createdAt:    '',
   updatedAt:    '',
};

export const initialXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '75ca183f-a199-4d3d-9ac3-e10432965276',
   name:         'Public', //belongs to everyone
   waa:          'Nlip \'gynnm', //belongs to everyone
   owner:        SystemUser,
   xbiisOwnerId: SystemUser.id,
   purpose:      BoxPurpose.DEFAULT,
   defaultRole:  AccessLevel.WRITE,
   createdAt:    '2023-01-01T00:00:00.000Z',
   updatedAt:    '2023-01-01T00:00:00.000Z',
};

export const printXbiis = (box: Xbiis) => { return printName(box); }

export const printBox = (box: Xbiis) => { return printName(box); }

export const DefaultBox = initialXbiis;