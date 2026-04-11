import { Role, hasReadAccess, hasWriteAccess } from "../Role/roleTypes";
import type { BoxUser } from "../BoxUser/BoxUserType";
import type { Box } from "./boxTypes";
import { DefaultBox, BoxPurpose } from "./boxTypes";

export const isReadable = (boxUser: BoxUser) =>
  ( hasReadAccess(boxUser.role) || isOwner(boxUser) || isDefaultBox(boxUser.box) );

export const isWritable = (boxUser: BoxUser) =>
  ( hasWriteAccess(boxUser.role) || isOwner(boxUser) || isDefaultBox(boxUser.box) );

export const isOwner = (boxUser: BoxUser) =>
  ( boxUser.box.boxOwnerId === boxUser.userUserId );

export const isDefaultBox = (box: Box) =>
   box.id === DefaultBox.id;

export const isUserBox = (box: Box) =>
   box.purpose === BoxPurpose.USER;