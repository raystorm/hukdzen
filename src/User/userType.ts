
const buildClan = (name:string, smalgyax: string) =>
{
    return {
        name: name,
        smalgyax: smalgyax,
        //TODO: verify combined format w/ the community
        toString: () => { return `${smalgyax} (${name})`; }
    }
}

export const clan = {
    Raven:       buildClan('Raven',      'G̱a̱nhada'),
    Eagle:       buildClan('Eagle',      'La̱xsgiik'),
    Killerwhale: buildClan('Killerwhale','Gisbutwada'),
    Wolf:        buildClan('Wolf',       'La̱xgibuu')
} as const;

/**
 * Local User Type
 */
export interface gyet {
    id:    string,
    name:  string,
    email: string,
    clan?: typeof clan,
    waa?:  string, //smalgyax name
    roleId?:  string, //link to role/permissions
}

export const emptyGyet: gyet = {
    id:    '',
    name:  '',
    email: '',
};