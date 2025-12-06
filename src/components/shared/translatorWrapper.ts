import Translator from '../../utils/translator.js';

interface ITranslator {
   translateToBC(text: string): string;
   translateToAlaskan(text: string): string;
}

class TranslatorWrapper
{
   private translator: ITranslator;

   constructor()
   {
      try { this.translator = new Translator(); }
      catch (error)
      {
         console.error('Failed to load translator:', error);
         this.translator = {
            translateToBC: (text: string) => text,
            translateToAlaskan: (text: string) => text
         };
      }
   }

   translateToBC(text: string): string
   { return this.translator.translateToBC(text); }

   translateToAlaskan(text: string): string
   { return this.translator.translateToAlaskan(text); }
}

export default TranslatorWrapper;
