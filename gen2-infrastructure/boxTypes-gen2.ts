import { Role } from '../Role/roleTypes';
import { emptyUser, User, SystemUser } from '../User/userType';
import { AccessLevel, BoxPurpose, Xbiis } from "../types/AmplifyTypes";
import { printName } from "../types";

/**
 * Box Type (container for grouping content items/permissions)
 */
export type { Xbiis };

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
   defaultRole:  Role.Write,
   createdAt:    '',
   updatedAt:    '',
};

/**
 * Default Public Box
 * Owned by System user (not admin) for consistency across environments
 */
export const initialXbiis: Xbiis = {
   __typename:   'Xbiis',
   id:           '75ca183f-a199-4d3d-9ac3-e10432965276',
   name:         'Public',
   waa:          'Nlip \'gynnm',
   owner:        SystemUser,
   xbiisOwnerId: SystemUser.id,
   purpose:      BoxPurpose.DEFAULT,
   defaultRole:  Role.Write,
   createdAt:    '2023-06-23T01:13:51.459Z',
   updatedAt:    '2023-07-23T19:37:01.255Z',
};

export const printXbiis = (box: Xbiis) => { return printName(box); }

export const printBox = (box: Xbiis) => { return printName(box); }

export const DefaultBox = initialXbiis;
