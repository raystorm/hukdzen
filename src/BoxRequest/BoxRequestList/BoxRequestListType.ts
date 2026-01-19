import { ModelBoxRequestConnection } from "../../types/AmplifyTypes";

export type BoxRequestList = ModelBoxRequestConnection;


export const emptyBoxRequestList: BoxRequestList = {
    __typename: "ModelBoxRequestConnection",
    items: [],
};