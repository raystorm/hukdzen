import { ModelBoxRequestConnection, ModelUserConnection, type User } from "../../graphql/API";
import type { BoxRequest } from '../boxRequestType';

export type BoxRequestList = Omit<ModelBoxRequestConnection, 'items'> & {
    items: BoxRequest[];
};


export const emptyBoxRequestList: BoxRequestList = {
    __typename: "ModelBoxRequestConnection",
    items: [],
};