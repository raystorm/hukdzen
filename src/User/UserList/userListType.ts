import { ModelUserConnection } from "../../types/AmplifyTypes";

/**
 * Local UserList Type
 */
export interface userList extends ModelUserConnection { }

//match listgyets(ish)
export const emptyUserList: ModelUserConnection =
{
   __typename: "ModelUserConnection",
   items:      [],
   //nextToken?: string | null,
};