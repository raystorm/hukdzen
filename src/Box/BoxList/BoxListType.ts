import type { ModelBoxConnection, } from "../../graphql/API";
import type { Box } from '../boxTypes';

/* *
 * Local BoxList Type
 */
//export interface BoxList extends ModelBoxConnection { }

/** safe, simple null free items version */
export type BoxList = Omit<ModelBoxConnection, 'items'> & {
    items: Box[];
};

export const emptyBoxList: BoxList = {
    __typename: "ModelBoxConnection",
    items: [],
};