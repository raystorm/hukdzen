import React, {JSX} from 'react'
import {TextField, View} from '@aws-amplify/ui-react';
import {Authenticator, useAuthenticator} from '@aws-amplify/ui-react';

import '../../Amplify.css';


const useAuth = (component: JSX.Element ): JSX.Element =>
{
   const formFields =
   {
      signUp: {
         email: { isRequired: true, },
         name:  { isRequired: true, },
      },
   }

   const signUpComponent = {
      SignUp: {
         FormFields() {
            // const { validationErrors } = useAuthenticator((context) => [context.user]);

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
      <View className="auth-wrapper">
         <Authenticator
           formFields={formFields}
           signUpAttributes={['name']}
           components={signUpComponent}
         >
           {component}
         </Authenticator>
      </View>
   );
}

export default useAuth;