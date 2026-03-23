import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useSkipRender } from '../components/hooks/useSkipRender';
import { ContentGrid } from '../components/shared/ContentGrid';

import { COLLECTIONS_PATH } from '../components/shared/constants';
import { DocumentFieldDefinition } from "../types/fieldDefitions";

import { collectionActions } from './collectionSlice';
import CollectionModalForm from './CollectionModalForm';

const CollectionList: React.FC = () => {
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const skipRender = useSkipRender(COLLECTIONS_PATH);
   const { items } = useAppSelector(state => state.collections);
   const isProcessing = useAppSelector(state => state.ui.isProcessing);
   const [showCreateForm, setShowCreateForm] = useState(false);

   // Default visible fields for collections
   const visibleFields = ['eng.title', 'bc.title', 'ak.title'];

   const CollFieldDef = {
      'eng.title': { label: DocumentFieldDefinition.eng.title.label },
      'bc.title':  { label: DocumentFieldDefinition.bc.title.label  },
      'ak.title':  { label: DocumentFieldDefinition.ak.title.label  },
   };

   useEffect(() =>
  {
      if (skipRender()) { return; }
      dispatch(collectionActions.getCollections());
   }, [skipRender, dispatch]);

   if (skipRender()) { return <></>; }

   if (isProcessing)
   {
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
         <h2 style={{textAlign: 'center'}}>Too'ma (Collections)</h2>
         
         <Box display="flex" justifyContent="center" mb={3}>
            <Button variant="contained" startIcon={<AddIcon />}
                    onClick={handleCreate}
            >
               Dzap Too'ma (Create Collection)
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

         <CollectionModalForm open={showCreateForm} onClose={handleCloseForm} />
      </Box>
   );
};

export default CollectionList;