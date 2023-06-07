import {Gyet, printGyet, compareGyet} from "../GyetType";
import {Clan} from "../ClanType";
import {emptyAuthor} from "../../Author/AuthorType";
import {emptyUser} from "../../User/userType";

export const emptyGyet: Gyet = {
   __typename: 'Gyet',
   id:         '',
   name:       '',
};

export const initGyet: Gyet = {
   __typename: 'Gyet',
   id:         'SOME_GUID',
   name:       '',
};

const TEST_GYET: Gyet = {
   ...emptyGyet,
   id:   'TEST_GUID',
   name: 'TEST NAME',
   waa:  'WIE WA!',
   clan: Clan.Raven,
}

describe('Gyet Utility Functions', () =>{
   test('printGyet works', () => {
      //normal
      expect(printGyet(TEST_GYET)).toEqual('TEST NAME (WIE WA!)');

      //empty
      expect(printGyet(emptyGyet)).toEqual('');
      expect(printGyet(null)).toEqual('');

      //name only
      const hasName: Gyet = { ...emptyGyet, name: 'I Haz Name' };
      expect(printGyet(hasName)).toEqual(hasName.name);
   });

   test('compareGyet works', () => {
      // same
      expect(compareGyet(emptyGyet, emptyGyet)).toBeTruthy();

      //different
      expect(compareGyet(emptyGyet, TEST_GYET)).toBeFalsy();

      //name was changed to protect the innocent
      const hasName: Gyet = { ...emptyGyet, name: 'I Haz new Name' };
      expect(compareGyet(emptyGyet, hasName)).toBeTruthy();

      //different types
      expect(compareGyet(emptyUser, emptyAuthor)).toBeFalsy();
   })
})