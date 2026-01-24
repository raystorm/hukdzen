import type {
              User, CreateUserInput, UpdateUserInput,
              EmailPreferences
            } from "../types/AmplifyTypes";
import { OptOutReason } from "../types/AmplifyTypes";

export type { User, CreateUserInput, UpdateUserInput, EmailPreferences }
export { OptOutReason }

export const emptyUser: User = {
    __typename: 'User',
    id:       '',
    name:     '',
    email:    '',
    isAdmin:  false,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const initUser: User = {
    __typename: 'User',
    id:       'SOME_GUID',
    name:     '',
    email:    '',
    isAdmin:  true,
    //boxRoles: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const emptyEmailPreferences: EmailPreferences =
             { __typename:  'EmailPreferences', }

export const isEmptyUser = (user: User): boolean => {
    return user.id === emptyUser.id;
}