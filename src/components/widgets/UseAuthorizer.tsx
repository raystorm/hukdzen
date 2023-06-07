import React, {useEffect, useState} from 'react'
import { useDispatch } from "react-redux";
import { TextField } from '@aws-amplify/ui-react';

import {Amplify, Auth} from 'aws-amplify';
import {Authenticator, SelectField, useAuthenticator} from '@aws-amplify/ui-react';

import '../../Amplify.css';

import {Clan, printClanType} from "../../Gyet/ClanType";
import {userActions} from "../../User/userSlice";
import {handleSignInEvent} from "../../app/AuthEventsProcessor";
import {useAppSelector} from "../../app/hooks";

/**
 *  Component to validate user/Groups and page load and stuff CurrentUser
 *  @param component
 *  @constructor
 */
const useAuthorizer = () =>
{
   const dispatch = useDispatch();

   //current site user
   const user = useAppSelector(state => state.currentUser);

   const { user: amplifyUser } = useAuthenticator(context => [context.route]);

   /*
    *  Fallback data validation, incase the Auth event doesn't properly fire
    */
   if ( ( null == user && null != amplifyUser )
     || ( null != amplifyUser && user.id != amplifyUser.username ) )
   { handleSignInEvent(amplifyUser); }

   /** Handler to Validate Admin group from AWS */
   const checkWebAppAdmin = () =>
   {
      Auth.currentAuthenticatedUser()
          .then((response) => {
             const admin = response.signInUserSession.idToken
                .payload['cognito:groups']
                .includes('WebAppAdmin');
             if ( admin && admin != user.isAdmin )
             { dispatch(userActions.setUser({...user, isAdmin: true})); }
          });
   }

   useEffect(() =>{ checkWebAppAdmin(); }, [user, amplifyUser]);

   return;
}

export default useAuthorizer;