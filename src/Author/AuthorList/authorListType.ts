import { ModelAuthorConnection } from "../../types/AmplifyTypes";

/**
 * Local AuthorList Type
 */
export interface authorList extends ModelAuthorConnection { }

export const emptyAuthorList: ModelAuthorConnection =
{
   __typename: "ModelAuthorConnection",
   items:      [],
   //nextToken?: string | null,
};