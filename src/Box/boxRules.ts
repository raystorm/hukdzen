import { Role, hasReadAccess, hasWriteAccess } from "../Role/roleTypes";
import type { BoxUser } from "../BoxUser/BoxUserType";
import type { Xbiis } from "./boxTypes";
import { DefaultBox, BoxPurpose } from "./boxTypes";

export const isReadable = (boxUser: BoxUser) =>
  ( hasReadAccess(boxUser.role) || isOwner(boxUser) );

export const isWritable = (boxUser: BoxUser) =>
  ( hasWriteAccess(boxUser.role) || isOwner(boxUser) );

export const isOwner = (boxUser: BoxUser) =>
  ( boxUser.box.xbiisOwnerId === boxUser.boxUserUserId )


export const isDefaultBox = (box: Xbiis) =>
   box.id === DefaultBox.id;

export const isUserBox = (box: Xbiis) =>
   box.purpose === BoxPurpose.USER;