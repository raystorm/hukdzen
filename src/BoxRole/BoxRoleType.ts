import { BoxRole as brole } from "../types/AmplifyTypes";

import { Xbiis, emptyXbiis } from '../Box/boxTypes';
import { RoleType, DefaultRole } from '../Role/roleTypes';

export type BoxRole = brole;

/*
export interface BoxRole
{
    box: Xbiis;
    role: RoleType;
}
*/

export const emptyBoxRole: BoxRole = {
    __typename: 'BoxRole',
    id: '',
    box: emptyXbiis,
    boxRoleBoxId: emptyXbiis.id,
    role: DefaultRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const BoxRoleBuilder = (box: Xbiis | null = emptyXbiis,
                               role: RoleType = DefaultRole):BoxRole =>
{
    if ( !box ) { box = emptyXbiis }
    return { ...emptyBoxRole, box: box, role: role };
}

export const printBoxRole = (boxRole: BoxRole) => {
    return `${boxRole.box.name} (${boxRole.role})`;
};

export const compareBoxRole = (og: BoxRole, other: BoxRole) => {
    return og.box.id === other.box.id && og.role === other.role;
};