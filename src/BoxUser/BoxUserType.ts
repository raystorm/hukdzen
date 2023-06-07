import {BoxUser as BU} from "../types/AmplifyTypes";
import {emptyUser, User} from "../User/userType";
import { printGyet } from "../Gyet/GyetType";
import {BoxRole, emptyBoxRole, printBoxRole} from "../BoxRole/BoxRoleType";
import boxRoleSlice from "../BoxRole/BoxRoleSlice";

export type BoxUser = BU;

export const emptyBoxUser: BoxUser = {
   __typename:       'BoxUser',
   id:               '',
   user:             emptyUser,
   boxUserUserId:    emptyUser.id,
   boxRole:          emptyBoxRole,
   boxUserBoxRoleId: emptyBoxRole.id,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

export const buildBoxUser = (user: User, boxRole: BoxRole) : BoxUser => {
   return {
      ...emptyBoxUser,
      user:             user,
      boxUserUserId:    user.id,
      boxRole:          boxRole,
      boxUserBoxRoleId: boxRole.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   };
}

export const printBoxUser = (boxUser: BoxUser) => {
   return `${printGyet(boxUser.user)} | ${printBoxRole(boxUser.boxRole)}`
}