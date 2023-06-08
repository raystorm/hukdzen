import React from 'react'
import { useLocation } from 'react-router-dom';

type Props = {}

//TODO: translate this message
export const NotFound = '404 - Page Not Found!';

const ErrorPage = (props: Props) => 
{
  const location = useLocation();
  //TODO: get Me from reactRouter.
  const url = location.pathname;

  return (
    <>
      <h1>{NotFound}</h1>
      <p>
        The Page you are trying to reach {url}, <br />
        does not appear to exist in our systems.
      </p>
      <p>We apologize for any inconvience.</p>
    </>
  );
}

export default ErrorPage