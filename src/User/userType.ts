import { PictureInPictureSharp } from '@mui/icons-material';
import { Xbiis } from '../Box/boxTypes';
import { RoleType, Role } from '../Role/roleTypes';


export interface ClanType {
    name: string,
    smalgyax: string,
}

const buildClan = (name:string, smalgyax: string) =>
{ 
   return {
      name: name,
      smalgyax: smalgyax,
      toString: () => { return `${smalgyax} (${name})`; }
   } as ClanType;
}

export const printClanType = (clan?: ClanType) =>
{ 
   if ( !clan ) { return undefined; }
   return `${clan.smalgyax} (${clan.name})`; 
}

/*
export class ClanType 
{
   readonly name: string;
   readonly smalgyax: string;

   constructor(nm: string, smalgyax: string)
   {
      this.name = nm;
      this.smalgyax = smalgyax;
   }

   toString() { return `${this.smalgyax} (${this.name})`; }
}

const buildClan = (name:string, smalgyax: string) =>
{ return new ClanType(name, smalgyax); }
*/

export const Clan = {
    Raven:       buildClan('Raven',      'G̱a̱nhada'),
    Eagle:       buildClan('Eagle',      'La̱xsgiik'),
    Killerwhale: buildClan('Killerwhale','Gisbutwada'),
    Wolf:        buildClan('Wolf',       'La̱xgibuu')
} as const;


export interface BoxRole {
    box: Xbiis,
    role: RoleType,
}

export const printBoxRole = (boxRole: BoxRole) =>
{ return `${boxRole.box.name} (${boxRole.role.name})`; }

export const compareBoxRole = (og: BoxRole, other: BoxRole) =>
{ return og.box.id === other.box.id && og.role.name === other.role.name; }

/**
 * Local User Type
 */
export interface Gyet {
    id:        string,
    name:      string,
    email:     string,
    clan?:     ClanType,
    waa?:      string, //smalgyax name
    isAdmin:   boolean,
    //TODO: create new type here, Box + Role mapping
    boxRoles: BoxRole[],
}

export const emptyGyet: Gyet = {
    id:       '',
    name:     '',
    email:    '',
    isAdmin:  true,
    boxRoles: []
};

export const printUser = (user: Gyet) => 
{ return `${user.name}${user.waa?` (${user.waa})` : ''}`; }

export const compareUser = (og: Gyet, bob: Gyet) => 
{ return og.id === bob.id }

