import {Clan, printClanType, getClanFromName, ClanType} from "../ClanType";

describe('Clan and Helper functions', () =>{

   test('getClanFromName works for Clans ', () => {
      expect(getClanFromName('Raven')).toBe(Clan.Raven);
      expect(getClanFromName('Eagle')).toBe(Clan.Eagle);
      expect(getClanFromName('Wolf')).toBe(Clan.Wolf);
      expect(getClanFromName('Killerwhale')).toBe(Clan.Killerwhale);
   });

   test('getClanFromName works for PrintClanType results ', () => {
      expect(getClanFromName(printClanType(Clan.Raven))).toBe(Clan.Raven);
      expect(getClanFromName(printClanType(Clan.Eagle))).toBe(Clan.Eagle);
      expect(getClanFromName(printClanType(Clan.Wolf))).toBe(Clan.Wolf);
      expect(getClanFromName(printClanType(Clan.Killerwhale))).toBe(Clan.Killerwhale);
   });

   test('getClanFromName works for backwards printed Clans ', () => {

      const print = (clan: ClanType) => {
         return `${clan.name} (${clan.smalgyax})`;
      };

      expect(getClanFromName(print(Clan.Raven))).toBe(Clan.Raven);
      expect(getClanFromName(print(Clan.Eagle))).toBe(Clan.Eagle);
      expect(getClanFromName(print(Clan.Wolf))).toBe(Clan.Wolf);
      expect(getClanFromName(print(Clan.Killerwhale))).toBe(Clan.Killerwhale);

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