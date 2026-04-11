import { ModelAuthorConnection, ModelUserConnection, type User } from "../../graphql/API";
import type { Author } from '../AuthorType';



/**
 * Local AuthorList Type
 */
//export interface authorList extends ModelAuthorConnection { }
export type authorList = Omit<ModelAuthorConnection, 'items'> & {
   items: Author[];
}


export const emptyAuthorList: ModelAuthorConnection =
{
   __typename: "ModelAuthorConnection",
   items:      [],
   //nextToken?: string | null,
};