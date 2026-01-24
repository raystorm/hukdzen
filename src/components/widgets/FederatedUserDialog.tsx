import {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";

import Dialog from "@mui/material/Dialog";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import {useAuthenticator} from '@aws-amplify/ui-react';
import {fetchAuthSession} from 'aws-amplify/auth';

import {useAppSelector} from "../../app/hooks";
import { logger } from '../../utils/logger';
import UserForm from "../../User/UserForm";
import {MISSING_NAME_ERROR} from "../../User/userSaga";
import {userActions} from "../../User/userSlice";
import {currentUserActions} from "../../User/currentUserSlice";
import {emptyUser} from "../../User/userType";

export const FederatedUserDialogTitle = 'Tell me about Yourself';
export const FederatedUserDialogText: string = 'New User Detected. Please finish your profile.';


export const FederatedUserDialog = () =>
{
   const dispatch = useDispatch();
   const [open, setOpen] = useState(false); //Dialog visible state

   const openDialog = () => { setOpen(true); };

   const handleClose = () => { setOpen(false); };

   //current site user
   const user = useAppSelector(state => state.currentUser);

   //current Auth user from Amplify
   const { user: amplifyUser } = useAuthenticator(context => [context.user]);

   /** Handler to Validate Admin group from AWS */
   const checkWebAppAdmin = () =>
   {
      //getCurrentUser()
      fetchAuthSession()
         .then((response) => {
            let admin = false;
            if ( response.tokens )
            {  // @ts-ignore
               admin = response.tokens.idToken.payload['cognito:groups']?.includes('WebAppAdmin');
            }
            if ( admin && admin !== user.isAdmin )
            { dispatch(userActions.setUser({...user, isAdmin: true})); }
         })
         .catch(error => {}); //ignore not logged in.
   }

   /**
    * Checks for sign in mismatch,
    * and dispatches the event if found.
    */
   const checkSignIn = () => {
      if ( ( !user && amplifyUser )
        || ( amplifyUser && user.id !== amplifyUser.username ) )
      {
         logger.log('backup sign in from: FederatedUserDialog');
         //handleSignInEvent(amplifyUser);
         dispatch(currentUserActions.signIn(amplifyUser));
      }
      if ( !!user && !user.isAdmin ) { checkWebAppAdmin(); }
   }
   checkSignIn();

   useEffect(() => {
      checkSignIn()
      //display the dialog when the user exists and is missing a name.
      if ( !!user && emptyUser !== user && !!amplifyUser &&
           ( /* !user.name || */ MISSING_NAME_ERROR === user.name ) )
      { openDialog(); }
   },// []);
   [user, amplifyUser]);

   return (
         <Dialog open={open}>
            <DialogTitle>{FederatedUserDialogTitle}</DialogTitle>
            <DialogContent>
               <DialogContentText>{FederatedUserDialogText}</DialogContentText>
               <UserForm user={user} isCreateForm additionalSaveAction={handleClose} />
            </DialogContent>
         </Dialog>
   );
}