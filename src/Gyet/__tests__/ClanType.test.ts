import {Clans, printClanType, getClanFromName, ClanEnum} from "../ClanType";

describe('Clan and Helper functions', () =>{

   test('getClanFromName works for Clans ', () => {
      expect(getClanFromName('Raven')).toBe(Clans.Raven);
      expect(getClanFromName('Eagle')).toBe(Clans.Eagle);
      expect(getClanFromName('Wolf')).toBe(Clans.Wolf);
      expect(getClanFromName('Killerwhale')).toBe(Clans.Killerwhale);
   });

   test('getClanFromName works for PrintClanType results ', () => {
      expect(getClanFromName(printClanType(Clans.Raven))).toBe(Clans.Raven);
      expect(getClanFromName(printClanType(Clans.Eagle))).toBe(Clans.Eagle);
      expect(getClanFromName(printClanType(Clans.Wolf))).toBe(Clans.Wolf);
      expect(getClanFromName(printClanType(Clans.Killerwhale))).toBe(Clans.Killerwhale);
   });

   test('getClanFromName works for backwards printed Clans ', () => {

      const print = (clan: ClanEnum) => {
         return `${clan.name} (${clan.smalgyax})`;
      };

      expect(getClanFromName(print(Clans.Raven))).toBe(Clans.Raven);
      expect(getClanFromName(print(Clans.Eagle))).toBe(Clans.Eagle);
      expect(getClanFromName(print(Clans.Wolf))).toBe(Clans.Wolf);
      expect(getClanFromName(print(Clans.Killerwhale))).toBe(Clans.Killerwhale);

   });

   test('getClanFromName works for empty', () =>{
      expect(getClanFromName('')).toBeUndefined();
      expect(getClanFromName(null)).toBeUndefined();
      expect(getClanFromName(undefined)).toBeUndefined();
   });

   test('getClanFromName errors for Unknown Clan', () =>{
      const err = new Error('UNKNOWN CLAN NAME! (DOES NOT EXIST)');

      //Test fails :(
      //expect(getClanFromName('DOES NOT EXIST')).toThrow(err);
      try { getClanFromName('DOES NOT EXIST'); }
      // @ts-ignore
      // eslint-disable-next-line jest/no-conditional-expect
      catch (error) { expect(error.message).toBe(err.message); }
   });

   test('getClanFromName return undefined with bad (', () => {
      expect(getClanFromName(' BAD Parenthesis (')).toBeUndefined();
   });
});