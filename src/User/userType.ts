import type {
              User, CreateUserInput, UpdateUserInput,
              EmailPreferences
            } from "../types/AmplifyTypes";
import { OptOutReason } from "../types/AmplifyTypes";

export type { User, CreateUserInput, UpdateUserInput, EmailPreferences }
export { OptOutReason }

/** GROUP name from AWS Cognito for Admin Users */
export const COGNITO_ADMIN_GROUP = 'WebAppAdmin';

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

/**
 * System User - owns system resources like the default box
 * Fixed ID across all environments for consistency
 * Not an admin - system resources should be managed by actual admins
 */
export const SystemUser: User = {
   __typename: 'User',
   id: '00000000-0000-0000-0000-000000000001',
   name: 'System',
   email: 'noreply@smalgyax-files.org',
   isAdmin: false,
   createdAt: '2023-06-23T01:13:51.459Z',
   updatedAt: '2023-06-23T01:13:51.459Z',
};

export const emptyEmailPreferences: EmailPreferences =
             { __typename:  'EmailPreferences', }

export const isEmptyUser = (user: User): boolean => {
    return user.id === emptyUser.id;
}