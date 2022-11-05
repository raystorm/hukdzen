

export interface RoleType {
    name: string,
    //TODO: consider a Smalgyax Name as well as an English one
    read: boolean,
    write: boolean,
}

const buildRole = (name:string, read: boolean, write: boolean) =>
{ 
    return {
        name: name,
        toString: () => { return name; }
    } as RoleType;
}

export const printRole = (role?: RoleType) =>
{ 
   if ( !role ) { return undefined; }
   return role.name;
}

export const Role = {
    ReadOnly:    buildRole('ReadOnly', true, false),
    Write:       buildRole('Write',    true, true),
} as const;

/**
 * Box Type (container for grouping content items/permissions)
 */
export interface Xbiis {
    id:          string,
    name:        string,
    ownerId:     string,
    defaultRole: RoleType,
}

export const emptyXbiis: Xbiis = {
    id:          '',
    name:        '',
    ownerId:     '',
    defaultRole: Role.Write,
};

export const initialXbiis: Xbiis = {
    id:          'a95212b3-dff4-4286-9602-aab1c6ef9c5a',
    name:        'Nlip \'gynnm', //belongs to everyone
    ownerId:     '', //TODO: set to My ownerId
    defaultRole: Role.Write,
};