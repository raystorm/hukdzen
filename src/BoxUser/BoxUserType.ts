import { BoxUser as BU } from "../graphql/API";
import { emptyUser, User } from "../User/userType";
import { printGyet } from "../Gyet/GyetType";
import { DefaultRole } from "../Role/roleTypes";
import type { Box } from "../Box/boxTypes";
import { AccessLevel, DefaultBox, emptyBox, printBox } from "../Box/boxTypes";
import { FixRequired } from "../types";

export type BoxUser = FixRequired<BU, 'user' | 'userUserId' | 'boxUserUserId'
                                    | 'box'  | 'boxUserBoxId' > & { user: User; box: Box; };


export const emptyBoxUser: BoxUser = {
   __typename:    'BoxUser',
   id:            '',
   user:          emptyUser,
   boxUserUserId: emptyUser.id,
   userUserId:    emptyUser.id,
   box:           emptyBox,
   boxUserBoxId:  emptyBox.id,
   role:          DefaultRole,
   createdAt:     new Date().toISOString(),
   updatedAt:     new Date().toISOString(),
}

export interface BoxUserState {
   item:  BoxUser;
   error: string | null;
}

export const initialBoxUserState: BoxUserState = {
   item:  emptyBoxUser,
   error: null,
};

export const buildBoxUser = (user: User,
                             box: Box = DefaultBox,
                             role: AccessLevel = DefaultRole) : BoxUser =>
{
   return {
      ...emptyBoxUser,
      user:          user,
      boxUserUserId: user.id,
      userUserId:    user.id,
      box:           box,
      boxUserBoxId:  box.id,
      role:          role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   };
}

export const printBoxUser = (boxUser: BoxUser | null) =>
{
   if ( !boxUser || !boxUser.user ) { return ''; }
   return `${printGyet(boxUser.user)} | ${printBoxRoleFromBoxUser(boxUser)}`
}

export const printBoxRoleFromBoxUser = (boxUser: BoxUser | null) =>
{
   if ( !boxUser || !boxUser.box ) { return '' }
   return `${printBox(boxUser.box)} | ${boxUser.role}`;
};
