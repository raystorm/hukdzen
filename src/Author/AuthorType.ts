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

export const unknownAuthor: Author = {
    __typename: 'Author',
    id: 'ed72e68e-9716-4c97-92e2-d5381e57ef97',
    name: "Unkown", waa: 'Akandi Wilaayt',
    createdAt: '2024-04-14T20:11:10.501Z',
    updatedAt: '2024-04-14T20:11:10.501Z',
}