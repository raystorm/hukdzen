import {BoxUser as BU} from "../types/AmplifyTypes";
import {emptyUser, User} from "../User/userType";
import { printGyet } from "../Gyet/GyetType";
import {DefaultRole, RoleType} from "../Role/roleTypes";
import {DefaultBox, emptyXbiis, printXbiis, Xbiis} from "../Box/boxTypes";

export type BoxUser = BU;

export const emptyBoxUser: BoxUser = {
   __typename:       'BoxUser',
   id:               '',
   user:             emptyUser,
   boxUserUserId:    emptyUser.id,
   box:              emptyXbiis,
   boxUserBoxId:     emptyXbiis.id,
   role:             DefaultRole,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

export const buildBoxUser = (user: User,
                             box: Xbiis = DefaultBox,
                             role: RoleType = DefaultRole) : BoxUser =>
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

export const printBoxUser = (boxUser: BoxUser) => {
   return `${printGyet(boxUser.user)} | ${printBoxRoleFromBoxUser(boxUser)}`
}

export const printBoxRoleFromBoxUser = (boxUser: BoxUser) => {
  return `${printXbiis(boxUser.box)} | ${boxUser.role}`;
};
