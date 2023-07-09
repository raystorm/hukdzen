import { ModelBoxUserConnection } from "../../types/AmplifyTypes";

/**
 * Local BoxUserList Type
 */
export interface BoxUserList extends ModelBoxUserConnection {

}


export const emptyBoxUserList: ModelBoxUserConnection = {
    __typename: "ModelBoxUserConnection",
    items: [],
};