import ReduxStore from "./store";
import { isDev } from "../utils/location";

import { userActions } from "../User/userSlice";
import { currentUserActions } from "../User/currentUserSlice";

import {emptyUser} from "../User/userType";
import { logger } from '../utils/logger';

/**
 *  handles the Sign In Event.
 *    Checks if initial sign in, or repeat sign in, routes to processor
 *  @param data Amplify Auth event data
 */
export const handleSignInEvent = (data: any) => {
   /* pass event to Redux Saga */
   logger.log('dispatching sign in event');
   ReduxStore.dispatch(currentUserActions.signIn(data));
}

export const handleSignOut = () => {
   logger.log("signing out user.");
   ReduxStore.dispatch(userActions.setUser(emptyUser));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(emptyUser));
}

/**
 *  events processor to fire the auth events when appropriate
 *  @param data
 */
export const authEventsProcessor = (data: any) => {
//any => {
   //logger.log('Processing Auth Event:', data);
   switch (data.payload.event) {
      case 'signIn':
      case 'cognitoHostedUI':
         logger.log('signing in user');
         handleSignInEvent(data.payload.data);
         return data;
      case 'signOut':
         handleSignOut();
         logger.log('user signed out');
         return data;
      /*
      case 'signUp':
         logger.log('user signed up');
         return data;
      case 'signIn_failure':
      case 'cognitoHostedUI_failure':
         logger.log('user sign in failed');
         return data;
      case 'configured':
         logger.log('the Auth module is configured');
      */
      default:
         return data;
   }
};