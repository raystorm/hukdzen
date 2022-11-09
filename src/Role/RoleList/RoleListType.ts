import { RoleType } from '../roleTypes';

/**
 * Local RoleList Type
 */
export interface RoleList { roles: RoleType[]; }


export const emptyRoles: RoleList = {
    roles: [] as RoleType[]
};