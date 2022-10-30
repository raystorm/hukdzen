import React from 'react'
import { useLocation } from 'react-router-dom';

type Props = {}

const ErrorPage = (props: Props) => 
{
  const location = useLocation();
  const url = location.pathname; //'TODO: get Me from reactRouter.';

  return (
    <>
      <h1>404 - Page Not Found!</h1>
      <p>
        The Page you are trying to reach {url}, <br />
        does not appear to exist in our systems.
      </p>
      <p>We apologize for any inconvience.</p>
    </>
  );
}

export default ErrorPage