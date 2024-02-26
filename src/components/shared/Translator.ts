type TranslationMap = { [key: string]: string };

/**
 *   Class for Translating between Orthographies
 *   Based on a Skeleton Generated by Bing. (Chat GPT-4)
 */
class translator
{
   private alaskanToBC: TranslationMap;
   private bCToAlaskan: TranslationMap;

   constructor()
   {
      this.alaskanToBC = {
         'ai'  : 'ee',  'Ai'  : 'Ee',
         'ee'  : 'ii',  'Ee'  : 'Ii',
         'ie'  : 'ay',  'Ie'  : 'Ay',
         'oa'  : 'oo',  'Oa'  : 'Oo',
         'oo'  : 'uu',  'Oo'  : 'Uu',
         'uu'  : 'ü',   'Uu'  : 'Ü',
         'ck'  : 'x',   'Ck'  : 'C',
         'ds'  : 'dz',  'Ds'  : 'Dz',
         'gg'  : 'g̱',   'Gg'  : 'G̱',
         'hl'  : 'ł',   'Hl'  : 'Ł',
         'sh'  : 's',   'Sh'  : 'S',
         "'b"  : "p'",  "'B"  : "P'",
         "'d"  : "t'",  "'D"  : "T'",
         "'ds" : "ts'", "'Ds" : "Ts'",
         "'k"  : "k'",  "'K"  : "K'",
         "'kw" : "k'w", "'Kw" : "K'w",
         "'ky" : "k'y", "'Ky" : "K'y",
      };

      this.bCToAlaskan = {
         //TODO: different capitalizations
         'ee'  : 'ai',  'Ee'  : 'Ai',
         'ii'  : 'ee',  'Ii'  : 'Ee',
         'ay'  : 'ie',  'Ay'  : 'Ie',
         'oo'  : 'oa',  'Oo'  : 'Oa',
         'uu'  : 'oo',  'Uu'  : 'Oo',
         'ü'   : 'uu',  'Ü'   : 'Uu',
         'x'   : 'ck',  'X'   : 'Ck',
         'dz'  : 'ds',  'Dz'  : 'Ds',
         'g̱'   : 'gg',  'G̱'   : 'Gg',
         'ł'   : 'hl',  'Ł'   : 'Hl',
         's'   : 'sh',  'S'   : 'Sh',
         "p'"  : "'b",  "P'"  : "'B",
         "t'"  : "'d",  "T'"  : "'D",
         "ts'" : "'ds", "Ts'" : "'Ds",
         "k'"  : "'k",  "K'"  : "'K",
         "k'w" : "'kw", "K'w" : "'Kw",
         "k'y" : "'ky", "K'y" : "'Ky",
      };
   }

   public translateToBC(text: string): string
   { return this.translate(text, this.alaskanToBC); }

   public translateToAlaskan(text: string): string
   { return this.translate(text, this.bCToAlaskan); }

   private translate(text: string, translationMap: TranslationMap): string
   {
      let translatedText = text;
      for (const key in translationMap)
      {
         const value = translationMap[key];
         const regex = new RegExp(key, "g");
         translatedText = translatedText.replace(regex, value);
      }
      return translatedText;
   }
}

export default translator;

/* TEST && usage example
const translator = new Translator();
const bcText = translator.translateToBC("Your Alaskan text here");
const alaskanText = translator.translateToAlaskan("Your BC text here");
// end TEST && usage example */