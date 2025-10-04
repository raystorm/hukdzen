import React from 'react'
import { useLocation } from 'react-router';

type Props = {}

//TODO: translate this message
export const NotFound = '404 - Page Not Found!';

const ErrorPage = (props: Props) => 
{
  const location = useLocation();
  const url = location.pathname;

  //TODO: 404 image

  return (
    <>
      <h1>{NotFound}</h1>
      <p>
         The Page you are trying to reach <strong><code>{url}</code></strong>,
         <br />
         does not appear to exist in our systems.
      </p>
      <p>We apologize for any inconvenience.</p>
    </>
  );
}

export default ErrorPage