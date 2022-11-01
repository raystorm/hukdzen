

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

/**
 * Local User Type
 */
export interface Gyet {
    id:    string,
    name:  string,
    email: string,
    clan?: ClanType,
    waa?:  string, //smalgyax name
    roleId?:  string, //link to role/permissions
}

export const emptyGyet: Gyet = {
    id:    '',
    name:  '',
    email: '',
};