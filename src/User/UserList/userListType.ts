import { Gyet } from '../userType';
import {ListGyetsQuery, ModelGyetConnection} from "../../types/AmplifyTypes";

/**
 * Local UserList Type
 */
export interface gyigyet extends ModelGyetConnection {
    //users: Gyet[];
}

//match listgyets(ish)
export const emptyGyigyet: ModelGyetConnection =
{
   __typename: "ModelGyetConnection",
   items:      [],
   //nextToken?: string | null,
};