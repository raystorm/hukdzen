import type { ModelXbiisConnection, } from "../../graphql/API";
import type { Xbiis } from '../boxTypes';

/* *
 * Local BoxList Type
 */
//export interface BoxList extends ModelXbiisConnection { }

/** safe, simple null free items version */
export type BoxList = Omit<ModelXbiisConnection, 'items'> & {
    items: Xbiis[];
};

export const emptyBoxList: BoxList = {
    __typename: "ModelXbiisConnection",
    items: [],
};