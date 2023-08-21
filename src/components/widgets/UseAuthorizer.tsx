import React, {useEffect} from 'react'
import { useDispatch } from "react-redux";

import {Amplify, Auth} from 'aws-amplify';
import { useAuthenticator } from '@aws-amplify/ui-react';

import config from "../../aws-exports";
import '../../Amplify.css';

import {userActions} from "../../User/userSlice";
import {useAppSelector} from "../../app/hooks";
import {currentUserActions} from "../../User/currentUserSlice";

Amplify.configure(config);

/**
 *  Component to validate user/Groups and page load and stuff CurrentUser
 *  @constructor
 */
const useAuthorizer = () =>
{
   const dispatch = useDispatch();

   //current site user
   const user = useAppSelector(state => state.currentUser);

   const { user: amplifyUser } = useAuthenticator(context => [context.user]);

   /** Handler to Validate Admin group from AWS */
   const checkWebAppAdmin = () =>
   {
      Auth.currentAuthenticatedUser()
          .then((response) => {
                const admin = response.signInUserSession.idToken
                                      .payload['cognito:groups']
                                      ?.includes('WebAppAdmin');
                if ( admin && admin !== user.isAdmin )
                { dispatch(userActions.setUser({...user, isAdmin: true})); }
               });
   }


   //wrap in useEffect to limit looping

   const checkSignIn = () => {
      if ( ( null === user && amplifyUser )
        || ( amplifyUser && user.id !== amplifyUser.username ) )
      {
         console.log('backup sign in from: useAuthorizer');
         //handleSignInEvent(amplifyUser);
         dispatch(currentUserActions.signIn(amplifyUser));
      }
      if ( user && !user.isAdmin ) { checkWebAppAdmin(); }
   }

   useEffect(() => { checkSignIn() }, []);
   useEffect(() => { checkSignIn() }, [amplifyUser]);

   return;
}

export default useAuthorizer;