import { isDev } from '../components/shared/location';
import {Clan as cType} from "../types/AmplifyTypes";
import {printWaa} from "../types";

export type ClanEnum = cType;

export interface ClanType {
   name:  string,
   waa:   string,
   value: ClanEnum,
}


const buildClan = (name: string, waa: string, value: ClanEnum) : ClanType =>
{ return { name: name, waa: waa, value: value, } as ClanType; };

/* TODO: should I add butterfly? */

export const Clans = {
  Raven: buildClan('Raven', 'G̱a̱nhada', cType.GANHADA),
  Eagle: buildClan('Eagle', 'La̱xsgiik', cType.LAXSGIIK),
  Orca:  buildClan('Killerwhale', 'Gisbutwada', cType.GITSBUTWADA),
  Wolf:  buildClan('Wolf', 'La̱xgibuu', cType.LAXGIBU)
} as const;

export const printClanType = (clan?: ClanType | ClanEnum | string | null)  =>
{
   let printMe = clan;
   const clans: string[] = [ cType.GANHADA, cType.LAXSGIIK,
                             cType.GITSBUTWADA, cType.LAXGIBU ]
   if ( clan && typeof clan === 'string' && clans.includes(clan) )
   { printMe = getClanFromName(clan.toString()); }
   //if (!clan) { return undefined; }
   //return `${clan.waa} (${clan.name})`;
   // @ts-ignore // type fixed to remove ClanEmun w/ if...
   return printWaa(printMe);
};

/**
 *  Converts a String into a clan object
 *  String can be one of:
 *  <ul>
 *     <li>printClanType() output</li>
 *     <li>Name</li>
 *     <li>Smalgyax</li>
 *     <li>value</li>
 *  <ul>
 *  @param name Clan Name String
 */
export const getClanFromName = (name: string | ClanType | ClanEnum | null | undefined): ClanType | undefined =>
{
   if ( name && typeof name === 'object' ) { return name; }

   const getClan = (processedName: string | ClanType | null | undefined): ClanType | undefined =>
   {
      switch(processedName)
      {
         case Clans.Raven.name:
         case Clans.Raven.waa:
         case Clans.Raven.value:
            return Clans.Raven;
         case Clans.Eagle.name:
         case Clans.Eagle.waa:
         case Clans.Eagle.value:
            return Clans.Eagle;
         case Clans.Orca.name:
         case Clans.Orca.waa:
         case Clans.Orca.value:
            return Clans.Orca;
         case Clans.Wolf.name:
         case Clans.Wolf.waa:
         case Clans.Wolf.value:
            return Clans.Wolf;
         case '':
         case null:
         case undefined:
            return undefined;
         default:
            throw new Error(`UNKNOWN CLAN NAME! (${name})`);
      }
   }

   //if ( isDev() ) { console.log(`getting clan for: ${JSON.stringify(name)}`); }

  //if name is like 'Raven (G̱a̱nhada)' strip the second part
  if ( name && name.includes('(') )
  {
     //check for closing Parenthesis
     if ( !name.substring(name.indexOf('(')).includes(')') )
     { return undefined; }

     const names = name.split('(')
                               .map(n => n.trim().replace(')', ''));
     if ( !names ) { return undefined; }

     try
     {
        const clan = getClan(names[0]);
        if ( clan ) { return clan; }
     }
     catch (IGNORED) { } //duck and try the second half

     if ( isDev() ) { console.log('checking for clan:', names[1]); }
     const clan = getClan(names[1]);
     if ( clan ) { return clan; }
  }

  return getClan(name);
}
