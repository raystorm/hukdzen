import React, { useCallback } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { TranslationDirection, useTranslator } from './useTranslator';
import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../AlertBar/AlertBarTypes';

export interface Translatable {
   bc_title: string;
   bc_description: string;
   ak_title: string;
   ak_description: string;
}

/**
 *  Gets the appropriate value based on Translation Direction and source/target flag.
 *
 *  - If direction is BC→AK and isSource=true, return the BC value (source side).
 *  - If direction is BC→AK and isSource=false, return the AK value (target side).
 *  - If direction is AK→BC and isSource=true, return the AK value (source side).
 *  - If direction is AK→BC and isSource=false, return the BC value (target side).
 *
 *  In other words:
 *    * isBc is true when the translation direction starts from BC,
 *    * `isSource` tells us whether to pick the source or target value
 */
const getTranslateValue = (direction: TranslationDirection,
                           isSource: boolean,
                           bc: string, ak: string) =>
{
   const isBc = direction === TranslationDirection.BC_TO_AK;
   return isBc === isSource ? bc : ak;
}

const getFieldTranslateValue = (direction: TranslationDirection,
                                isSource: boolean,
                                fieldType: 'title' | 'description',
                                formData: Translatable) =>
{
   if (fieldType === 'title')
   {
      return getTranslateValue(direction, isSource,
                               formData.bc_title, formData.ak_title);
   }
   else
   {
      return getTranslateValue(direction, isSource,
                               formData.bc_description, formData.ak_description);
   }
}

/**
 *
 * @param formData
 * @param setFormData SetFormData function from useState
 */
export function useTranslationHandler(formData: Translatable, setFormData: any)
{
   const dispatch = useAppDispatch();
   const { translateField } = useTranslator();

   const handleTranslate = useCallback((direction: TranslationDirection,
                                        fieldType: 'title' | 'description') =>
   {
      const sourceValue = getFieldTranslateValue(direction, true,
                                                 fieldType, formData);
      const targetValue = getFieldTranslateValue(direction, false,
                                                 fieldType, formData);

      if (targetValue?.trim())
      {
         dispatch(alertBarActions.DisplayAlertBox(
               buildErrorAlert(`Cannot translate: Target ${fieldType} already has content`)
         ));
         return;
      }

      const translated = translateField(sourceValue, direction);
      if (translated)
      {
         const fieldName =
                     direction === TranslationDirection.BC_TO_AK
                     ? fieldType === 'title' ? 'ak_title' : 'ak_description'
                     : fieldType === 'title' ? 'bc_title' : 'bc_description';

         setFormData(prev => ({ ...prev, [fieldName]: translated }));
      }
   }, [formData, translateField, dispatch, setFormData]);

   return handleTranslate;
}
