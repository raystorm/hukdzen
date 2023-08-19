import { Author } from '../AuthorType';
import { ModelAuthorConnection } from "../../types/AmplifyTypes";

/**
 * Local AuthorList Type
 */
export interface authorList extends ModelAuthorConnection {
    //users: Gyet[];
}

export const emptyAuthorList: ModelAuthorConnection =
{
   __typename: "ModelAuthorConnection",
   items:      [],
   //nextToken?: string | null,
};