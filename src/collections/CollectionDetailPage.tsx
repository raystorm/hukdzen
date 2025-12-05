import React from 'react';
import { useParams } from 'react-router';
import { Box, Typography } from '@mui/material';

const CollectionDetailPage: React.FC = () => {
   const { collectionId } = useParams<{ collectionId: string }>();

   return (
      <Box p={2}>
         <h2 style={{textAlign: 'center'}}>Collection Details</h2>
         <Typography>
            Collection ID: {collectionId}
         </Typography>
         <Typography color="text.secondary" mt={2}>
            This page will show collection contents, allow editing metadata, and manage collection membership.
         </Typography>
      </Box>
   );
};

export default CollectionDetailPage;