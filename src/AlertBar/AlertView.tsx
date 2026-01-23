import React from "react";
import { SnackbarContent, CustomContentProps, closeSnackbar } from 'notistack'
import AlertTitle from "@mui/material/AlertTitle";
import Alert, { AlertColor } from "@mui/material/Alert";
import { Box, Collapse, Typography } from "@mui/material";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { AlertViewExtras } from "./AlertBarTypes";
import { logger } from '../utils/logger';
import { renderMarkdown } from '../utils/markdownParser';

type AlertViewProps = CustomContentProps & AlertViewExtras;

/**
 *  Custom Component to Display styled User Alert Feedback Notifications
 */
export const AlertView = React.forwardRef<HTMLDivElement, AlertViewProps>(
                                         (props, ref) =>
{
   const { id, message, variant, severity = 'info', details, ...other } = props;
   //logger.log('AlertView', { id, message, variant, severity, details, other });

   //const handleClose = () => { dispatch(alertBarActions.HideAlertBox()); }
   const handleClose = () => { closeSnackbar(id); }

   const [expanded, setExpanded] = React.useState(false);
   const toggle = () => setExpanded(prev => !prev);

   let renderMsg: React.ReactNode;
   if (typeof message === 'string') { renderMsg = renderMarkdown(message); }
   else { renderMsg = message }

   return (
     <SnackbarContent ref={ref} role='alert' {...other} >
       <Alert severity={severity} variant="filled">
          <AlertTitle><strong>{severity.toUpperCase()}</strong></AlertTitle>
          {renderMsg}
          <IconButton aria-label='Close' style={{color: 'inherit'}}
                     onClick={handleClose} >
            <HighlightOffIcon />
          </IconButton>
          {details && (
             <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                   <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
                      Technical Details
                   </Typography>
                   <IconButton onClick={toggle} size="small"
                               style={{ color: 'inherit', marginLeft: 4 }} >
                      {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                   </IconButton>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                   <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap',
                                 fontSize: '0.85em', opacity: 0.9,
                                 color: '#000000', backgroundColor: '#ffffff'}} >
                     {details}
                   </pre>
                </Collapse>
             </>
          )}
       </Alert>
     </SnackbarContent>
   );
});