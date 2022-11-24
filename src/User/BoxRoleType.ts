import { Xbiis, emptyXbiis } from '../Box/boxTypes';
import { RoleType, DefaultRole } from '../Role/roleTypes';

export interface BoxRole
{
    box: Xbiis;
    role: RoleType;
}

export const emptyBoxRole: BoxRole = {
    box: emptyXbiis,
    role: DefaultRole
};

export const printBoxRole = (boxRole: BoxRole) => { return `${boxRole.box.name} (${boxRole.role.name})`; };

export const compareBoxRole = (og: BoxRole, other: BoxRole) => { return og.box.id === other.box.id && og.role.name === other.role.name; };
