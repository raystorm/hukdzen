import {API, Hub} from 'aws-amplify';
import {HubCallback, LegacyCallback} from "@aws-amplify/core/src/Hub";
import {GraphQLQuery} from "@aws-amplify/api";

import ReduxStore from "./store";
import { userActions } from "../User/userSlice";
import { currentUserActions } from "../User/currentUserSlice";

import { CreateGyetInput, GetGyetQuery} from "../types/AmplifyTypes";
import * as queries from "../graphql/queries";
import * as mutations from '../graphql/mutations'
import {emptyGyet, Gyet} from "../User/userType";
import {Clan, getClanFromName} from "../User/ClanType";

//should fetch/save leverage the sagas?

const fetchUser = async (id: string) => {
   const tempUser = await API.graphql<GraphQLQuery<GetGyetQuery>>({
      query: queries.getGyet,
      variables: {id: id}
   });
   return tempUser;
};

const saveUser = async (user: CreateGyetInput)=> {
   return API.graphql({
               query: mutations.createGyet,
               variables: { input: user }
          })
}


/**
 *  handles the Sign In Event.
 *    Checks if initial sign in, or repeat sign in, routes to processor
 *  @param data Amplify Auth event data
 */
export const handleSignInEvent = (data:any) => {
   /*
    *  TODO: Load User Data, then call initial or, regular based on found
    */
   console.log('handling sign in event');

   const userId = data.username;

   const handleFetchUser = (user: any) => {
      console.log(`user found: ${JSON.stringify(user)}`);
      //console.log(`Bool: ${null === user.data.getGyet}`)

      if ( !user?.data ) { return; }

      if ( null === user.data.getGyet ) { initialSignInProcessor(data); }
      else { signInProcessor(data, user.data); }
   }

   fetchUser(userId).then(handleFetchUser,
                          (error) => { console.log(`${error}`) });

}


/**
 *
 *  @param data Amplify Auth event data
 */
const initialSignInProcessor = (data:any) => {
   /*
    *  TODO: 1. Create New User, 2. Save New User, 3. Stuff into App State
    */
   console.log(`handling initial sign in for: ${JSON.stringify(data)}`);

   //console.log('${JSON.stringify(data)}');

   /*
   let clan: typeof Clan | null = null;
   if ( data.payload.data.attributes["custom:clan"] )
   { clan = getClanFromName(data.payload.data.attributes["custom:clan"]) }
   */
   const user : CreateGyetInput = {
      id:    data.username,
      email: data.attributes.email,
      name:  data.attributes?.name,
      waa:   data.attributes["custom:waa"],
      //clan:  clan,
   }

   console.log(`creating: ${JSON.stringify(user)}`);

   //Stuff into App State via then, or call signInProcessor
   saveUser(user).then((created) =>
                       { console.log(`created: ${JSON.stringify(created)}`) });


}

/**
 *
 *
 *  @param data Amplify Auth event data
 *  @param user found DB user
 */
const signInProcessor = (data:any, user: GetGyetQuery) => {
   console.log(`handling sign in for (data): ${JSON.stringify(data)}`);
   console.log(`handling sign in for (user): ${JSON.stringify(user)}`);

   ReduxStore.dispatch(userActions.setUser(user.getGyet));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(user.getGyet));
}

export const handleSignOut = () => {
   console.log("signing out user.");
   ReduxStore.dispatch(userActions.setUser(emptyGyet));
   ReduxStore.dispatch(currentUserActions.setCurrentUser(emptyGyet));
}


export const authEventsProcessor = (data: any) : HubCallback | LegacyCallback => {
//any => {
   console.log(`Processing Auth Event:\n${JSON.stringify(data)}`);
   //console.log(`Processing Auth Event(2):\n ${data}`);
   switch (data.payload.event) {
      case 'signIn':
         handleSignInEvent(data.payload.data);
         console.log('user signed in');
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