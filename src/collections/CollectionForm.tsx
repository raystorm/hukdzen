import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { collectionActions } from './collectionSlice';
import type { Collection } from './CollectionTypes';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   TextField,
   Button,
   IconButton,
   InputAdornment
} from '@mui/material';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';
import { useTranslator, TranslationDirection } from '../components/hooks/useTranslator';
import { alertBarActions } from '../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../AlertBar/AlertBarTypes';

interface CollectionFormProps {
   open: boolean;
   onClose: () => void;
   collection?: Collection;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ open, onClose, collection }) => {
   const dispatch = useAppDispatch();
   const currentUser = useAppSelector(state => state.currentUser);
   const currentBox = useAppSelector(state => state.box);
   const { translateField } = useTranslator();

   const [formData, setFormData] = useState({
      eng_title: '',
      eng_description: '',
      bc_title: '',
      bc_description: '',
      ak_title: '',
      ak_description: '',
   });

   useEffect(() => {
      if (collection) {
         setFormData({
            eng_title: collection.eng_title,
            eng_description: collection.eng_description,
            bc_title: collection.bc_title,
            bc_description: collection.bc_description,
            ak_title: collection.ak_title,
            ak_description: collection.ak_description,
         });
      } else {
         handleReset();
      }
   }, [collection, open]);



   const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
         ...prev,
         [field]: event.target.value
      }));
   };

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      
      if (collection) {
         // Update existing collection
         const updatedCollection = {
            ...collection,
            ...formData,
            updated: new Date().toISOString(),
         };
         dispatch(collectionActions.updateCollectionRequest(updatedCollection));
      } else {
         // Create new collection
         const collectionData = {
            ...formData,
            collectionCollectionOwnerId: currentUser.id,
            collectionBoxId: currentBox.id,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
         };
         dispatch(collectionActions.createCollectionRequest(collectionData as Collection));
      }
      
      handleReset();
      onClose();
   };

   const handleReset = () => {
      setFormData({
         eng_title: '',
         eng_description: '',
         bc_title: '',
         bc_description: '',
         ak_title: '',
         ak_description: '',
      });
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

   const translateIcon = <TextRotationNoneIcon />;

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle>{collection ? 'Edit Collection' : 'Create New Collection'}</DialogTitle>
         
         <form onSubmit={handleSubmit}>
            <DialogContent>
               <TextField
                  fullWidth
                  required
                  label="English Title"
                  value={formData.eng_title}
                  onChange={handleChange('eng_title')}
                  margin="normal"
               />
               
               <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="English Description"
                  value={formData.eng_description}
                  onChange={handleChange('eng_description')}
                  margin="normal"
               />
               
               <TextField
                  fullWidth
                  label="BC Title"
                  value={formData.bc_title}
                  onChange={handleChange('bc_title')}
                  margin="normal"
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton 
                              size="small"
                              disabled={!formData.bc_title || !!formData.ak_title}
                              onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'title')}
                              title="Translate BC to AK"
                           >
                              {translateIcon}
                           </IconButton>
                        </InputAdornment>
                     )
                  }}
               />
               
               <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="BC Description"
                  value={formData.bc_description}
                  onChange={handleChange('bc_description')}
                  margin="normal"
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                           <IconButton 
                              size="small"
                              disabled={!formData.bc_description || !!formData.ak_description}
                              onClick={() => handleTranslate(TranslationDirection.BC_TO_AK, 'description')}
                              title="Translate BC to AK"
                           >
                              {translateIcon}
                           </IconButton>
                        </InputAdornment>
                     )
                  }}
               />
               
               <TextField
                  fullWidth
                  label="AK Title"
                  value={formData.ak_title}
                  onChange={handleChange('ak_title')}
                  margin="normal"
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton 
                              size="small"
                              disabled={!formData.ak_title || !!formData.bc_title}
                              onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'title')}
                              title="Translate AK to BC"
                           >
                              {translateIcon}
                           </IconButton>
                        </InputAdornment>
                     )
                  }}
               />
               
               <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="AK Description"
                  value={formData.ak_description}
                  onChange={handleChange('ak_description')}
                  margin="normal"
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                           <IconButton 
                              size="small"
                              disabled={!formData.ak_description || !!formData.bc_description}
                              onClick={() => handleTranslate(TranslationDirection.AK_TO_BC, 'description')}
                              title="Translate AK to BC"
                           >
                              {translateIcon}
                           </IconButton>
                        </InputAdornment>
                     )
                  }}
               />
            </DialogContent>
            
            <DialogActions>
               <Button onClick={onClose}>Cancel</Button>
               <Button onClick={handleReset} variant="outlined">Reset</Button>
               <Button type="submit" variant="contained">{collection ? 'Update' : 'Create'}</Button>
            </DialogActions>
         </form>
      </Dialog>
   );
};

export default CollectionForm;