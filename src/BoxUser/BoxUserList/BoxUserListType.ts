import { BoxUserList as BUL } from "../../graphql/API";
import { FixRequired } from "../../types";

//export type { BoxUserList };

export type BoxUserList = FixRequired<BUL, 'items'>;

/**
 * Local BoxUserList Type
 */
//export interface BoxUserList extends ModelBoxUserConnection { }


export const emptyBoxUserList: BoxUserList = {
    __typename: "BoxUserList",
    items: [],
};