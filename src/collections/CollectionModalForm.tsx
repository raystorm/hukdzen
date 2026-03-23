import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
         Dialog, DialogTitle, DialogContent, DialogActions, Button,
       } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../app/hooks';

import type { Collection } from './CollectionTypes';
import { emptyCollection } from './CollectionTypes';
import { collectionActions } from './collectionSlice';
import type { CollectionFormData } from "./CollectionFormTypes";
import { CollectionFormBody } from "./CollectionFormBody";

interface CollectionFormProps {
   open?: boolean; onClose?: () => void;
   collection?: Collection;
   isEdit?: boolean;
}

export const modalNewTitle = "Dzap Sutoo'ma (Create New Collection)"
export const modalEditTitle = "Amadzapł Too'ma (Edit Collection)"

const emptyFormData: CollectionFormData = {
   collectionId: '', boxId: '',
   eng: { title: '', description: '' },
   bc:  { title: '', description: '' },
   ak:  { title: '', description: '' },
};

const CollectionModalForm: React.FC<CollectionFormProps> =
             ({ open = false, onClose = () => {}, collection, isEdit = true }) =>
{
   const dispatch = useAppDispatch();
   const currentUser = useAppSelector(state => state.currentUser);

   const buildFormDataFromCollection = (c?: Collection): CollectionFormData =>
   {
      if ( !c ) { return emptyFormData; }
      else
      {
         return {
            collectionId: c.id || '',     boxId: c.collectionBoxId || '',
            eng: { title: c.eng?.title ?? '', description: c.eng?.description ?? '' },
            bc:  { title: c.bc?.title ?? '',  description: c.bc?.description ?? '' },
            ak:  { title: c.ak?.title ?? '',  description: c.ak?.description ?? '' },
         };
      }
   };

   const [formData, setFormData] = useState<CollectionFormData>(
      buildFormDataFromCollection(collection)
   );

   const handleReset = () => { setFormData(emptyFormData); };

   useEffect(() => {
      if (collection) { setFormData(buildFormDataFromCollection(collection)); }
       else { handleReset(); }
   }, [collection, open]);

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      if (collection)
      {  // Update existing collection
         const updatedCollection: Collection = {
            ...collection,
            eng: formData.eng,
            bc:  formData.bc,
            ak:  formData.ak,
            collectionBoxId: formData.boxId,
            updated: new Date().toISOString(),
         };
         dispatch(collectionActions.updateCollection(updatedCollection));
      }
      else
      {  // Create new collection
         const collectionData: Collection = {
            ...emptyCollection,
            eng: formData.eng,
            bc:  formData.bc,
            ak:  formData.ak,
            collectionContentOwnerUserId: currentUser.id,
            collectionBoxId: formData.boxId,
            updated: new Date().toISOString(),
         };
         dispatch(collectionActions.createCollection(collectionData));
      }

      handleReset();
      onClose();
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle>{collection ? modalEditTitle : modalNewTitle}</DialogTitle>

         <form onSubmit={handleSubmit}>
            <DialogContent>
               <CollectionFormBody formData={formData} setFormData={setFormData}
                                   isEditing={isEdit}
               />
            </DialogContent>

            <DialogActions>
               <Button onClick={onClose}>Cancel</Button>
               <Button onClick={handleReset} variant="outlined">Reset</Button>
               <Button type="submit" variant="contained">
                  {collection ? 'Update' : 'Create'}
               </Button>
            </DialogActions>
         </form>
      </Dialog>
   );
};

export default CollectionModalForm;