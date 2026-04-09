import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { Box, Typography, Card, CardContent } from '@mui/material';

import { useAppSelector } from '../app/hooks';
import { nullFilter } from '../types';
import { useSkipRender } from '../components/hooks/useSkipRender';
import { theme } from '../components/shared/theme';

import { BOX_REQUEST_DETAIL_PATH } from '../components/shared/constants';
import { boxRequestActions } from './boxRequestSlice';
import { boxListActions } from '../Box/BoxList/BoxListSlice';
import BoxRequestForm from './BoxRequestForm';
import { printBox } from "../Box/boxTypes";

const BoxRequestDetailPage: React.FC = () =>
{
   const dispatch = useDispatch();
   const { id } = useParams<{ id: string }>();
   const skipRender = useSkipRender(BOX_REQUEST_DETAIL_PATH);

   const currentUser = useAppSelector(state => state.user.user);
   const boxRequest = useAppSelector(state => state.boxRequest.item);
   const boxes = useAppSelector(state => state.boxList.items);
   const isAdmin = currentUser.isAdmin;

   useEffect(() =>
   {
      if ( skipRender() || !id ) { return; }
      dispatch(boxRequestActions.getBoxRequestById(id));
   }, [dispatch, id, skipRender]);

   useEffect(() =>
   {
      if ( !boxRequest.createdBy?.id ) { return; }
      dispatch(boxListActions.getAllWritableBoxes(boxRequest.createdBy));
   }, [dispatch, boxRequest.createdBy]);

   if ( skipRender() ) { return null; }

   const isOwner = boxRequest.boxRequestCreatedById === currentUser.id;
   const mode = isAdmin ? 'admin' : (isOwner ? 'view' : 'view');

   const requesterBoxes = boxes.filter(nullFilter)
      .filter(box => box.boxOwnerId === boxRequest.createdBy?.id);

   return (
      <Box className='twoColumn' sx={{ p: 4 }} gridTemplateColumns='minmax(auto, 35em) 1fr'>
         <Box sx={{ borderRight: `3px solid ${theme.palette.secondary.main}` }}>
            <BoxRequestForm boxRequest={boxRequest} mode={mode} />
         </Box>
         
         <Box sx={{ pl: 5 }}>
            <Typography variant="h6" sx={{ marginBottom: '1em' }}>
               {isAdmin ? "Requester's Existing Boxes" : "Your Existing Boxes"}
            </Typography>
            {requesterBoxes.length > 0 ? (
               <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20em, 1fr))', gap: 2 }}>
                  {requesterBoxes.map(box => (
                     <Card key={box.id}>
                        <CardContent>
                           <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {printBox(box)}
                           </Typography>
                           <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5em 1em', textAlign: 'left' }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Purpose:</Typography>
                              <Typography variant="body2">{box.purpose || 'Not set'}</Typography>
                              
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Default Role:</Typography>
                              <Typography variant="body2">{box.defaultRole || 'Not set'}</Typography>
                              
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Created:</Typography>
                              <Typography variant="body2">{new Date(box.createdAt).toLocaleString()}</Typography>
                              
                              {box.updatedAt && box.updatedAt !== box.createdAt && (
                                 <>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Updated:</Typography>
                                    <Typography variant="body2">{new Date(box.updatedAt).toLocaleString()}</Typography>
                                 </>
                              )}
                           </Box>
                        </CardContent>
                     </Card>
                  ))}
               </Box>
            ) : (
               <Typography>No existing boxes</Typography>
            )}
         </Box>
      </Box>
   );
};

export default BoxRequestDetailPage;
