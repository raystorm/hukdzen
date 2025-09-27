import ReduxStore from "./store";
import { isDev } from "../components/shared/location";

import { userActions } from "../User/userSlice";
import { currentUserActions } from "../User/currentUserSlice";

import {emptyUser} from "../User/userType";

const isLog = isDev();

/**
 *  handles the Sign In Event.
 *    Checks if initial sign in, or repeat sign in, routes to processor
 *  @param data Amplify Auth event data
 */
export const handleSignInEvent = (data:any) => {
   /* pass event to Redux Saga */
   if ( isLog ) { console.log('dispatching sign in event'); }
   ReduxStore.dispatch(currentUserActions.signIn(data));
}

export const handleSignOut = () => {
   if ( isLog ) { console.log("signing out user."); }
   ReduxStore.dispatch(userActions.setUser(emptyUser));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(emptyUser));
}

/**
 *  events processor to fire the auth events when appropriate
 *  @param data
 */
export const authEventsProcessor = (data: any) => {
//any => {
   //if ( isLog )
   //{ console.log(`Processing Auth Event:\n${JSON.stringify(data)}`); }
   //console.log(`Processing Auth Event(2):\n ${data}`);
   switch (data.payload.event) {
      case 'signIn':
      case 'cognitoHostedUI':
         if ( isLog ) { console.log('signing in user'); }
         handleSignInEvent(data.payload.data);
         break;
      case 'signOut':
         handleSignOut();
         if ( isLog ) { console.log('user signed out'); }
         break;
      /*
      case 'signUp':
         console.log('user signed up');
         break;
      case 'signIn_failure':
      case 'cognitoHostedUI_failure':
         console.log('user sign in failed');
         break;
      case 'configured':
         console.log('the Auth module is configured');
      */
   }
   return data;
};