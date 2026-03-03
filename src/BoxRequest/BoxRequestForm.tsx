import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button, TextField, Chip, Box } from '@mui/material';

import { useAppSelector } from '../app/hooks';
import type { BoxRequest } from './boxRequestType';
import { BoxRequestStatus, emptyBoxRequest } from './boxRequestType';
import { boxRequestActions } from './boxRequestSlice';
import { emptyUser } from "../User/userType";
import { printName } from '../types';
import { DocumentDetailsFieldDefinition } from "../types/fieldDefitions";
import { alertBarActions } from "../AlertBar/AlertBarSlice";
import { buildErrorAlert } from "../AlertBar/AlertBarTypes";
import { BOX_REQUEST_LIST_PATH } from '../components/shared/constants';

interface BoxRequestFormProps {
   boxRequest?: BoxRequest;
   mode: 'create' | 'view' | 'admin';
}

interface errors {
   requestedNameError?: string;
   requestReasonError?: string;
   denialReasonError?: string;
}

const BoxRequestForm: React.FC<BoxRequestFormProps> = (props) =>
{
   const { boxRequest = emptyBoxRequest, mode } = props;

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const currentUser = useAppSelector(state => state.user.user);
   const boxRequestState = useAppSelector(state => state.boxRequest.item);

   const [requestedName, setRequestedName] = useState(boxRequest.requestedName);
   const [requestReason, setRequestReason] = useState(boxRequest.requestReason || '');
   const [denialReason,  setDenialReason] = useState(boxRequest.denialReason   || '');
   const [status,     setStatus]     = useState(boxRequest.status     || BoxRequestStatus.PENDING);
   const [createdBy,  setCreatedBy]  = useState(boxRequest.createdBy  || currentUser);
   const [approvedBy, setApprovedBy] = useState(boxRequest.approvedBy || emptyUser);

   const [errors, setErrors] = useState<errors>({});
   const setRequestedNameError = (errorMsg: string) => {
      setErrors(previous => ({ ...previous, requestedNameError: errorMsg }));
   }
   const setRequestReasonError = (errorMsg: string) => {
      setErrors(previous => ({ ...previous, requestReasonError: errorMsg }));
   }
   const setDenialError = (errorMsg: string) => {
      setErrors(previous => ({ ...previous, denialReasonError: errorMsg }));
   }

   useEffect(() => {
      setRequestedName(boxRequest.requestedName);
      setRequestReason(boxRequest.requestReason || '');
      setDenialReason(boxRequest.denialReason   || '');
      setStatus(boxRequest.status         || BoxRequestStatus.PENDING);
      setCreatedBy(boxRequest.createdBy   || currentUser);
      setApprovedBy(boxRequest.approvedBy || emptyUser);
   }, [boxRequest, currentUser]);

   useEffect(() => {
      if ( 'create' === mode && boxRequestState.id && boxRequestState.id !== boxRequest.id )
      { navigate(BOX_REQUEST_LIST_PATH); }
   }, [boxRequestState.id, mode, boxRequest.id, navigate]);

   useEffect(() => {
      if ( 'admin' === mode && boxRequestState.id === boxRequest.id &&
           (BoxRequestStatus.APPROVED === boxRequestState.status || BoxRequestStatus.DENIED === boxRequestState.status) )
      { navigate(BOX_REQUEST_LIST_PATH); }
   }, [boxRequestState, mode, boxRequest.id, navigate]);


   const handleSubmit = (action: 'create' | 'update' | 'approve' | 'deny') =>
   {
      const initRequest = boxRequest || emptyBoxRequest;

      const isCreate      = 'create' === action;

      const isDeny        = 'deny' === action;
      const isAdminAction = 'approve' === action || isDeny;
      let hasError = false;

      if ( !requestedName.trim() )
      {
         const errorMsg = 'Requested name is required for a box request.';
         setRequestedNameError(errorMsg);
         hasError = true;
         dispatch(alertBarActions.DisplayAlertBox(buildErrorAlert(errorMsg)));
      }
      if ( !requestReason.trim() )
      {
         const errorMsg = 'Request reason is required for box request.';
         setRequestReasonError(errorMsg);
         hasError = true;
         dispatch(alertBarActions.DisplayAlertBox(buildErrorAlert(errorMsg)));
      }

      if ( isDeny && !denialReason.trim() )
      {
         const errorMsg = 'Denial reason is required to deny a box request.';
         setDenialError(errorMsg);
         hasError = true;
         dispatch(alertBarActions.DisplayAlertBox(buildErrorAlert(errorMsg)));
      }
      if ( hasError ) { return; }

      const baseRequest: BoxRequest = {
         ...initRequest,
         requestedName: requestedName.trim(),
         requestReason: requestReason.trim(),
         status,
         createdBy:             isCreate ? currentUser    : createdBy,
         boxRequestCreatedById: isCreate ? currentUser.id : createdBy.id,
         ...(isAdminAction && {
               approvedBy: currentUser,
               boxRequestApprovedById: currentUser.id,
         }),
         ...(isDeny && { denialReason: denialReason }),
      };

      switch (action)
      {
         case 'create':
            dispatch(boxRequestActions.createBoxRequest(baseRequest));
            console.log('Create BoxRequest for:', baseRequest);
            return;
         case 'update':
            dispatch(boxRequestActions.updateBoxRequest(baseRequest));
            return;
         case 'approve':
            dispatch(boxRequestActions.approveBoxRequest(baseRequest));
            return;
         case 'deny':
            dispatch(boxRequestActions.denyBoxRequest(baseRequest));
            return;
      }
   };

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

   const isView   = 'view'   === mode;
   const isAdmin  = 'admin'  === mode;
   const isCreate = 'create' === mode;
   const isDenied = BoxRequestStatus.DENIED === boxRequest.status;
   const isClosed = BoxRequestStatus.APPROVED === boxRequest.status 
                 || BoxRequestStatus.DENIED === boxRequest.status;

   const handleSetRequestedName = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRequestedName(value);
      if ( value.trim() && errors.requestedNameError ) { setRequestedNameError(''); }
   };

   const handleSetRequestReason = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRequestReason(value);
      if ( value.trim() && errors.requestReasonError ) { setRequestReasonError(''); }
   };

   const handleSetDenialReason = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDenialReason(value);
      if ( value.trim() && errors.denialReasonError ) { setDenialError(''); }
   };

   return (
      <form style={{ width: '100%', maxWidth: '30em', margin: '0 auto' }}>
         <h2>Box Request</h2>

         <div style={{ display: 'grid', gap: '1em' }}>
            {(isAdmin || isView) && (
               <TextField
                  name='requester' label='Requester'
                  disabled fullWidth
                  value={printName(createdBy)}
               />
            )}

            <TextField
               name='requestedName' label='Requested Box Name'
               required fullWidth
               disabled={!isCreate}
               value={requestedName} onChange={handleSetRequestedName}
               error={!!errors.requestedNameError}
               helperText={errors.requestedNameError}
            />

            <TextField
               name='requestReason' label='Request Reason'
               required multiline rows={4} fullWidth
               disabled={!isCreate}
               value={requestReason} onChange={handleSetRequestReason}
               error={!!errors.requestReasonError}
               helperText={errors.requestReasonError}
            />

            {isClosed && (
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{paddingLeft: '1rem'}} ><strong>Status:</strong></span>
                  <Chip
                     label={status}
                     color={getStatusColor(status)}
                     sx={{ fontWeight: 'bold' }}
                  />
               </Box>
            )}

            {(isAdmin || (isView && isDenied)) && (
               <TextField
                  name='denialReason' label='Denial Reason'
                  multiline rows={4} fullWidth
                  disabled={!(isAdmin && !isClosed)}
                  value={denialReason} onChange={handleSetDenialReason}
                  error={!!errors.denialReasonError}
                  helperText={errors.denialReasonError}
               />
            )}

            <div style={{ display: 'flex', gap: '1em' }}>
               {isCreate && (
                  <Button
                     onClick={() => handleSubmit('create')}
                     variant='contained'
                     disabled={!requestedName || !requestReason}
                  >
                     Submit Request
                  </Button>
               )}
               {isAdmin && !isClosed && (
                  <>
                     <Button variant='contained' color='success'
                             onClick={() => handleSubmit('approve')}
                     >
                        Approve
                     </Button>
                     <Button variant='contained' color='secondary'
                             disabled={!denialReason}
                             onClick={() => handleSubmit('deny')}
                     >
                        Deny
                     </Button>
                  </>
               )}
               {isView && !isClosed && (
                  <Button
                     onClick={() => handleSubmit('update')}
                     variant='contained'
                     disabled={!requestedName}
                  >
                     Update
                  </Button>
               )}
            </div>
         </div>
      </form>
   );
};

export default BoxRequestForm;
