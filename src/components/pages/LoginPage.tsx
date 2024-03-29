import { useAppSelector } from "../../app/hooks";


const LoginPage = (): JSX.Element => {

  const user = useAppSelector(state => state.currentUser);

  return <>
           <h1>Hello {user.name}</h1>
           <p>If you can read this message you have successfully signed in.</p>
         </>;
}

export default LoginPage;