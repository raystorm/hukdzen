import React, { useState, useEffect } from 'react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import type { EmailPreferences } from './userType';
import { OptOutReason } from './userType';

interface EmailPreferencesFormProps
{
   userId: string;
   current?: EmailPreferences | null;
   showTitle?: boolean;
   onPreferencesChange?: (prefs: EmailPreferences) => void;
}

const EmailPreferencesForm: React.FC<EmailPreferencesFormProps> = (props: EmailPreferencesFormProps) =>
{
   const { userId, current, showTitle = true, onPreferencesChange } = props;

   const copyPreferences = (current?: EmailPreferences | null): EmailPreferences => ({
      __typename:         'EmailPreferences',
      allOptOut:          current?.allOptOut          || false,
      boxRequestOptOut:   current?.boxRequestOptOut   || false,
      collaboratorOptOut: current?.collaboratorOptOut || false,
      systemOptOut:       current?.systemOptOut       || false,
      optOutReason:       current?.optOutReason,
      optOutAt:           current?.optOutAt,
   });

   
   const [preferences, setPreferences] = useState(copyPreferences(current));

   useEffect(() =>
   { if (current) { setPreferences(copyPreferences(current)); } }, [current]);

   const getStatusColor = (reason?: OptOutReason | null) =>
   {
      switch (reason)
      {
         case OptOutReason.USER_CHOICE : return 'grey.200';
         case OptOutReason.BOUNCE_HARD : return 'error.dark';
         case OptOutReason.BOUNCE_SOFT : return 'warning.light';
         case OptOutReason.COMPLAINT   : return 'warning.dark';
         default : return 'grey.200';
      }
   };

   const getTextColor = (reason?: OptOutReason | null) => {
      switch (reason) {
         case OptOutReason.BOUNCE_HARD : return 'error.contrastText';
         case OptOutReason.COMPLAINT   : return 'warning.contrastText';
         default : return 'text.primary';
      }
   };

   const handleToggle = (field: keyof EmailPreferences) =>
   {
      const newPrefs = {
         ...preferences,
         [field]: !preferences[field],
      };
      
      // Set optOutReason and optOutAt when toggling allOptOut to true
      if (field === 'allOptOut' && !preferences.allOptOut) {
         newPrefs.optOutReason = OptOutReason.USER_CHOICE;
         newPrefs.optOutAt = new Date().toISOString();
      }
      
      setPreferences(newPrefs);
      if (onPreferencesChange) { onPreferencesChange(newPrefs); }
   };

   return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
         {showTitle && <h3>Email Preferences</h3>}
         
         <Typography variant="body2" sx={{marginBottom: 2}}>
            Control which email notifications you receive
         </Typography>

         {/* Master opt-out - emphasized on its own line */}
         <Box sx={{ marginBottom: 3, width: 'fit-content', overflow: 'hidden',
                    border: '2px solid', borderColor: 'primary.main', borderRadius: 1,}}>
            <Box sx={{display: 'flex', gap: 0, alignItems: 'stretch', justifyContent: 'flex-start'}}>
               <Box sx={{
                  padding:         2,
                  backgroundColor: current?.allOptOut ? 'grey.100' : 'transparent',
                  display:         'flex',
                  alignItems:      'center'
               }}>
                  <FormControlLabel
                     control={
                        <Switch
                           checked={preferences.allOptOut || false}
                           onChange={() => handleToggle('allOptOut')}
                        />
                     }
                     label={
                        <Box>
                           <Typography variant="h6" fontWeight="bold">
                              Unsubscribe from all emails
                           </Typography>
                           <Typography variant="body2" color="text.secondary">
                              Stop receiving all non-critical email notifications
                           </Typography>
                        </Box>
                     }
                  />
               </Box>
               
               <Box sx={{
                  padding: 2,
                  paddingLeft: 3,
                  borderLeft: '2px solid',
                  borderColor: 'secondary.main',
                  backgroundColor: preferences.allOptOut ? getStatusColor(preferences.optOutReason) : 'transparent',
                  color: preferences.allOptOut ? getTextColor(preferences.optOutReason) : 'text.primary',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
               }}>
                  {preferences.allOptOut && preferences.optOutReason ? (
                     <>
                        <Typography variant="body2" fontWeight="bold">
                           Opt-out Status
                        </Typography>
                        <Typography variant="body2">
                           {preferences.optOutReason === OptOutReason.USER_CHOICE ? 'User preference' : 
                           preferences.optOutReason === OptOutReason.BOUNCE_HARD ? 'Hard bounce' :
                           preferences.optOutReason === OptOutReason.BOUNCE_SOFT ? 'Soft bounce (5+)' :
                           preferences.optOutReason === OptOutReason.COMPLAINT ? 'Spam complaint' : 
                           preferences.optOutReason}
                        </Typography>
                        {preferences.optOutAt && (
                           <Typography variant="body2">
                              {new Date(preferences.optOutAt).toLocaleDateString()}
                           </Typography>
                        )}
                     </>
                  ) : (
                     <>
                        <Typography variant="body2" fontWeight="bold">
                           Email Status
                        </Typography>
                        <Typography variant="body2">
                           Receiving notifications
                        </Typography>
                     </>
                  )}
               </Box>
            </Box>
         </Box>

         {/* Category preferences - grid layout on wide screens */}
         <Box sx={{
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', md: 'repeat(3, 1fr)'},
            gap: 2,
            marginBottom: 3
         }}>
            <FormControlLabel
               control={
                  <Switch
                     checked={preferences.boxRequestOptOut || false}
                     onChange={() => handleToggle('boxRequestOptOut')}
                     disabled={preferences.allOptOut || false}
                  />
               }
               label={
                  <Box>
                     <Typography variant="body1" fontWeight="bold">
                        Box requests
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Request updates
                     </Typography>
                  </Box>
               }
            />

            <FormControlLabel
               control={
                  <Switch
                     checked={preferences.collaboratorOptOut || false}
                     onChange={() => handleToggle('collaboratorOptOut')}
                     disabled={preferences.allOptOut || false}
                  />
               }
               label={
                  <Box>
                     <Typography variant="body1" fontWeight="bold">
                        Collaborator
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Added to boxes
                     </Typography>
                  </Box>
               }
            />

            <FormControlLabel
               control={
                  <Switch
                     checked={preferences.systemOptOut || false}
                     onChange={() => handleToggle('systemOptOut')}
                     disabled={preferences.allOptOut || false}
                  />
               }
               label={
                  <Box>
                     <Typography variant="body1" fontWeight="bold">
                        System
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Announcements
                     </Typography>
                  </Box>
               }
            />
         </Box>
      </Box>
   );
};

export default EmailPreferencesForm;
