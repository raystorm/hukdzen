import { BoxUserList as BUL } from "../../graphql/API";
import { BoxUser } from "../BoxUserType";
import { FixRequired } from "../../types";

//export type { BoxUserList };

export type BoxUserList = BUL & { items: BoxUser[]; };

/**
 * Local BoxUserList Type
 */
//export interface BoxUserList extends ModelBoxUserConnection { }


export const emptyBoxUserList: BoxUserList = {
    __typename: "BoxUserList",
    items: [],
};