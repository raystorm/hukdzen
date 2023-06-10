import { Author as _author } from "../types/AmplifyTypes";


/**
 * Local User Type
 */
export type Author = _author;


export const emptyAuthor: Author = {
    __typename: 'Author',
    id:         '',
    name:       '',
    //email:      '',
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
};

export const initAuthor: Author = {
    __typename: 'Author',
    id:         'SOME_GUID',
    name:       '',
    email:      '',
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
};