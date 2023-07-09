import { Xbiis } from '../boxTypes';
import { ModelXbiisConnection} from "../../types/AmplifyTypes";

/**
 * Local BoxList Type
 */
export interface BoxList extends ModelXbiisConnection {
    //items: Xbiis[];
}


export const emptyBoxList: ModelXbiisConnection = {
    __typename: "ModelXbiisConnection",
    items: [],
};