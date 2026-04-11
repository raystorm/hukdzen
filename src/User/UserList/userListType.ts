import { ModelUserConnection } from "../../graphql/API";
import type { User } from "../userType";

/**
 * Local UserList Type
 */
//export interface userList extends ModelUserConnection { }
export type userList = Omit<ModelUserConnection, 'items'> & {
   items: User[];
};

//match listgyets(ish)
export const emptyUserList: ModelUserConnection =
{
   __typename: "ModelUserConnection",
   items:      [],
   //nextToken?: string | null,
};