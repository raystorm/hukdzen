import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useSkipRender } from '../components/hooks/useSkipRender';
import { theme } from '../components/shared/theme';
import { COLLECTION_DETAIL_PATH } from '../components/shared/constants';
import { collectionActions } from './collectionSlice';
import CollectionEditableForm from './CollectionEditableForm';
import CollectionItemList from './CollectionItemList';
import AddItemModal from './AddItemModal';
import type { Collection } from './CollectionTypes';

const CollectionDetailPage: React.FC = () => {
   const { collectionId } = useParams<{ collectionId: string }>();
   const dispatch = useAppDispatch();
   const skipRender = useSkipRender(COLLECTION_DETAIL_PATH);
   
   const { items: collections } = useAppSelector(state => state.collections);
   const isProcessing = useAppSelector(state => state.ui.isProcessing);
   
   const collection = collections.find(c => c.id === collectionId);
   const [isEditing, setIsEditing] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);

   useEffect(() => {
      if (skipRender()) { return; }
      if (collectionId) {
         dispatch(collectionActions.loadCollectionRequest(collectionId));
      }
   }, [skipRender, dispatch, collectionId]);

   const handleToggleEdit = () => { setIsEditing(!isEditing); };

   const handleAddItem = () => { setShowAddModal(true); };

   const handleAddItems = (items: { documentId?: string; childCollectionId?: string }[]) =>
   {
      if (collectionId)
      { dispatch(collectionActions.addItemsRequest({ collectionId, items })); }
   };

   const handleRemoveItem = (itemId: string) =>
   {
      if (collectionId)
      { dispatch(collectionActions.removeItemRequest({ collectionId, itemId })); }
   };

   const handleMoveUp = (itemId: string) =>
   {
      if (collectionId)
      {
         dispatch(collectionActions.reorderItemRequest({ collectionId, itemId,
                                                         direction: 'up' }));
      }
   };

   const handleMoveDown = (itemId: string) =>
   {
      if (collectionId)
      {
         dispatch(collectionActions.reorderItemRequest({ collectionId, itemId,
                                                         direction: 'down' }));
      }
   };

   if (skipRender()) { return <></>; }

   if (isProcessing && !collection)
   {
      return (
         <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
         </Box>
      );
   }

   if (!collection)
   { return <Box p={3}><h4 color="error">Collection not found</h4></Box>; }

   return (
      <Box sx={{ p: 3 }}>
         <h2>Too'ma Yawłmx (Collection Details)</h2>

         <Box className='twoColumn' gridTemplateColumns='1fr 1fr'>
            {/* Left Column: Collection Edit Form */}
            <Box sx={{ pr: 2 }} 
                 borderRight={{ borderRight: `2px solid ${theme.palette.secondary.main}` }}>
               <CollectionEditableForm collection={collection}
                                       isEditing={isEditing}
                                       onToggleEdit={handleToggleEdit}
               />
            </Box>

            {/* Right Column: Collection Items */}
            <Box sx={{ pl: 2 }}>
               <CollectionItemList items={collection.items?.items || []}
                  onAddItem={handleAddItem} onRemoveItem={handleRemoveItem}
                  onMoveUp={handleMoveUp}   onMoveDown={handleMoveDown}
               />
            </Box>
         </Box>

         <AddItemModal open={showAddModal} onClose={() => setShowAddModal(false)}
                       collectionId={collectionId || ''}
                       onAddItems={handleAddItems}
         />
      </Box>
   );
};

export default CollectionDetailPage;