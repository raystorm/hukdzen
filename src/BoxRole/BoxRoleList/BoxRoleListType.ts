import {ModelBoxRoleConnection} from "../../types/AmplifyTypes";

export type BoxRoleList = ModelBoxRoleConnection;

export const emptyBoxRoleList: ModelBoxRoleConnection = {
   __typename: "ModelBoxRoleConnection",
   items: [],
}