import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
   Box, Dialog, DialogTitle, DialogContent, DialogActions,
   TextField, Button, IconButton, InputAdornment, Tooltip, MenuItem
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';

import { useAppDispatch, useAppSelector } from '../app/hooks';

import type {
              CollectionFormData, CollectionFormBodyProps
            } from './CollectionFormTypes';

import { DocumentFieldDefinition } from "../types/fieldDefitions";

import { useTranslator, TranslationDirection } from '../components/hooks/useTranslator';
import { useTranslationHandler } from "../components/hooks/useTranslationHandler";

import { boxListActions } from "../Box/BoxList/BoxListSlice";
import { emptyBox, printBox } from "../Box/boxTypes";
import {collectionActions} from "./collectionSlice";


export const CollectionFormBody: React.FC<CollectionFormBodyProps> = (props) =>
{
   const { formData, setFormData, isEditing } = props;
   const dispatch = useAppDispatch();
   const { translateField } = useTranslator();
   const handleTranslate = useTranslationHandler(formData, setFormData);

   const boxList = useAppSelector(state => state.boxList);
   const user    = useAppSelector(state => state.currentUser);

   const collections = useAppSelector(state => state.collections.items);
   const collection = useMemo(() => collections.find(c => c.id === formData.collectionId),
                              [collections, formData.collectionId]);

   //ensure the collection has items.
   useEffect(() =>
   {
      if ( formData.collectionId && !collection?.items )
      { dispatch(collectionActions.getCollectionById(formData.collectionId)); }
   }, [dispatch, formData.collectionId, collection?.items]);

   // Check if collection has items
   const hasItems = !!collection?.items?.items?.length;

   // Ensure boxes are loaded
   useEffect(() => {
      if (!boxList?.items?.length)
      { dispatch(boxListActions.getAllWritableBoxes(user)); }
   }, [dispatch, boxList, user]);

   // Build options once boxes are available
   const boxOptions = useMemo(() => {
      return boxList.items.filter(b => !!b)
                    .map((b) => (
                       <MenuItem key={b.id} value={b.id}>
                         {printBox(b)}
                       </MenuItem>
                    ));
   }, [boxList.items]);

   const handleChange = (field: string, value: string) => {
      const [lang, prop] = field.split('.');
      if (lang && prop) {
         setFormData(prev => ({
            ...prev,
            [lang]: {
               ...prev[lang as keyof typeof prev],
               [prop]: value
            }
         }));
      } else {
         setFormData(prev => ({ ...prev, [field]: value }));
      }
   };

   const handleSelectBox = (value: string) =>
   { setFormData(prev => ({ ...prev, boxId: value })); };

   const docDeetsFD = DocumentFieldDefinition;
   const translateIcon = <TextRotationNoneIcon />;

   return (
      <>
         <Tooltip title={docDeetsFD.box.description} placement='top'>
            <TextField fullWidth margin="normal" required select
                       data-testid="collection-box"
                       //enable when editing and the collection is empty
                       disabled={!isEditing || hasItems}
                       name={docDeetsFD.box.name}
                       label={docDeetsFD.box.label}
                       value={formData.boxId ?? emptyBox.id}
                       onChange={(e) => handleSelectBox(e.target.value)}>
               {boxOptions}
            </TextField>
         </Tooltip>

         <TextField fullWidth required margin="normal"
                    label={docDeetsFD.eng.title.label}
                    value={formData.eng?.title || ''}
                    onChange={(e) => handleChange('eng.title', e.target.value)}
                    disabled={!isEditing}
         />

         <TextField fullWidth multiline rows={3} margin="normal"
                    label={docDeetsFD.eng.description.label}
                    value={formData.eng?.description || ''}
                    onChange={(e) => handleChange('eng.description', e.target.value)}
                    disabled={!isEditing}
         />

         {/* BC title */}
         <TextField fullWidth margin="normal"
                    label={docDeetsFD.bc.title.label}
                    value={formData.bc?.title || ''}
                    onChange={(e) => handleChange('bc.title', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end">
                             <IconButton size="small"
                                         disabled={!formData.bc?.title || !!formData.ak?.title}
                                         onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'title')}
                                         title="Translate BC to AK">
                                {translateIcon}
                             </IconButton>
                          </InputAdornment>
                       ) : undefined
                    }}
         />

         {/* BC description */}
         <TextField fullWidth multiline rows={3} margin="normal"
                    label={docDeetsFD.bc.description.label}
                    value={formData.bc?.description || ''}
                    onChange={(e) => handleChange('bc.description', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                             <IconButton size="small"
                                         disabled={!formData.bc?.description || !!formData.ak?.description}
                                         onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'description')}
                                         title="Translate BC to AK">
                                {translateIcon}
                             </IconButton>
                          </InputAdornment>
                       ) : undefined
                    }}
         />

         {/* AK title */}
         <TextField fullWidth margin="normal"
                    label={docDeetsFD.ak.title.label}
                    value={formData.ak?.title || ''}
                    onChange={(e) => handleChange('ak.title', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end">
                             <IconButton size="small"
                                         disabled={!formData.ak?.title || !!formData.bc?.title}
                                         onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'title')}
                                         title="Translate AK to BC">
                                {translateIcon}
                             </IconButton>
                          </InputAdornment>
                       ) : undefined
                    }}
         />

         {/* AK description */}
         <TextField fullWidth multiline rows={3} margin="normal"
                    label={docDeetsFD.ak.description.label}
                    value={formData.ak?.description || ''}
                    onChange={(e) => handleChange('ak.description', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                             <IconButton size="small"
                                         disabled={!formData.ak?.description || !!formData.bc?.description}
                                         onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'description')}
                                         title="Translate AK to BC">
                                {translateIcon}
                             </IconButton>
                          </InputAdornment>
                       ) : undefined
                    }}
         />
      </>
   );
};