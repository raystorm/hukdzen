import { BoxUser as BU } from "../graphql/API";
import { emptyUser, User } from "../User/userType";
import { printGyet } from "../Gyet/GyetType";
import { DefaultRole } from "../Role/roleTypes";
import type { Xbiis } from "../Box/boxTypes";
import { AccessLevel, DefaultBox, emptyXbiis, printXbiis } from "../Box/boxTypes";
import { FixRequired } from "../types";

export type BoxUser = FixRequired<BU, 'user' | 'userUserId' | 'boxUserUserId'
                                    | 'box'  | 'boxUserBoxId'>;


export const emptyBoxUser: BoxUser = {
   __typename:    'BoxUser',
   id:            '',
   user:          emptyUser,
   boxUserUserId: emptyUser.id,
   userUserId:    emptyUser.id,
   box:           emptyXbiis,
   boxUserBoxId:  emptyXbiis.id,
   role:          DefaultRole,
   createdAt:     new Date().toISOString(),
   updatedAt:     new Date().toISOString(),
}

export const buildBoxUser = (user: User,
                             box: Xbiis = DefaultBox,
                             role: AccessLevel = DefaultRole) : BoxUser =>
{
   return {
      ...emptyBoxUser,
      user:          user,
      boxUserUserId: user.id,
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
   return `${printXbiis(boxUser.box)} | ${boxUser.role}`;
};
