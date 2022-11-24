import { PictureInPictureSharp } from '@mui/icons-material';
import { BoxRole } from './BoxRoleType';
import { ClanType } from './ClanType';


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

export const printUser = (user: Gyet) => 
{ return `${user.name}${user.waa?` (${user.waa})` : ''}`; }

export const compareUser = (og: Gyet, bob: Gyet) => 
{ return og.id === bob.id }

export const emptyGyet: Gyet = {
    id:       '',
    name:     '',
    email:    '',
    isAdmin:  true,
    boxRoles: []
};