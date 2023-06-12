import {HubCallback, LegacyCallback} from "@aws-amplify/core/src/Hub";

import ReduxStore from "./store";
import { userActions } from "../User/userSlice";
import { currentUserActions } from "../User/currentUserSlice";

import { CreateUserInput, GetUserQuery} from "../types/AmplifyTypes";
import {emptyUser, User} from "../User/userType";
import {Clans, getClanFromName} from "../Gyet/ClanType";
import {createUser, getUserById} from "../User/userSaga";

/**
 *  handles the Sign In Event.
 *    Checks if initial sign in, or repeat sign in, routes to processor
 *  @param data Amplify Auth event data
 */
export const handleSignInEvent = (data:any) => {
   /*
    *  Load User Data, then call initial or, regular based on found
    */
   console.log('handling sign in event');

   const userId = data.username;

   const handleFetchUser = (user: any) => {
      console.log(`user found: ${JSON.stringify(user)}`);
      //console.log(`Bool: ${null === user.data.getUser}`)

      if ( !user?.data ) { return; }

      if ( null === user.data.getUser ) { initialSignInProcessor(data); }
      else { signInProcessor(data, user.data); }
   }

   getUserById(userId).then(handleFetchUser,
                            (error) => { console.log(`${error}`) });

}


/**
 *
 *  @param data Amplify Auth event data
 */
const initialSignInProcessor = (data:any) => {
   /*
    *  Steps:
    *    1. Create New User,
    *    2. Save New User,
    *    3. Stuff into App State
    */
   console.log(`handling initial sign in for: ${JSON.stringify(data)}`);

   //console.log('${JSON.stringify(data)}');

   /*
   let clan: typeof Clan | null = null;
   if ( data.payload.data.attributes["custom:clan"] )
   { clan = getClanFromName(data.payload.data.attributes["custom:clan"]) }
   */

   let admin = false;
   if ( data.signInUserSession.idToken.payload['cognito:groups'] )
   {
      admin = data.signInUserSession.idToken.payload['cognito:groups']
                  .includes('WebAppAdmin')
   }

   const user : User = {
      ...emptyUser,
      id:      data.username,
      email:   data.attributes.email,
      name:    data.attributes?.name,
      waa:     data.attributes["custom:waa"],
      isAdmin: admin,
      //clan:  clan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   }

   console.log(`creating: ${JSON.stringify(user)}`);

   //Stuff into App State via then, or call signInProcessor
   createUser(user).then((created) =>
                         { console.log(`created: ${JSON.stringify(created)}`) });
}

/**
 *
 *
 *  @param data Amplify Auth event data
 *  @param user found DB user
 */
const signInProcessor = (data:any, user: GetUserQuery) => {
   console.log(`handling sign in for (data): ${JSON.stringify(data)}`);
   console.log(`handling sign in for (user): ${JSON.stringify(user)}`);

   ReduxStore.dispatch(userActions.setUser(user.getUser));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(user.getUser));
}

export const handleSignOut = () => {
   console.log("signing out user.");
   ReduxStore.dispatch(userActions.setUser(emptyUser));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(emptyUser));
}


export const authEventsProcessor = (data: any) : HubCallback | LegacyCallback => {
//any => {
   //console.log(`Processing Auth Event:\n${JSON.stringify(data)}`);
   //console.log(`Processing Auth Event(2):\n ${data}`);
   switch (data.payload.event) {
      case 'signIn':
         console.log('signing in user');
         handleSignInEvent(data.payload.data);
         break;
      case 'signOut':
         handleSignOut();
         console.log('user signed out');
         break;
      /*
      case 'signUp':
         console.log('user signed up');
         break;
      case 'signIn_failure':
         console.log('user sign in failed');
         break;
      case 'configured':
         console.log('the Auth module is configured');
      */
   }
   return data;
};