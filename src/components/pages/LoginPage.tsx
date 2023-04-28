import react from "react";
import { useAppSelector } from "../../app/hooks";
import { useAuthenticator } from "@aws-amplify/ui-react";

export const LoginPage = () => {

   const user = useAppSelector(state => state.currentUser);

  return <>
            <h1>Hello {user.name}</h1>
            <p>If you can read this message you have successfully signed in.</p>
          </>;
}