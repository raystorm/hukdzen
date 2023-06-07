import { ClanType as cType } from "../types/AmplifyTypes";

export type ClanType = cType;

const buildClan = (name: string, smalgyax: string) =>
{
   return {
        name: name,
        smalgyax: smalgyax,
        toString: () => { return `${smalgyax} (${name})`; }
   } as ClanType;
};

export const Clan = {
    Raven: buildClan('Raven', 'G̱a̱nhada'),
    Eagle: buildClan('Eagle', 'La̱xsgiik'),
    Killerwhale: buildClan('Killerwhale', 'Gisbutwada'),
    Wolf: buildClan('Wolf', 'La̱xgibuu')
} as const;

export const printClanType = (clan?: ClanType | null)  =>
{
   if (!clan) { return undefined; }
   return `${clan.smalgyax} (${clan.name})`;
};

export const getClanFromName = (name: string | null | undefined) =>
{
   const getClan = (processedName: string | null | undefined) =>
   {
      switch(processedName)
      {
         case Clan.Raven.name:
            return Clan.Raven;
         case Clan.Eagle.name:
            return Clan.Eagle;
         case Clan.Killerwhale.name:
            return Clan.Killerwhale;
         case Clan.Wolf.name:
            return Clan.Wolf;
         case '':
         case null:
         case undefined:
            return undefined;
         default:
            throw new Error(`UNKNOWN CLAN NAME! (${name})`);
      }
   }

  //if name is like 'Raven (Ganhada)' strip the second part
  if ( name && name.includes('(') )
  {
     //const names = /(\w+) \((\w+)\)/.exec(name);
     const names = /([^ ]+) \(([^ )]+)\)/.exec(name);
     if ( !names ) { return undefined; }

     try {
        const clan = getClan(names[1]);
        if ( clan ) { return clan; }
     }
     catch (IGNORED) { } //duck and try the second half

     console.log(`checking for clan: ${names[2]}`);
     const clan = getClan(names[2]);
     if ( clan ) { return clan; }
  }

  return getClan(name);
}