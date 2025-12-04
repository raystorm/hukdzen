import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import TranslatorWrapper from '../shared/translatorWrapper';

export enum TranslationDirection {
   BC_TO_AK = 'bc_to_ak',
   AK_TO_BC = 'ak_to_bc'
}

export const useTranslator = () => {
   const dispatch = useDispatch();
   const translator = new TranslatorWrapper();

   const translateField = useCallback((
      sourceValue: string,
      direction: TranslationDirection
   ): string | null =>
   {
      // Check if source is empty
      if (!sourceValue?.trim())
      {
         dispatch(alertBarActions.DisplayAlertBox(
            buildErrorAlert('Cannot translate: Source text is empty')
         ));
         return null;
      }

      // Perform translation
      const translated = direction === TranslationDirection.BC_TO_AK
         ? translator.translateToAlaskan(sourceValue)
         : translator.translateToBC(sourceValue);

      dispatch(alertBarActions.DisplayAlertBox(
         buildSuccessAlert('Translation completed')
      ));

      return translated;
   }, [dispatch]);

   return { translateField };
};