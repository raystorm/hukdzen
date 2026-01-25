import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, Alert, Typography } from '@mui/material';
import { API } from 'aws-amplify';
import EmailPreferencesForm from './EmailPreferencesForm';
import type { EmailPreferences } from './userType';
import { decodeUnsubscribeToken } from './unsubscribeUtils';
import { getPublicUserEmailPreferences } from '../graphql/queries';
import { updateUserEmailPreferences } from '../graphql/mutations';

const UnsubscribePage = () =>
{
   const [token, setToken] = useState<string | null>(null);
   const [decodedEmail, setDecodedEmail] = useState<string>('');
   const [emailInput, setEmailInput] = useState<string>('');
   const [emailConfirmed, setEmailConfirmed] = useState(false);
   const [preferences, setPreferences] = useState<EmailPreferences | null>(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   useEffect(() =>
   {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');

      if (!tokenParam)
      {
         setError('Invalid unsubscribe link - missing token');
         return;
      }

      const decoded = decodeUnsubscribeToken(tokenParam);
      if (!decoded || !decoded.email)
      {
         setError('Invalid unsubscribe link - invalid token');
         return;
      }

      setToken(tokenParam);
      setDecodedEmail(decoded.email);
   }, []);

   const handleEmailConfirm = async () =>
   {
      if (emailInput.toLowerCase() !== decodedEmail.toLowerCase())
      {
         setError('Email address does not match');
         return;
      }

      setLoading(true);
      setError('');

      try
      {
         const result: any = await API.graphql({
            query: getPublicUserEmailPreferences,
            variables: { email: emailInput },
            authMode: 'AWS_IAM'
         });

         const prefs = result.data.getPublicUserEmailPreferences;
         if (!prefs)
         {
            setError('User not found');
            setLoading(false);
            return;
         }

         setPreferences(prefs);
         setEmailConfirmed(true);
      }
      catch (err)
      {
         setError('Could not load preferences');
      }
      finally { setLoading(false); }
   };

   const handleSave = async (newPrefs: EmailPreferences) =>
   {
      if (!token) { return; }

      setLoading(true);
      setError('');

      try
      {
         await API.graphql({
            query: updateUserEmailPreferences,
            variables: {
               email: emailInput,
               token: token,
               preferences: {
                  allOptOut: newPrefs.allOptOut,
                  boxRequestOptOut: newPrefs.boxRequestOptOut,
                  collaboratorOptOut: newPrefs.collaboratorOptOut,
                  systemOptOut: newPrefs.systemOptOut,
                  optOutReason: newPrefs.optOutReason,
                  optOutAt: newPrefs.optOutAt
               }
            },
            authMode: 'AWS_IAM'
         });

         setSuccess(true);
      }
      catch (err: any)
      {
         setError(err.message || 'Could not save preferences');
      }
      finally { setLoading(false); }
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
