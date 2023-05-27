import { BoxUser as BU } from "../types/AmplifyTypes";
import { emptyGyet } from "../User/userType";
import { emptyBoxRole } from "../BoxRole/BoxRoleType";

export type BoxUser = BU;

export const emptyBoxUser: BoxUser = {
   __typename: "BoxUser",
   id: '',
   user: emptyGyet,
   boxUserUserId: emptyGyet.id,
   boxRole:   emptyBoxRole,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}
