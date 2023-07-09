import {AccessLevel} from "../types/AmplifyTypes";


/**
 * Role Type for content Item permissions tracking
 */
export type RoleType = AccessLevel;

/* Defines permissions for a Role. */
export interface RolePermissions {
    name: string,
    //TODO: consider a Smalgyax Name as well as an English one
    read: boolean,
    write: boolean,
}


export const printRole = (role?: RoleType | null) =>
{ 
   if ( !role ) { return undefined; }
   //return role.name;
   return role.toString();
}

export const getPermissionsForRole = (role: RoleType): RolePermissions => {
  const perms = { name: role.toString() };
  switch (role)
  {
     case AccessLevel.NONE:
        return { ...perms, read: false, write: false };
     case AccessLevel.READ:
        return { ...perms, read: true, write: false };
     case AccessLevel.WRITE:
        return { ...perms, read: true, write: true };
     default:
        throw new Error("Unknown RoleType (AccessLevel)");
  }
}

/**
 *  Hardcoded Roles
 */
export const Role = {
    None:  AccessLevel.NONE,
    Read:  AccessLevel.READ,
    Write: AccessLevel.WRITE,
};

export const rolesList = [
   { value: Role.None.toString(),  label: printRole(Role.None),  },
   { value: Role.Read.toString(),  label: printRole(Role.Read),  },
   { value: Role.Write.toString(), label: printRole(Role.Write), },
];

export const rolesSingleList = [
   Role.None.toString(), Role.Read.toString(), Role.Write.toString()
];

export const DefaultRole = Role.Write;
