import { emptyUser, SystemUser, User } from '../User/userType';
import { AccessLevel, BoxPurpose, BoxUser as BU, Xbiis as BX } from "../graphql/API";
import { DefaultBox as DefaultBoxData } from "../data/DefaultBox.js";
import { FixRequired, printName } from "../types";


/**
 * Box Type (container for grouping content items/permissions)
 */
export type Xbiis = FixRequired<BX, 'owner' | 'xbiisOwnerId' | 'ownerUserId'
                               | 'purpose' >;

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
   ownerUserId:  emptyUser.id,
   purpose:      null,
   defaultRole:  AccessLevel.WRITE,
   createdAt:    '',
   updatedAt:    '',
};

export const DefaultBox: Xbiis   = DefaultBoxData;
export const initialXbiis: Xbiis = DefaultBox;

export const printXbiis = (box: Xbiis) => { return printName(box); }

export const printBox = (box: Xbiis) => { return printName(box); }