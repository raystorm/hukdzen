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

import { DocumentDetailsFieldDefinition } from "../types/fieldDefitions";

import { useTranslator, TranslationDirection } from '../components/hooks/useTranslator';
import { useTranslationHandler } from "../components/hooks/useTranslationHandler";

import { boxListActions } from "../Box/BoxList/BoxListSlice";
import { emptyXbiis, printXbiis } from "../Box/boxTypes";
import {collectionActions} from "./collectionSlice";


export const CollectionFormBody: React.FC<CollectionFormBodyProps> = (props) =>
{
   const { formData, setFormData, isEditing } = props;
   const dispatch = useAppDispatch();
   const { translateField } = useTranslator();
   const handleTranslate = useTranslationHandler(formData, setFormData);

   const boxList = useAppSelector(state => state.boxList);

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
      if (!boxList?.items?.length) { dispatch(boxListActions.getAllBoxes()); }
   }, [dispatch, boxList]);

   // Build options once boxes are available
   const boxOptions = useMemo(() => {
      return boxList.items.filter(b => !!b)
                    .map((b) => (
                       <MenuItem key={b.id} value={b.id}>
                         {printXbiis(b)}
                       </MenuItem>
                    ));
   }, [boxList.items]);

   const handleChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const handleSelectBox = (value: string) =>
   { setFormData(prev => ({ ...prev, boxId: value })); };

   const docDeetsFD = DocumentDetailsFieldDefinition;
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
                       value={formData.boxId ?? emptyXbiis.id}
                       onChange={(e) => handleSelectBox(e.target.value)}>
               {boxOptions}
            </TextField>
         </Tooltip>

         <TextField fullWidth required margin="normal"
                    label={docDeetsFD.eng_title.label}
                    value={formData.eng_title}
                    onChange={(e) => handleChange('eng_title', e.target.value)}
                    disabled={!isEditing}
         />

         <TextField fullWidth multiline rows={3} margin="normal"
                    label={docDeetsFD.eng_description.label}
                    value={formData.eng_description}
                    onChange={(e) => handleChange('eng_description', e.target.value)}
                    disabled={!isEditing}
         />

         {/* BC title */}
         <TextField fullWidth margin="normal"
                    label={docDeetsFD.bc_title.label}
                    value={formData.bc_title}
                    onChange={(e) => handleChange('bc_title', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end">
                             <IconButton size="small"
                                         disabled={!formData.bc_title || !!formData.ak_title}
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
                    label={docDeetsFD.bc_description.label}
                    value={formData.bc_description}
                    onChange={(e) => handleChange('bc_description', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                             <IconButton size="small"
                                         disabled={!formData.bc_description || !!formData.ak_description}
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
                    label={docDeetsFD.ak_title.label}
                    value={formData.ak_title}
                    onChange={(e) => handleChange('ak_title', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end">
                             <IconButton size="small"
                                         disabled={!formData.ak_title || !!formData.bc_title}
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
                    label={docDeetsFD.ak_description.label}
                    value={formData.ak_description}
                    onChange={(e) => handleChange('ak_description', e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                       endAdornment: isEditing ? (
                          <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                             <IconButton size="small"
                                         disabled={!formData.ak_description || !!formData.bc_description}
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