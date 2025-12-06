import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useSkipRender } from '../components/hooks/useSkipRender';
import { COLLECTIONS_PATH } from '../components/shared/constants';
import { collectionActions } from './collectionSlice';
import CollectionForm from './CollectionForm';
import type { Collection } from './CollectionTypes';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { ContentGrid } from '../components/shared/ContentGrid';
import { DocumentDetailsFieldDefinition } from "../types/fieldDefitions";

const CollectionList: React.FC = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const skipRender = useSkipRender(COLLECTIONS_PATH);
   const { items } = useAppSelector(state => state.collections);
   const isProcessing = useAppSelector(state => state.ui.isProcessing);
   const [showCreateForm, setShowCreateForm] = useState(false);

   // Default visible fields for collections
   const visibleFields = ['eng_title', 'bc_title', 'ak_title'];

   const CollFieldDef = {
      eng_title: { label: DocumentDetailsFieldDefinition.eng_title.label },
      bc_title:  { label: DocumentDetailsFieldDefinition.bc_title.label  },
      ak_title:  { label: DocumentDetailsFieldDefinition.ak_title.label  },
   };

   useEffect(() => {
      if (skipRender()) { return; }
      dispatch(collectionActions.loadCollectionsRequest());
   }, [skipRender, dispatch]);

   if (skipRender()) { return <></>; }

   if (isProcessing) {
      return (
         <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
         </Box>
      );
   }

   const handleCreate = () => { setShowCreateForm(true); };

   const handleCloseForm = () => { setShowCreateForm(false); };

   return (
      <Box p={2}>
         <h2 style={{textAlign: 'center'}}>Collections</h2>
         
         <Box display="flex" justifyContent="center" mb={3}>
            <Button variant="contained" startIcon={<AddIcon />}
                    onClick={handleCreate}
            >
               Create Collection
            </Button>
         </Box>
         
         {0 === items.length ? (
            <Typography textAlign="center" color="text.secondary">
               No collections found. Create your first collection to get started.
            </Typography>
         ) : (
            <ContentGrid
               items={items}
               fields={visibleFields.map(field => ({
                  key: field,
                  label: CollFieldDef[field as keyof typeof CollFieldDef]?.label || field
               }))}
               onItemClick={(collection) => navigate(`/collections/${collection.id}`)}
            />
         )}

         <CollectionForm open={showCreateForm} onClose={handleCloseForm} />
      </Box>
   );
};

export default CollectionList;