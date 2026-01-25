import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, Alert, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useSkipRender } from '../components/hooks/useSkipRender';
import EmailPreferencesForm from '../User/EmailPreferencesForm';
import type { EmailPreferences } from '../User/userType';
import { decodeUnsubscribeToken } from './unsubscribe.Utilities';
import { unsubscribeActions } from './unsubscribeSlice';
import { UNSUBSCRIBE_PATH } from '../components/shared/constants'

const UnsubscribePage = () =>
{
   const dispatch = useAppDispatch();
   const { token, decodedEmail, emailConfirmed, preferences, loading, error, success } = 
      useAppSelector(state => state.unsubscribe);
   const [emailInput, setEmailInput] = useState('');
   const skipRender = useSkipRender(UNSUBSCRIBE_PATH);

   useEffect(() =>
   {
      if ( skipRender() ) { return; }

      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');

      if (!tokenParam)
      {
         dispatch(unsubscribeActions.setTokenError('Invalid unsubscribe link - missing token'));
         return;
      }

      const decoded = decodeUnsubscribeToken(tokenParam);
      if (!decoded || !decoded.email)
      {
         dispatch(unsubscribeActions.setTokenError('Invalid unsubscribe link - invalid token'));
         return;
      }

      dispatch(unsubscribeActions.setToken({ token: tokenParam, email: decoded.email }));
   }, [dispatch, skipRender]);

   const handleEmailConfirm = () =>
   {
      if (emailInput.toLowerCase() !== decodedEmail.toLowerCase())
      {
         dispatch(unsubscribeActions.confirmEmailFailure('Email address does not match'));
         return;
      }

      dispatch(unsubscribeActions.confirmEmail(emailInput));
   };

   const handleSave = (newPrefs: EmailPreferences) =>
   {
      if (!token) { return; }
      dispatch(unsubscribeActions.updatePreferences({ 
         email: emailInput, 
         token, 
         preferences: newPrefs 
      }));
   };

   if (error && !token)
   {
      return (
         <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
            <Alert severity="error">{error}</Alert>
         </Box>
      );
   }

   if (success)
   {
      return (
         <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
            <Alert severity="success">
               Your email preferences have been updated successfully.
            </Alert>
         </Box>
      );
   }

   if (!emailConfirmed)
   {
      return (
         <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
            <h2>Manage Email Preferences</h2>
            <Typography variant="body1" sx={{ marginBottom: 3 }}>
               Please confirm your email address to continue.
            </Typography>

            <TextField
               fullWidth
               label="Email Address"
               type="email"
               value={emailInput}
               onChange={(e) => setEmailInput(e.target.value)}
               disabled={loading}
               sx={{ marginBottom: 2 }}
            />

            {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

            <Button
               variant="contained"
               onClick={handleEmailConfirm}
               disabled={loading || !emailInput}
            >
               {loading ? <CircularProgress size={24} /> : 'Continue'}
            </Button>
         </Box>
      );
   }

   if ( skipRender() ) { return <></>; }

   return (
      <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
         <EmailPreferencesForm
            userId=""
            current={preferences}
            onPreferencesChange={handleSave}
         />

         {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
         {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
               <CircularProgress />
            </Box>
         )}
      </Box>
   );
};

export default UnsubscribePage;
