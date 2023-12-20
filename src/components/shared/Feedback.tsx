import react, {useState} from 'react';
import {useLocation} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {theme} from "./theme";

export const FeedbackTitle = 'Submit Feedback';
export const FeedbackText: string = 'Have a Question, Complaint or issue? Let us know!';

const FeedbackPlaceholder: string = 'Describe what you were doing, wha'

export const Feedback = () =>
{
   const [open, setOpen] = useState(false);
   
   const location = useLocation();
   const subject = `Smalgyax-Files.org | Feedback for ${location.pathname}`;
   //Should feedback have default and/or prompt text ?
   const [feedback, setFeedback] = useState('');

   const handleOpen = () => { setOpen(true); };

   const handleClose = () => { setOpen(false); };
   
   const sendFeedback = () => {
      handleClose();  //close the dialog
      //Open the Email client //TODO: domain emails
      const sendTo = 'Tom.Burton@Outlook.com'
      const subj = encodeURI(subject)
      const body = encodeURI(feedback)
      window.open(`mailto:${sendTo}?subject=${subj}&body=${body}`);
   }

   return (
      <>
         <IconButton aria-label={FeedbackTitle} onClick={handleOpen}>
            <HelpOutlineIcon sx={{color: theme.palette.primary.contrastText}} />
         </IconButton>
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{FeedbackTitle}</DialogTitle>
            <DialogContent>
               <DialogContentText>{FeedbackText}</DialogContentText>
               <TextField
                  sx={{color:theme.palette.primary.dark, fontWeight:'bolder'}}
                  id="Subject"
                  label="Subject"
                  type="text"
                  fullWidth
                  variant="filled"
                  InputProps={{ readOnly: true, }}
                  value={subject}
               />
               <TextField
                  autoFocus
                  multiline rows={3}
                  id="Feedback"
                  label="Feedback"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
               />
               <sub>
                  <em>NOTE:</em>&nbsp;
                  This form will open in an email for further editing before
                  any feedback is sent.
               </sub>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button onClick={sendFeedback}>Send Feedback</Button>
            </DialogActions>
         </Dialog>
      </>
   )
}