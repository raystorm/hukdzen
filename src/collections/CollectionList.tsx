import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { useSkipRender } from '../components/hooks/useSkipRender';
import { COLLECTIONS_PATH } from '../components/shared/constants';
import { collectionActions } from './collectionSlice';
import { Box, Typography, CircularProgress } from '@mui/material';

const CollectionList: React.FC = () => {
   const dispatch = useAppDispatch();
   const skipRender = useSkipRender(COLLECTIONS_PATH);
   const { items } = useAppSelector(state => state.collections);
   const isProcessing = useAppSelector(state => state.ui.isProcessing);

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

   return (
      <Box p={2}>
         <h1>Collections</h1>
         {0 === items.length ? (
            <Typography>No collections found.</Typography>
         ) : (
            items.map(collection => (
               <Box key={collection.id} mb={2} p={2} border={1} borderColor="grey.300">
                  <Typography variant="h6">{collection.eng_title}</Typography>
                  <Typography>{collection.eng_description}</Typography>
               </Box>
            ))
         )}
      </Box>
   );
};

export default CollectionList;