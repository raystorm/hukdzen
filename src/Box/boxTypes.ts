import { emptyUser, SystemUser, User } from '../User/userType';
import { AccessLevel, BoxPurpose, BoxUser as BU, Box as BX } from "../graphql/API";
import { DefaultBox as DefaultBoxData } from "../data/DefaultBox.js";
import { FixRequired, printName } from "../types";


/**
 * Box Type (container for grouping content items/permissions)
 */
export type Box = FixRequired<BX, 'owner' | 'boxOwnerId' | 'ownerUserId'
                               | 'purpose' >;

/*export interface Box {
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
export const emptyBox: Box & { purpose: BoxPurpose | null } = {
   __typename:   'Box',
   id:           '',
   name:         '',
   owner:        emptyUser,
   ownerUserId:  emptyUser.id,
   //@ts-ignore
   purpose:      null,
   defaultRole:  AccessLevel.WRITE,
   createdAt:    '',
   updatedAt:    '',
};

export const DefaultBox: Box   = DefaultBoxData as Box;
export const initialBox: Box = DefaultBox;

export interface BoxState {
   box: Box;
   error: string | null;
}

export const initialBoxState: BoxState = {
   box: DefaultBox,
   error: null
};

export const printBox = (box: Box) => { return printName(box); }