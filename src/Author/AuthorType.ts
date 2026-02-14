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
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Unknown',
    waa: 'Akandi Wilaayt',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
}