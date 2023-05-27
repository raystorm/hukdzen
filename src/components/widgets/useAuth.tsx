import React, {useEffect, useState} from 'react'
import { useDispatch } from "react-redux";
import { TextField } from '@aws-amplify/ui-react';

import {Amplify, Auth} from 'aws-amplify';
import {Authenticator, SelectField, useAuthenticator} from '@aws-amplify/ui-react';
//import '@aws-amplify/ui-react/styles.css';

import '../../Amplify.css';
import awsExports from '../../aws-exports';

import {Clan, printClanType} from "../../User/ClanType";
import {userActions} from "../../User/userSlice";
import {handleSignInEvent} from "../../app/AuthEventsProcessor";
import {useAppSelector} from "../../app/hooks";
import {emptyGyet} from "../../User/userType";


const useAuth = (component: JSX.Element ): JSX.Element =>
{
   const dispatch = useDispatch();

   const formFields =
   {
      signUp: {
         email: { isRequired: true, },
         name:  { isRequired: true, },
      },
   }

   //const signUpAttributes= {['custom:waa']};

   const user = useAppSelector(state => state.currentUser);
   const auth = useAuthenticator(context => [context.route]);
   const amplifyUser = auth.user;

   const isAuth = () => { return user !== emptyGyet }
   //const isAuth = false;
   const [isAdmin, setIsAdmin] = useState(isAuth() && user.isAdmin);

   if ( ( null == user && null != amplifyUser )
     || ( null != amplifyUser && user.id != amplifyUser.username ) )
   { handleSignInEvent(amplifyUser); }

   const checkWebAppAdmin = () =>
   {
      Auth.currentAuthenticatedUser()
          .then((response) => {
             const admin = response.signInUserSession.idToken
                .payload['cognito:groups']
                .includes('WebAppAdmin');
             setIsAdmin(admin || user.isAdmin);
             if ( admin && admin != user.isAdmin )
             { dispatch(userActions.setUser({...user, isAdmin: true})); }
          });
   }

   useEffect(() =>{
      checkWebAppAdmin();
   }, [user, amplifyUser]);

   const signUpComponent = {
      SignUp: {
         FormFields() {
            const { validationErrors } = useAuthenticator();

            return (
               <>
                  {/* Re-use default `Authenticator.SignUp.FormFields` */}
                  <Authenticator.SignUp.FormFields />

                  <TextField label="Waa" placeholder="Smalgyax Name"
                             name="custom:waa" type="text"
                  />

                  {/* Remove for Now, until I can add Clan to create
                  <SelectField label='Clan' name='custom:clan' >
                     <option value={''} >(Optional) Select your clan.</option>
                     <option value={printClanType(Clan.Raven)} >{printClanType(Clan.Raven)}</option>
                     <option value={printClanType(Clan.Eagle)} >{printClanType(Clan.Eagle)}</option>
                     <option value={printClanType(Clan.Wolf)} >{printClanType(Clan.Wolf)}</option>
                     <option value={printClanType(Clan.Killerwhale)} >{printClanType(Clan.Killerwhale)}</option>
                  </SelectField>
                  */}
               </>
            );
         },
      },
   };

   return (
      <Authenticator
        formFields={formFields}
        signUpAttributes={['name']}
        components={signUpComponent}
      >
        {component}
      </Authenticator>
   );
}

export default useAuth;