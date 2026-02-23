import type { User, UserInput, EmailPreferences } from "../graphql/API";
import { OptOutReason } from "../graphql/API";
import { SystemUser as SystemUserData } from '../data/SystemUser';

export type { User, UserInput, EmailPreferences }
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
    id:         'SOME_GUID',
    name:       '',
    email:      '',
    isAdmin:    false,
    //boxRoles: [],
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
};

/**
 * System User - owns system resources like the default box
 * Fixed ID across all environments for consistency
 * Not an admin - system resources should be managed by actual admins
 */
export const SystemUser: User = SystemUserData as User;

export const emptyEmailPreferences: EmailPreferences =
             { __typename:  'EmailPreferences', }

export const isEmptyUser = (user: User): boolean => {
    return user.id === emptyUser.id;
}