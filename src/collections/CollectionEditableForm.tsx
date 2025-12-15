import React, { useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

import { useAppDispatch } from '../app/hooks';

import type { Collection } from './CollectionTypes';
import { collectionActions } from './collectionSlice';
import type {CollectionFormData} from "./CollectionFormTypes";
import { CollectionFormBody } from "./CollectionFormBody";

interface CollectionEditableFormProps {
   collection: Collection;
   isEditing: boolean;
   onToggleEdit: () => void;
}

const CollectionEditableForm: React.FC<CollectionEditableFormProps> =
             ({ collection, isEditing, onToggleEdit }) =>
{
   const dispatch = useAppDispatch();

   const buildFormDataFromCollection = (c: Collection): CollectionFormData => ({
      collectionId: c.id || '',         boxId: c.collectionBoxId || '',
      eng_title:    c.eng_title ?? '',  eng_description: c.eng_description ?? '',
      bc_title:     c.bc_title ?? '',   bc_description: c.bc_description ?? '',
      ak_title:     c.ak_title ?? '',   ak_description: c.ak_description ?? '',
   });

   const [formData, setFormData] = useState<CollectionFormData>(
      buildFormDataFromCollection(collection)
   );

   const handleSave = () =>
   {
      const updatedCollection = { ...collection, ...formData,
                                  updated: new Date().toISOString(), };
      dispatch(collectionActions.updateCollection(updatedCollection));
      onToggleEdit();
   };

   const handleCancel = () => {
      setFormData(buildFormDataFromCollection(collection));
      onToggleEdit();
   };

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <h3>Too'ma Yawłmx (Collection Information)</h3>
            {!isEditing ? (
               <Button variant="outlined" startIcon={<EditIcon />} onClick={onToggleEdit}>
                  Amadzap (Edit)
               </Button>
            ) : (
                <Box>
                   <IconButton onClick={handleSave} color='success' title="Save" >
                      <SaveIcon />
                   </IconButton>
                   <IconButton onClick={handleCancel} color='secondary' title="Cancel" >
                      <CancelIcon />
                   </IconButton>
                </Box>
             )}
         </Box>

         <CollectionFormBody formData={formData} setFormData={setFormData}
                             isEditing={isEditing}
         />
      </Box>
   );
};

export default CollectionEditableForm;