import { AccessLevel } from "../types/AmplifyTypes";

export { AccessLevel };

/* Defines permissions for a Role. */
export interface RolePermissions {
    name: string,
    //TODO: consider a Smalgyax Name as well as an English one
    read: boolean,
    write: boolean,
}

//All AccessLevel Enum values for runtime validation.
const VALID_ACCESS_LEVELS = new Set(Object.values(AccessLevel));

export const printRole = (role?: AccessLevel | null): string | null =>
{
   if (!role) { return null; }

   if (!VALID_ACCESS_LEVELS.has(role))
   { throw new Error(`Unknown Role/AccessLevel: ${role}`); }

   return role;
};

export const getPermissionsForRole = (role: AccessLevel): RolePermissions | undefined =>
{
   if ( !role ) { return undefined; }
   let perms: any;
   switch (role)
   {
      case AccessLevel.NONE:
        perms = { read: false, write: false };
        break;
      case AccessLevel.READ:
        perms = { read: true, write: false };
        break;
      case AccessLevel.WRITE:
        perms = { read: true, write: true };
        break;
      default:
        throw new Error("Unknown RoleType (AccessLevel)");
   }
   return { name: printRole(role), ...perms };
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
   { value: Role.None,  label: printRole(Role.None),  },
   { value: Role.Read,  label: printRole(Role.Read),  },
   { value: Role.Write, label: printRole(Role.Write), },
];

export const DefaultRole = Role.Write;


/**
 * Local RoleList Type
 * /
export interface RoleList { roles: RoleType[]; }

export const emptyRoles: RoleList = {
   roles: [] as RoleType[]
};
//end - potential role list types */

export const hasReadAccess = (role: AccessLevel) =>
   role === Role.Read || role === Role.Write;

export const hasWriteAccess = (role: AccessLevel) =>
   role === Role.Write;
