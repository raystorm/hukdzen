import { Xbiis } from '../boxTypes';
import {ModelBoxRoleConnection, ModelXbiisConnection} from "../../types/AmplifyTypes";

/**
 * Local BoxList Type
 */
export interface BoxList {
    boxes: Xbiis[];
}


export const emptyBoxList: ModelXbiisConnection = {
    __typename: "ModelXbiisConnection",
    items: [],
};