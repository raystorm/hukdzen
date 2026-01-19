import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, matchPath, useLocation } from 'react-router';
import { Grid, Chip, Switch, FormControlLabel, Box } from '@mui/material';

import { useAppSelector } from '../../app/hooks';
import { nullFilter, printName } from '../../types';
import { useSkipRender } from "../../components/hooks/useSkipRender";

import { BOX_REQUEST_LIST_PATH } from '../../components/shared/constants';

import { ContentCard } from '../../components/shared/ContentCard';

import { boxRequestListActions } from './BoxRequestListSlice';
import { BoxRequestStatus } from '../boxRequestType';

const BoxRequestListPage: React.FC = () =>
{
   const dispatch   = useDispatch();
   const navigate   = useNavigate();
   const location   = useLocation();
   const skipRender = useSkipRender(BOX_REQUEST_LIST_PATH);

   const currentUser = useAppSelector(state => state.user);
   const requests = useAppSelector(state => state.boxRequestList.items);
   const isAdmin = currentUser.isAdmin;

   const [statusFilter, setStatusFilter] = useState<'pending' | 'closed'>('pending');

   const handleToggle = () =>
   { setStatusFilter(prev => 'pending' === prev ? 'closed' : 'pending'); };

   useEffect(() =>
   {
      if ( skipRender() ) { return; }
      const action = 'pending' === statusFilter
         ? boxRequestListActions.getAllPendingBoxRequests
         : boxRequestListActions.getAllClosedBoxRequests;
      dispatch(action(currentUser));
   }, [dispatch, skipRender, currentUser, statusFilter]);

   if ( skipRender() ) { return null; }

   const getStatusColor = (status: BoxRequestStatus) =>
   {
      switch (status)
      {
         case BoxRequestStatus.PENDING:  return 'default';
         case BoxRequestStatus.APPROVED: return 'success';
         case BoxRequestStatus.DENIED:   return 'error';
         default: return 'default';
      }
   };

   const handleCardClick = (id: string) => { navigate(`/box/request/${id}`); };

   const filteredRequests = requests.filter(nullFilter);

   return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2em' }}>
         <h1>{isAdmin ? 'Review Box Requests' : 'My Box Requests'}</h1>

         <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2em', gap: 1 }}>
            <Chip
               label="Pending"
               color="default"
               sx={{ fontWeight: 'pending' === statusFilter ? 'bold' : 'normal' }}
               onClick={handleToggle}
            />
            <Switch
               checked={'closed' === statusFilter}
               onChange={handleToggle}
            />
            <Chip
               label="Closed"
               color="success"
               sx={{ fontWeight: 'closed' === statusFilter ? 'bold' : 'normal' }}
               onClick={handleToggle}
            />
         </Box>

         <Grid container spacing={2} sx={{ maxWidth: '1200px', width: '100%' }}>
            {filteredRequests.map(request => (
               <ContentCard
                  key={request.id}
                  onClick={() => handleCardClick(request.id)}
                  gridSize={{ xs: 12, md: 6 }}
                  fields={[
                     { label: 'Box Name', value: request.requestedName },
                     { label: 'Requester', value: printName(request.createdBy) },
                     { label: 'Status',
                       value: <Chip size='small' sx={{ fontWeight: 'bold' }}
                                    label={request.status}
                                    color={getStatusColor(request.status)} /> },
                     { label: 'Reason',
                       value: request.requestReason.substring(0, 100)
                            + (request.requestReason.length > 100 ? '...' : '') },
                     { label: 'Created',
                       value: new Date(request.createdAt).toLocaleString() },
                  ]}
               />
            ))}
         </Grid>

         { 0 === filteredRequests.length && ( <p>No box requests found.</p> ) }
      </div>
   );
};

export default BoxRequestListPage;
