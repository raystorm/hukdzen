
export interface ClanType {
    name: string,
    smalgyax: string,
}

const buildClan = (name:string, smalgyax: string) =>
{
    return {
        name: name,
        smalgyax: smalgyax,
        //TODO: verify combined format w/ the community
        toString: () => { return `${smalgyax} (${name})`; }
    } as ClanType
}

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