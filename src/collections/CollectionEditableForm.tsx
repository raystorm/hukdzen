import React, { useState, useCallback, useEffect } from 'react';
import { Box, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';
import { useAppDispatch } from '../app/hooks';
import { collectionActions } from './collectionSlice';
import { useTranslator, TranslationDirection } from '../components/hooks/useTranslator';
import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../AlertBar/AlertBarTypes';
import type { Collection } from './CollectionTypes';

interface CollectionEditableFormProps {
   collection: Collection;
   isEditing: boolean;
   onToggleEdit: () => void;
}

export const CollectionEditableForm: React.FC<CollectionEditableFormProps> = ({
   collection,
   isEditing,
   onToggleEdit
}) => {
   const dispatch = useAppDispatch();
   const { translateField } = useTranslator();
   
   const [formData, setFormData] = useState({
      eng_title: collection.eng_title,
      eng_description: collection.eng_description,
      bc_title: collection.bc_title,
      bc_description: collection.bc_description,
      ak_title: collection.ak_title,
      ak_description: collection.ak_description,
   });

   useEffect(() => {
      setFormData({
         eng_title: collection.eng_title,
         eng_description: collection.eng_description,
         bc_title: collection.bc_title,
         bc_description: collection.bc_description,
         ak_title: collection.ak_title,
         ak_description: collection.ak_description,
      });
   }, [collection]);

   const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
         ...prev,
         [field]: event.target.value
      }));
   };

   const handleSave = () => {
      const updatedCollection = {
         ...collection,
         ...formData,
         updated: new Date().toISOString(),
      };
      dispatch(collectionActions.updateCollectionRequest(updatedCollection));
      onToggleEdit();
   };

   const handleCancel = () => {
      setFormData({
         eng_title: collection.eng_title,
         eng_description: collection.eng_description,
         bc_title: collection.bc_title,
         bc_description: collection.bc_description,
         ak_title: collection.ak_title,
         ak_description: collection.ak_description,
      });
      onToggleEdit();
   };

   const handleTranslate = useCallback((direction: TranslationDirection, fieldType: 'title' | 'description') => {
      const sourceValue = direction === TranslationDirection.BC_TO_AK 
         ? (fieldType === 'title' ? formData.bc_title : formData.bc_description)
         : (fieldType === 'title' ? formData.ak_title : formData.ak_description);
      
      const targetValue = direction === TranslationDirection.BC_TO_AK
         ? (fieldType === 'title' ? formData.ak_title : formData.ak_description)
         : (fieldType === 'title' ? formData.bc_title : formData.bc_description);

      if (targetValue?.trim()) {
         dispatch(alertBarActions.DisplayAlertBox(
            buildErrorAlert(`Cannot translate: Target ${fieldType} already has content`)
         ));
         return;
      }
      
      const translated = translateField(sourceValue, direction);
      if (translated) {
         const fieldName = direction === TranslationDirection.BC_TO_AK
            ? (fieldType === 'title' ? 'ak_title' : 'ak_description')
            : (fieldType === 'title' ? 'bc_title' : 'bc_description');
         
         setFormData(prev => ({ ...prev, [fieldName]: translated }));
      }
   }, [formData, translateField, dispatch]);

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <h3>Collection Information</h3>
            {!isEditing ? (
               <Button variant="outlined" startIcon={<EditIcon />} onClick={onToggleEdit}>
                  Edit
               </Button>
            ) : (
               <Box>
                  <IconButton onClick={handleSave} color="primary" title="Save">
                     <SaveIcon />
                  </IconButton>
                  <IconButton onClick={handleCancel} title="Cancel">
                     <CancelIcon />
                  </IconButton>
               </Box>
            )}
         </Box>

         <TextField
            fullWidth
            required
            label="Title"
            value={formData.eng_title}
            onChange={handleChange('eng_title')}
            margin="normal"
            disabled={!isEditing}
         />

         <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={formData.eng_description}
            onChange={handleChange('eng_description')}
            margin="normal"
            disabled={!isEditing}
         />

         <TextField
            fullWidth
            label="Nahawt(BC)"
            value={formData.bc_title}
            onChange={handleChange('bc_title')}
            margin="normal"
            disabled={!isEditing}
            InputProps={{
               endAdornment: isEditing ? (
                  <InputAdornment position="end">
                     <IconButton 
                        size="small"
                        disabled={!formData.bc_title || !!formData.ak_title}
                        onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'title')}
                        title="Translate BC to AK"
                     >
                        <TextRotationNoneIcon />
                     </IconButton>
                  </InputAdornment>
               ) : undefined
            }}
         />

         <TextField
            fullWidth
            multiline
            rows={3}
            label="Magon(BC)"
            value={formData.bc_description}
            onChange={handleChange('bc_description')}
            margin="normal"
            disabled={!isEditing}
            InputProps={{
               endAdornment: isEditing ? (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                     <IconButton 
                        size="small"
                        disabled={!formData.bc_description || !!formData.ak_description}
                        onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'description')}
                        title="Translate BC to AK"
                     >
                        <TextRotationNoneIcon />
                     </IconButton>
                  </InputAdornment>
               ) : undefined
            }}
         />

         <TextField
            fullWidth
            label="Nahawt(AK)"
            value={formData.ak_title}
            onChange={handleChange('ak_title')}
            margin="normal"
            disabled={!isEditing}
            InputProps={{
               endAdornment: isEditing ? (
                  <InputAdornment position="end">
                     <IconButton 
                        size="small"
                        disabled={!formData.ak_title || !!formData.bc_title}
                        onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'title')}
                        title="Translate AK to BC"
                     >
                        <TextRotationNoneIcon />
                     </IconButton>
                  </InputAdornment>
               ) : undefined
            }}
         />

         <TextField
            fullWidth
            multiline
            rows={3}
            label="Magon(AK)"
            value={formData.ak_description}
            onChange={handleChange('ak_description')}
            margin="normal"
            disabled={!isEditing}
            InputProps={{
               endAdornment: isEditing ? (
                  <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                     <IconButton 
                        size="small"
                        disabled={!formData.ak_description || !!formData.bc_description}
                        onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'description')}
                        title="Translate AK to BC"
                     >
                        <TextRotationNoneIcon />
                     </IconButton>
                  </InputAdornment>
               ) : undefined
            }}
         />
      </Box>
   );
};

export default CollectionEditableForm;