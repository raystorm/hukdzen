import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useSkipRender } from '../hooks/useSkipRender';
import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import type { Alert } from '../../AlertBar/AlertBarTypes';
import {
   buildInfoAlert, buildSuccessAlert, buildWarningAlert, buildErrorAlert
} from '../../AlertBar/AlertBarTypes';

/**
 * Demo page to showcase AlertBar Markdown formatting
 */
const MarkdownDemo = () =>
{
   const dispatch = useDispatch();
   const skipRender = useSkipRender('/markdown-demo');

   if ( skipRender() ) { return null; }

   const demos = [
      {
         label: 'Bold Text',
         message: 'This has **bold text** in it',
         severity: 'info'
      },
      {
         label: 'Italic Text',
         message: 'This has *italic text* in it',
         severity: 'info'
      },
      {
         label: 'Underline Text',
         message: 'This has __underlined text__ in it',
         severity: 'info'
      },
      {
         label: 'Strikethrough Text',
         message: 'This has ~~crossed out text~~ in it',
         severity: 'info'
      },
      {
         label: 'Inline Code',
         message: 'Run `npm install` to install dependencies',
         severity: 'info'
      },
      {
         label: 'Highlight Text',
         message: 'This has ==highlighted text== in it',
         severity: 'warning'
      },
      {
         label: 'Internal Link',
         message: 'Click [here](/dashboard) to go to dashboard',
         severity: 'success'
      },
      {
         label: 'External Link (Blocked)',
         message: 'Visit [Google](https://google.com) for search',
         severity: 'error'
      },
      {
         label: 'Combined Formatting',
         message: 'Box **MyBox** created! [View Box](/box/123) or run `npm start`',
         severity: 'success'
      },
      {
         label: 'Broken Nesting',
         message: '**bold *italic** won\'t render as expected',
         severity: 'info'
      },
      {
         label: 'Mixed Markers',
         message: '**bold __underline__** only renders outer formatting',
         severity: 'info'
      },
      {
         label: 'XSS Attempt (Blocked)',
         message: 'This link is blocked: [Click me](javascript:alert("XSS"))',
         severity: 'error'
      },
      {
         label: 'Complex Example',
         message: 'Upload **successful**! File `document.pdf` saved. ==Important:== [View document](/item/123) or ~~cancel~~',
         severity: 'success'
      },
      {
         label: 'Error with Details',
         message: 'Testing a ==Detailed== message with *formatting.*',
         severity: 'error',
         details: 'This is a detailed technical message'
      }
   ];

   const showAlert = (message: string, severity: string, details?: string) =>
   {
      let alert: Alert;
      switch ( severity )
      {
         case 'success': alert = buildSuccessAlert(message, details); break;
         case 'warning': alert = buildWarningAlert(message, details); break;
         case 'error':   alert = buildErrorAlert(message,   details); break;
         default:        alert = buildInfoAlert(message,    details);
      }
      dispatch(alertBarActions.DisplayAlertBox(alert));
   };

return (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
         <Typography variant="h4" gutterBottom>
            AlertBar Markdown Formatting Demo
         </Typography>
         
         <Typography variant="body1" sx={{ mb: 3 }}>
            Click buttons to see different markdown formatting options in action.
         </Typography>

         <Stack spacing={2}>
            {demos.map((demo, index) => (
               <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                     variant="contained"
                     onClick={() => showAlert(demo.message, demo.severity, demo.details)}
                     sx={{ minWidth: 200 }}
                  >
                     {demo.label}
                  </Button>
                  <Typography variant="body2"
                              sx={{ fontFamily: 'monospace', color: 'text.secondary',
                                    textAlign: 'left' }}>
                     {demo.message}
                     {demo.details &&
                       <><br /><span style={{ fontSize: '0.85em', opacity: 0.7 }}>
                          {demo.details}
                       </span></>}
                  </Typography>
               </Box>
            ))}
         </Stack>

         <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Supported Syntax:</Typography>
            <Typography component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.9em',
                                              textAlign: 'left', margin: 'auto',
                                              width: 'fit-content'}}>
{`**bold**          → bold text
*italic*          → italic text
__underline__     → underlined text
~~strikethrough~~ → crossed out text
\`code\`            → inline code
==highlight==     → highlighted text
[text](url)       → clickable link`}
            </Typography>
         </Box>

         <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>Limitations:</Typography>
            <Typography component="ul" sx={{ textAlign: 'left', pl: 3 }}>
               <li>Nesting same-character markers produces unexpected results <br />
                   (e.g., <code>**bold *italic**</code> renders as <em>*bold italic**</em>)
               </li>
               <li>Mixing different markers only applies outer format<br />
                   (e.g., <code>**bold __underline__**</code> renders as&nbsp;
                    <strong>bold __underline__</strong>)
               </li>
               <li>External links only work for trusted domains
                   (localhost, smalgyax-files.org, amplify domains)
               </li>
               <li>Malicious URLs (javascript:, data:) are blocked for security</li>
            </Typography>
         </Box>
      </Box>
   );
};

export default MarkdownDemo;
