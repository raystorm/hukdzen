import { ModelXbiisConnection} from "../../types/AmplifyTypes";

/**
 * Local BoxList Type
 */
export interface BoxList extends ModelXbiisConnection { }


export const emptyBoxList: ModelXbiisConnection = {
    __typename: "ModelXbiisConnection",
    items: [],
};