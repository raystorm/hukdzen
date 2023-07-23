import { Gyet as _gyet } from "../types/AmplifyTypes";
import {User} from "../User/userType";
import {Author} from "../Author/AuthorType";
import {compareObjects, printName} from "../types";

/*
 *  Gyet Type - file for Author / User Super Type
 *  for eventual code consolidation
 */



/**
 * Local Gyet (Person) Type
 * Super type for Author / User
 */
export type Gyet = _gyet;

export type Person = Gyet | User | Author;

export const printGyet = (user: Person | null) =>
{
   //if ( !user ) { return ''; }
   //return `${user.name}${user.waa?` (${user.waa})` : ''}`;
   return printName(user);
}

/**
 * Compares Gyet (Person) Objects based on ID.
 * @param og  original
 * @param bob Person to compare against
 */
export const compareGyet = (og: Person, bob: Person): boolean => {
    return compareObjects(og, bob);
}