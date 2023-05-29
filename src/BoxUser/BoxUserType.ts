import {BoxUser as BU} from "../types/AmplifyTypes";
import {emptyGyet, Gyet, printUser} from "../User/userType";
import {BoxRole, emptyBoxRole, printBoxRole} from "../BoxRole/BoxRoleType";
import boxRoleSlice from "../BoxRole/BoxRoleSlice";

export type BoxUser = BU;

export const emptyBoxUser: BoxUser = {
   __typename:       'BoxUser',
   id:               '',
   user:             emptyGyet,
   boxUserUserId:    emptyGyet.id,
   boxRole:          emptyBoxRole,
   boxUserBoxRoleId: emptyBoxRole.id,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

export const buildBoxUser = (user: Gyet, boxRole: BoxRole) : BoxUser => {
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
   return `${printUser(boxUser.user)} | ${printBoxRole(boxUser.boxRole)}`
}